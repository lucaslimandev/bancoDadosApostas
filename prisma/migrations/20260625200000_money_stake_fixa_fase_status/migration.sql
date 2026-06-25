-- Data migration: elimina "unidades" (tudo passa a R$), introduz stake fixa configurável,
-- stakes por modelo (back/lay), fase/minuto/periodo da entrada, critérios de entrada/saída
-- e status Aberta/Encerrada da operação.
--
-- Estratégia: captura os valores antigos (valorUnidade, stakePadraoPercent) numa tabela
-- temporária ANTES de recriar as tabelas, para poder converter stake/responsabilidade/lucro/
-- banca/stops de "u" para R$ sem perder histórico.

CREATE TEMP TABLE "_old_config_snapshot" AS
  SELECT
    COALESCE((SELECT "valorUnidade" FROM "Configuracao" LIMIT 1), 50) AS "valorUnidade",
    COALESCE((SELECT "stakePadraoPercent" FROM "Configuracao" LIMIT 1), 2) AS "stakePadraoPercent";

PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

-- Configuracao: bancaInicial/stops convertidos para R$; nasce a stake fixa (percentual,
-- herdando o antigo stakePadraoPercent; valor calculado a partir da banca já em R$).
CREATE TABLE "new_Configuracao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bancaInicial" REAL NOT NULL DEFAULT 1000,
    "stakeModo" TEXT NOT NULL DEFAULT 'Percentual',
    "stakeValor" REAL NOT NULL DEFAULT 50,
    "stakePercentual" REAL NOT NULL DEFAULT 2,
    "stopLossDiario" REAL NOT NULL DEFAULT 50,
    "stopGainDiario" REAL NOT NULL DEFAULT 80,
    "maxOperacoesSimultaneas" INTEGER NOT NULL DEFAULT 2,
    "tema" TEXT NOT NULL DEFAULT 'dark',
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Configuracao" ("id", "bancaInicial", "stakeModo", "stakeValor", "stakePercentual", "stopLossDiario", "stopGainDiario", "maxOperacoesSimultaneas", "tema", "updatedAt")
SELECT
  "id",
  "bancaInicial" * (SELECT "valorUnidade" FROM "_old_config_snapshot"),
  'Percentual',
  ("bancaInicial" * (SELECT "valorUnidade" FROM "_old_config_snapshot")) * (SELECT "stakePadraoPercent" FROM "_old_config_snapshot") / 100.0,
  (SELECT "stakePadraoPercent" FROM "_old_config_snapshot"),
  "stopLossDiario" * (SELECT "valorUnidade" FROM "_old_config_snapshot"),
  "stopGainDiario" * (SELECT "valorUnidade" FROM "_old_config_snapshot"),
  "maxOperacoesSimultaneas",
  "tema",
  "updatedAt"
FROM "Configuracao";
DROP TABLE "Configuracao";
ALTER TABLE "new_Configuracao" RENAME TO "Configuracao";

-- Meta: metaLucroUnidades (u) -> metaLucro (R$)
CREATE TABLE "new_Meta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mes" TEXT NOT NULL,
    "metaLucro" REAL NOT NULL,
    "metaOperacoes" INTEGER NOT NULL
);
INSERT INTO "new_Meta" ("id", "mes", "metaLucro", "metaOperacoes")
SELECT "id", "mes", "metaLucroUnidades" * (SELECT "valorUnidade" FROM "_old_config_snapshot"), "metaOperacoes" FROM "Meta";
DROP TABLE "Meta";
ALTER TABLE "new_Meta" RENAME TO "Meta";
CREATE UNIQUE INDEX "Meta_mes_key" ON "Meta"("mes");

-- Metodo: novos campos de stake (back/lay) e critérios padrão, sem dado antigo a converter.
CREATE TABLE "new_Metodo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "cor" TEXT NOT NULL DEFAULT '#facc15',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "usaBack" BOOLEAN NOT NULL DEFAULT true,
    "usaLay" BOOLEAN NOT NULL DEFAULT true,
    "stakesBack" REAL DEFAULT 1,
    "stakesLay" REAL DEFAULT 1,
    "criterioEntradaPadrao" TEXT,
    "criterioSaidaPadrao" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Metodo" ("id", "nome", "descricao", "cor", "ativo", "createdAt", "updatedAt")
