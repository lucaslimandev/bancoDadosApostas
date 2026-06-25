"use server";

import { prisma } from "@/lib/prisma";
import { operacaoSchema, type OperacaoFormValues } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export async function getOperacoes() {
  return prisma.operacao.findMany({ orderBy: { data: "desc" } });
}

export async function getOperacao(id: string) {
  return prisma.operacao.findUnique({ where: { id } });
}

export async function criarOperacao(input: OperacaoFormValues) {
  const data = operacaoSchema.parse(input);
  const operacao = await prisma.operacao.create({ data });
  revalidatePath("/");
  revalidatePath("/operacoes");
  revalidatePath("/calendario");
  return operacao;
}

export async function atualizarOperacao(id: string, input: OperacaoFormValues) {
  const data = operacaoSchema.parse(input);
  const operacao = await prisma.operacao.update({ where: { id }, data });
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

export async function duplicarOperacao(id: string) {
  const original = await prisma.operacao.findUnique({ where: { id } });
  if (!original) throw new Error("Operação não encontrada");
  const copia = await prisma.operacao.create({
    data: {
      data: original.data,
      liga: original.liga,
      timeCasa: original.timeCasa,
      timeFora: original.timeFora,
      mercado: original.mercado,
      metodo: original.metodo,
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

export async function importarOperacoes(rows: OperacaoFormValues[]) {
  const validas = rows.map((r) => operacaoSchema.parse(r));
  await prisma.operacao.createMany({ data: validas });
  revalidatePath("/");
  revalidatePath("/operacoes");
  revalidatePath("/calendario");
}
