import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { resolverOperacoesExemplo } from "../lib/seed-data";
import { METODOS_SEED, LIGAS_SEED, TIMES_SEED } from "../lib/seed-catalogs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Limpando dados existentes...");
  await prisma.operacao.deleteMany();
  await prisma.meta.deleteMany();
  await prisma.configuracao.deleteMany();
  await prisma.time.deleteMany();
  await prisma.liga.deleteMany();
  await prisma.metodo.deleteMany();

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

  console.log(`Criando ${METODOS_SEED.length} métodos...`);
  for (const m of METODOS_SEED) {
    await prisma.metodo.create({ data: { nome: m.nome, cor: m.cor, descricao: m.descricao } });
  }

  console.log(`Criando ${LIGAS_SEED.length} ligas e competições...`);
  for (const l of LIGAS_SEED) {
    await prisma.liga.create({ data: { nome: l.nome, pais: l.pais, tipo: l.tipo, nivel: l.nivel } });
  }

  console.log(`Criando ${TIMES_SEED.length} times...`);
  for (const t of TIMES_SEED) {
    const liga = await prisma.liga.findUnique({ where: { nome: t.ligaNome } });
    await prisma.time.create({ data: { nome: t.nome, pais: t.pais, abreviacao: t.abreviacao, ligaId: liga?.id } });
  }

  const operacoes = await resolverOperacoesExemplo(prisma);
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
