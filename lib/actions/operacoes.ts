"use server";

import { prisma } from "@/lib/prisma";
import { operacaoSchema, type OperacaoFormValues } from "@/lib/schemas";
import type { OperacaoImportRow } from "@/lib/csv";
import { revalidatePath } from "next/cache";

const INCLUDE_RELACOES = { liga: true, metodo: true, timeCasa: true, timeFora: true } as const;

export async function getOperacoes() {
  return prisma.operacao.findMany({ orderBy: { data: "desc" }, include: INCLUDE_RELACOES });
}

export async function getOperacao(id: string) {
  return prisma.operacao.findUnique({ where: { id }, include: INCLUDE_RELACOES });
}

export async function criarOperacao(input: OperacaoFormValues) {
  const data = operacaoSchema.parse(input);
  const operacao = await prisma.operacao.create({ data, include: INCLUDE_RELACOES });
  revalidatePath("/");
  revalidatePath("/operacoes");
  revalidatePath("/calendario");
  return operacao;
}

export async function atualizarOperacao(id: string, input: OperacaoFormValues) {
  const data = operacaoSchema.parse(input);
  const operacao = await prisma.operacao.update({ where: { id }, data, include: INCLUDE_RELACOES });
  revalidatePath("/");
  revalidatePath("/operacoes");
  revalidatePath("/calendario");
  return operacao;
}

export async function excluirOperacao(id: string) {
  await prisma.operacao.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/operacoes");
  revalidatePath("/calendario");
}

export async function excluirOperacoesEmMassa(ids: string[]) {
  const resultado = await prisma.operacao.deleteMany({ where: { id: { in: ids } } });
  revalidatePath("/");
  revalidatePath("/operacoes");
  revalidatePath("/calendario");
  return resultado.count;
}

export async function duplicarOperacao(id: string) {
  const original = await prisma.operacao.findUnique({ where: { id } });
  if (!original) throw new Error("Operação não encontrada");
  const copia = await prisma.operacao.create({
    data: {
      data: original.data,
      ligaId: original.ligaId,
      timeCasaId: original.timeCasaId,
      timeForaId: original.timeForaId,
      mercado: original.mercado,
      metodoId: original.metodoId,
      tipo: original.tipo,
      momento: original.momento,
      oddEntrada: original.oddEntrada,
      oddSaida: original.oddSaida,
      stake: original.stake,
      responsabilidade: original.responsabilidade,
      resultado: original.resultado,
      lucro: original.lucro,
      observacoes: original.observacoes,
    },
    include: INCLUDE_RELACOES,
  });
  revalidatePath("/");
  revalidatePath("/operacoes");
  revalidatePath("/calendario");
  return copia;
}

export async function limparOperacoes() {
  await prisma.operacao.deleteMany();
  revalidatePath("/");
  revalidatePath("/operacoes");
  revalidatePath("/calendario");
}

export async function importarOperacoesPorNome(rows: OperacaoImportRow[]) {
  let importadas = 0;
  let ligasCriadas = 0;
  let metodosCriados = 0;
  let timesCriados = 0;

  for (const linha of rows) {
    let liga = await prisma.liga.findUnique({ where: { nome: linha.ligaNome } });
    if (!liga) {
      liga = await prisma.liga.create({ data: { nome: linha.ligaNome, pais: "A definir", tipo: "Liga" } });
      ligasCriadas++;
    }

    let metodo = await prisma.metodo.findUnique({ where: { nome: linha.metodoNome } });
    if (!metodo) {
      metodo = await prisma.metodo.create({ data: { nome: linha.metodoNome, cor: "#64748b" } });
      metodosCriados++;
    }

    let timeCasa = await prisma.time.findFirst({ where: { nome: linha.timeCasaNome, ligaId: liga.id } });
    if (!timeCasa) {
      timeCasa = await prisma.time.create({ data: { nome: linha.timeCasaNome, ligaId: liga.id } });
      timesCriados++;
    }

    let timeFora = await prisma.time.findFirst({ where: { nome: linha.timeForaNome, ligaId: liga.id } });
    if (!timeFora) {
      timeFora = await prisma.time.create({ data: { nome: linha.timeForaNome, ligaId: liga.id } });
      timesCriados++;
    }

    const data = operacaoSchema.parse({
      data: linha.data,
      ligaId: liga.id,
      timeCasaId: timeCasa.id,
      timeForaId: timeFora.id,
      mercado: linha.mercado,
      metodoId: metodo.id,
      tipo: linha.tipo,
      momento: linha.momento,
      oddEntrada: linha.oddEntrada,
      oddSaida: linha.oddSaida,
      stake: linha.stake,
      responsabilidade: linha.responsabilidade,
      resultado: linha.resultado,
      lucro: linha.lucro,
      observacoes: linha.observacoes,
    });
    await prisma.operacao.create({ data });
    importadas++;
  }

  revalidatePath("/");
  revalidatePath("/operacoes");
  revalidatePath("/calendario");
  return { importadas, ligasCriadas, metodosCriados, timesCriados };
}