SELECT "id", "nome", "descricao", "cor", "ativo", "createdAt", "updatedAt" FROM "Metodo";
DROP TABLE "Metodo";
ALTER TABLE "new_Metodo" RENAME TO "Metodo";
CREATE UNIQUE INDEX "Metodo_nome_key" ON "Metodo"("nome");

-- Operacao: stake/responsabilidade/lucro convertidos para R$; fase/minutoEntrada/periodo
-- extraídos best-effort do texto livre antigo de "momento"; operações existentes (que já
-- têm resultado) são marcadas como Encerrada.
CREATE TABLE "new_Operacao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "data" DATETIME NOT NULL,
    "ligaId" TEXT NOT NULL,
    "timeCasaId" TEXT NOT NULL,
    "timeForaId" TEXT NOT NULL,
    "mercado" TEXT NOT NULL,
    "metodoId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "momento" TEXT NOT NULL,
    "fase" TEXT NOT NULL DEFAULT 'PreJogo',
    "minutoEntrada" INTEGER,
    "periodo" TEXT,
    "oddEntrada" REAL NOT NULL,
    "oddSaida" REAL,
    "stake" REAL NOT NULL,
    "responsabilidade" REAL,
    "criterioEntrada" TEXT,
    "criterioSaida" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Encerrada',
    "resultado" TEXT,
    "lucro" REAL,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Operacao_ligaId_fkey" FOREIGN KEY ("ligaId") REFERENCES "Liga" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Operacao_timeCasaId_fkey" FOREIGN KEY ("timeCasaId") REFERENCES "Time" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Operacao_timeForaId_fkey" FOREIGN KEY ("timeForaId") REFERENCES "Time" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Operacao_metodoId_fkey" FOREIGN KEY ("metodoId") REFERENCES "Metodo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Operacao" ("id", "data", "ligaId", "timeCasaId", "timeForaId", "mercado", "metodoId", "tipo", "momento", "fase", "minutoEntrada", "periodo", "oddEntrada", "oddSaida", "stake", "responsabilidade", "status", "resultado", "lucro", "observacoes", "createdAt", "updatedAt")
SELECT
  "id", "data", "ligaId", "timeCasaId", "timeForaId", "mercado", "metodoId", "tipo", "momento",
  CASE WHEN "momento" LIKE 'Pré-jogo%' THEN 'PreJogo' ELSE 'AoVivo' END,
  CASE WHEN "momento" NOT LIKE 'Pré-jogo%' AND instr("momento", char(39)) > 0
       THEN CAST(substr("momento", 1, instr("momento", char(39)) - 1) AS INTEGER)
       ELSE NULL END,
  CASE WHEN "momento" NOT LIKE 'Pré-jogo%' AND instr("momento", char(39)) > 0
       THEN TRIM(substr("momento", instr("momento", char(39)) + 1))
       ELSE NULL END,
  "oddEntrada", "oddSaida",
  "stake" * (SELECT "valorUnidade" FROM "_old_config_snapshot"),
  CASE WHEN "responsabilidade" IS NULL THEN NULL ELSE "responsabilidade" * (SELECT "valorUnidade" FROM "_old_config_snapshot") END,
  'Encerrada',
  "resultado",
  "lucro" * (SELECT "valorUnidade" FROM "_old_config_snapshot"),
  "observacoes", "createdAt", "updatedAt"
FROM "Operacao";
DROP TABLE "Operacao";
ALTER TABLE "new_Operacao" RENAME TO "Operacao";
CREATE INDEX "Operacao_data_idx" ON "Operacao"("data");
CREATE INDEX "Operacao_ligaId_idx" ON "Operacao"("ligaId");
CREATE INDEX "Operacao_metodoId_idx" ON "Operacao"("metodoId");
CREATE INDEX "Operacao_tipo_idx" ON "Operacao"("tipo");
CREATE INDEX "Operacao_status_idx" ON "Operacao"("status");
CREATE INDEX "Operacao_fase_idx" ON "Operacao"("fase");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

DROP TABLE "_old_config_snapshot";
