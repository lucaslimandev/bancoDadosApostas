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
  const { gerarOperacoesExemplo } = await import("@/lib/seed-data");
  await prisma.operacao.deleteMany();
  await prisma.operacao.createMany({ data: gerarOperacoesExemplo() });
  revalidatePath("/");
  revalidatePath("/operacoes");
  revalidatePath("/calendario");
  revalidatePath("/metas");
}
