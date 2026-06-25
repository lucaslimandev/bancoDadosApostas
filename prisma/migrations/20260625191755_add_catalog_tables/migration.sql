-- CreateTable
CREATE TABLE "Metodo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "cor" TEXT NOT NULL DEFAULT '#facc15',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Liga" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "pais" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'Liga',
    "nivel" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Time" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "pais" TEXT,
    "abreviacao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ligaId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Time_ligaId_fkey" FOREIGN KEY ("ligaId") REFERENCES "Liga" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Operacao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "data" DATETIME NOT NULL,
    "liga" TEXT NOT NULL,
    "timeCasa" TEXT NOT NULL,
    "timeFora" TEXT NOT NULL,
    "ligaId" TEXT,
    "timeCasaId" TEXT,
    "timeForaId" TEXT,
    "mercado" TEXT NOT NULL,
    "metodo" TEXT NOT NULL,
    "metodoId" TEXT,
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
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Operacao_ligaId_fkey" FOREIGN KEY ("ligaId") REFERENCES "Liga" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Operacao_timeCasaId_fkey" FOREIGN KEY ("timeCasaId") REFERENCES "Time" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Operacao_timeForaId_fkey" FOREIGN KEY ("timeForaId") REFERENCES "Time" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Operacao_metodoId_fkey" FOREIGN KEY ("metodoId") REFERENCES "Metodo" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Operacao" ("createdAt", "data", "id", "liga", "lucro", "mercado", "metodo", "momento", "observacoes", "oddEntrada", "oddSaida", "responsabilidade", "resultado", "stake", "timeCasa", "timeFora", "tipo", "updatedAt") SELECT "createdAt", "data", "id", "liga", "lucro", "mercado", "metodo", "momento", "observacoes", "oddEntrada", "oddSaida", "responsabilidade", "resultado", "stake", "timeCasa", "timeFora", "tipo", "updatedAt" FROM "Operacao";
DROP TABLE "Operacao";
ALTER TABLE "new_Operacao" RENAME TO "Operacao";
CREATE INDEX "Operacao_data_idx" ON "Operacao"("data");
CREATE INDEX "Operacao_ligaId_idx" ON "Operacao"("ligaId");
CREATE INDEX "Operacao_metodoId_idx" ON "Operacao"("metodoId");
CREATE INDEX "Operacao_tipo_idx" ON "Operacao"("tipo");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Metodo_nome_key" ON "Metodo"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Liga_nome_key" ON "Liga"("nome");

-- CreateIndex
CREATE INDEX "Time_ligaId_idx" ON "Time"("ligaId");

-- CreateIndex
CREATE INDEX "Time_nome_idx" ON "Time"("nome");
