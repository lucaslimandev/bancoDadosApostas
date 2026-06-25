"use server";

import { prisma } from "@/lib/prisma";
import { configuracaoSchema, type ConfiguracaoFormValues } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export async function getConfiguracao() {
  const existente = await prisma.configuracao.findFirst();
  if (existente) return existente;
  return prisma.configuracao.create({
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
}

export async function atualizarConfiguracao(input: ConfiguracaoFormValues) {
  const data = configuracaoSchema.parse(input);
  const existente = await prisma.configuracao.findFirst();
  const config = existente
    ? await prisma.configuracao.update({ where: { id: existente.id }, data })
    : await prisma.configuracao.create({ data });
  revalidatePath("/");
  revalidatePath("/configuracoes");
  return config;
}

export async function limparTodosOsDados() {
  await prisma.operacao.deleteMany();
  await prisma.meta.deleteMany();
  revalidatePath("/");
  revalidatePath("/operacoes");
  revalidatePath("/calendario");
  revalidatePath("/metas");
}

export async function restaurarDadosDeExemplo() {
  const { resolverOperacoesExemplo } = await import("@/lib/seed-data");
  const { METODOS_SEED, LIGAS_SEED, TIMES_SEED } = await import("@/lib/seed-catalogs");

  for (const m of METODOS_SEED) {
    await prisma.metodo.upsert({
      where: { nome: m.nome },
      update: { cor: m.cor, descricao: m.descricao },
      create: { nome: m.nome, cor: m.cor, descricao: m.descricao },
    });
  }
  for (const l of LIGAS_SEED) {
    await prisma.liga.upsert({
      where: { nome: l.nome },
      update: { pais: l.pais, tipo: l.tipo, nivel: l.nivel },
      create: { nome: l.nome, pais: l.pais, tipo: l.tipo, nivel: l.nivel },
    });
  }
  for (const t of TIMES_SEED) {
    const liga = await prisma.liga.findUnique({ where: { nome: t.ligaNome } });
    const existente = await prisma.time.findFirst({ where: { nome: t.nome, ligaId: liga?.id ?? null } });
    if (!existente) {
      await prisma.time.create({ data: { nome: t.nome, pais: t.pais, abreviacao: t.abreviacao, ligaId: liga?.id } });
    }
  }

  const operacoes = await resolverOperacoesExemplo(prisma);
  await prisma.operacao.deleteMany();
  await prisma.operacao.createMany({ data: operacoes });
  revalidatePath("/");
  revalidatePath("/operacoes");
  revalidatePath("/calendario");
  revalidatePath("/metas");
}
