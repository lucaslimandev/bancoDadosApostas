-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "TipoOperacao" AS ENUM ('Lay', 'Back', 'Trade');

-- CreateEnum
CREATE TYPE "ResultadoOperacao" AS ENUM ('Green', 'Red', 'Anulado');

-- CreateEnum
CREATE TYPE "LigaTipo" AS ENUM ('Liga', 'Copa', 'Continental', 'Selecoes');

-- CreateEnum
CREATE TYPE "FaseOperacao" AS ENUM ('PreJogo', 'AoVivo');

-- CreateEnum
CREATE TYPE "StatusOperacao" AS ENUM ('Aberta', 'Encerrada');

-- CreateEnum
CREATE TYPE "ModoStake" AS ENUM ('Valor', 'Percentual');

-- CreateTable
CREATE TABLE "Metodo" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "cor" TEXT NOT NULL DEFAULT '#facc15',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "usaBack" BOOLEAN NOT NULL DEFAULT true,
    "usaLay" BOOLEAN NOT NULL DEFAULT true,
    "stakesBack" DOUBLE PRECISION DEFAULT 1,
    "stakesLay" DOUBLE PRECISION DEFAULT 1,
    "criterioEntradaPadrao" TEXT,
    "criterioSaidaPadrao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Metodo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Liga" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "pais" TEXT NOT NULL,
    "tipo" "LigaTipo" NOT NULL DEFAULT 'Liga',
    "nivel" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Liga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Time" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "pais" TEXT,
    "abreviacao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ligaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Time_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Operacao" (
    "id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "ligaId" TEXT NOT NULL,
    "timeCasaId" TEXT NOT NULL,
    "timeForaId" TEXT NOT NULL,
    "mercado" TEXT NOT NULL,
    "metodoId" TEXT NOT NULL,
    "tipo" "TipoOperacao" NOT NULL,
    "momento" TEXT NOT NULL,
    "fase" "FaseOperacao" NOT NULL DEFAULT 'PreJogo',
    "minutoEntrada" INTEGER,
    "periodo" TEXT,
    "oddEntrada" DOUBLE PRECISION NOT NULL,
    "oddSaida" DOUBLE PRECISION,
    "stake" DOUBLE PRECISION NOT NULL,
    "responsabilidade" DOUBLE PRECISION,
    "criterioEntrada" TEXT,
    "criterioSaida" TEXT,
    "status" "StatusOperacao" NOT NULL DEFAULT 'Encerrada',
    "resultado" "ResultadoOperacao",
    "lucro" DOUBLE PRECISION,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Operacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Configuracao" (
    "id" SERIAL NOT NULL,
    "bancaInicial" DOUBLE PRECISION NOT NULL DEFAULT 1000,
    "stakeModo" "ModoStake" NOT NULL DEFAULT 'Percentual',
    "stakeValor" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "stakePercentual" DOUBLE PRECISION NOT NULL DEFAULT 2,
    "stopLossDiario" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "stopGainDiario" DOUBLE PRECISION NOT NULL DEFAULT 80,
    "maxOperacoesSimultaneas" INTEGER NOT NULL DEFAULT 2,
    "tema" TEXT NOT NULL DEFAULT 'dark',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Configuracao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meta" (
    "id" SERIAL NOT NULL,
    "mes" TEXT NOT NULL,
    "metaLucro" DOUBLE PRECISION NOT NULL,
    "metaOperacoes" INTEGER NOT NULL,

    CONSTRAINT "Meta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Metodo_nome_key" ON "Metodo"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Liga_nome_key" ON "Liga"("nome");

-- CreateIndex
CREATE INDEX "Time_ligaId_idx" ON "Time"("ligaId");

-- CreateIndex
CREATE INDEX "Time_nome_idx" ON "Time"("nome");

-- CreateIndex
CREATE INDEX "Operacao_data_idx" ON "Operacao"("data");

-- CreateIndex
CREATE INDEX "Operacao_ligaId_idx" ON "Operacao"("ligaId");

-- CreateIndex
CREATE INDEX "Operacao_metodoId_idx" ON "Operacao"("metodoId");

-- CreateIndex
CREATE INDEX "Operacao_tipo_idx" ON "Operacao"("tipo");

-- CreateIndex
CREATE INDEX "Operacao_status_idx" ON "Operacao"("status");

-- CreateIndex
CREATE INDEX "Operacao_fase_idx" ON "Operacao"("fase");

-- CreateIndex
CREATE UNIQUE INDEX "Meta_mes_key" ON "Meta"("mes");

-- AddForeignKey
ALTER TABLE "Time" ADD CONSTRAINT "Time_ligaId_fkey" FOREIGN KEY ("ligaId") REFERENCES "Liga"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operacao" ADD CONSTRAINT "Operacao_ligaId_fkey" FOREIGN KEY ("ligaId") REFERENCES "Liga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operacao" ADD CONSTRAINT "Operacao_timeCasaId_fkey" FOREIGN KEY ("timeCasaId") REFERENCES "Time"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operacao" ADD CONSTRAINT "Operacao_timeForaId_fkey" FOREIGN KEY ("timeForaId") REFERENCES "Time"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operacao" ADD CONSTRAINT "Operacao_metodoId_fkey" FOREIGN KEY ("metodoId") REFERENCES "Metodo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

