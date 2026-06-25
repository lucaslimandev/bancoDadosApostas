import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { gerarOperacoesExemplo } from "../lib/seed-data";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Limpando dados existentes...");
  await prisma.operacao.deleteMany();
  await prisma.meta.deleteMany();
  await prisma.configuracao.deleteMany();

  console.log("Criando configuração padrão...");
  await prisma.configuracao.create({
    data: {
      bancaInicial: 100,
      valorUnidade: 50,
      stopLossDiario: 5,
      stopGainDiario: 8,
      stakePadraoPercent: 2,
      maxOperacoesSimultaneas: 2,
      tema: "dark",
    },
  });

  console.log("Criando metas mensais...");
  const hoje = new Date();
  const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;
  await prisma.meta.create({
    data: { mes: mesAtual, metaLucroUnidades: 20, metaOperacoes: 30 },
  });

  const operacoes = gerarOperacoesExemplo();
  console.log(`Criando ${operacoes.length} operações de exemplo...`);
  for (const op of operacoes) {
    await prisma.operacao.create({ data: op });
  }

  console.log("Seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
