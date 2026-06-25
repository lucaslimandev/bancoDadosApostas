-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "oddEntrada" REAL NOT NULL,
    "oddSaida" REAL,
    "stake" REAL NOT NULL,
    "responsabilidade" REAL,
    "resultado" TEXT NOT NULL,
    "lucro" REAL NOT NULL,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Operacao_ligaId_fkey" FOREIGN KEY ("ligaId") REFERENCES "Liga" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Operacao_timeCasaId_fkey" FOREIGN KEY ("timeCasaId") REFERENCES "Time" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Operacao_timeForaId_fkey" FOREIGN KEY ("timeForaId") REFERENCES "Time" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Operacao_metodoId_fkey" FOREIGN KEY ("metodoId") REFERENCES "Metodo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Operacao" ("createdAt", "data", "id", "ligaId", "lucro", "mercado", "metodoId", "momento", "observacoes", "oddEntrada", "oddSaida", "responsabilidade", "resultado", "stake", "timeCasaId", "timeForaId", "tipo", "updatedAt") SELECT "createdAt", "data", "id", "ligaId", "lucro", "mercado", "metodoId", "momento", "observacoes", "oddEntrada", "oddSaida", "responsabilidade", "resultado", "stake", "timeCasaId", "timeForaId", "tipo", "updatedAt" FROM "Operacao";
DROP TABLE "Operacao";
ALTER TABLE "new_Operacao" RENAME TO "Operacao";
CREATE INDEX "Operacao_data_idx" ON "Operacao"("data");
CREATE INDEX "Operacao_ligaId_idx" ON "Operacao"("ligaId");
CREATE INDEX "Operacao_metodoId_idx" ON "Operacao"("metodoId");
CREATE INDEX "Operacao_tipo_idx" ON "Operacao"("tipo");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

