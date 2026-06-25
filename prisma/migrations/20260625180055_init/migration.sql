-- CreateTable
CREATE TABLE "Operacao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "data" DATETIME NOT NULL,
    "liga" TEXT NOT NULL,
    "timeCasa" TEXT NOT NULL,
    "timeFora" TEXT NOT NULL,
    "mercado" TEXT NOT NULL,
    "metodo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "momento" TEXT NOT NULL,
    "oddEntrada" REAL NOT NULL,
    "oddSaida" REAL,
    "stake" REAL NOT NULL,
    "responsabilidade" REAL,
    "resultado" TEXT NOT NULL,
    "lucro" REAL NOT NULL,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Configuracao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bancaInicial" REAL NOT NULL DEFAULT 100,
    "valorUnidade" REAL NOT NULL DEFAULT 50,
    "stopLossDiario" REAL NOT NULL DEFAULT 5,
    "stopGainDiario" REAL NOT NULL DEFAULT 8,
    "stakePadraoPercent" REAL NOT NULL DEFAULT 2,
    "maxOperacoesSimultaneas" INTEGER NOT NULL DEFAULT 2,
    "tema" TEXT NOT NULL DEFAULT 'dark',
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Meta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mes" TEXT NOT NULL,
    "metaLucroUnidades" REAL NOT NULL,
    "metaOperacoes" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "Operacao_data_idx" ON "Operacao"("data");

-- CreateIndex
CREATE INDEX "Operacao_liga_idx" ON "Operacao"("liga");

-- CreateIndex
CREATE INDEX "Operacao_metodo_idx" ON "Operacao"("metodo");

-- CreateIndex
CREATE INDEX "Operacao_tipo_idx" ON "Operacao"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "Meta_mes_key" ON "Meta"("mes");
