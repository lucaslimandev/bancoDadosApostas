"use server";

import { prisma } from "@/lib/prisma";
import { metodoSchema, type MetodoFormValues } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

function revalidarTudo() {
  revalidatePath("/");
  revalidatePath("/metodos");
  revalidatePath("/operacoes");
  revalidatePath("/calendario");
}

export async function getMetodos() {
  return prisma.metodo.findMany({
    orderBy: { nome: "asc" },
    include: { _count: { select: { operacoes: true } } },
  });
}

export async function getMetodosAtivos() {
  return prisma.metodo.findMany({ where: { ativo: true }, orderBy: { nome: "asc" } });
}

export async function criarMetodo(input: MetodoFormValues) {
  const data = metodoSchema.parse(input);
  const metodo = await prisma.metodo.create({ data: { ...data, descricao: data.descricao ?? null } });
  revalidarTudo();
  return metodo;
}

export async function atualizarMetodo(id: string, input: MetodoFormValues) {
  const data = metodoSchema.parse(input);
  const metodo = await prisma.metodo.update({ where: { id }, data: { ...data, descricao: data.descricao ?? null } });
  revalidarTudo();
  return metodo;
}

export async function alternarAtivoMetodo(id: string) {
  const metodo = await prisma.metodo.findUnique({ where: { id } });
  if (!metodo) throw new Error("Método não encontrado");
  const atualizado = await prisma.metodo.update({ where: { id }, data: { ativo: !metodo.ativo } });
  revalidarTudo();
  return atualizado;
}

export async function contarUsoMetodo(id: string) {
  return prisma.operacao.count({ where: { metodoId: id } });
}

export async function excluirMetodo(id: string, reatribuirParaId?: string) {
  const usoCount = await contarUsoMetodo(id);
  if (usoCount > 0) {
    if (!reatribuirParaId) {
      throw new Error(`Este método está em uso em ${usoCount} operação(ões). Reatribua-as antes de excluir.`);
    }
    await prisma.operacao.updateMany({ where: { metodoId: id }, data: { metodoId: reatribuirParaId } });
  }
  await prisma.metodo.delete({ where: { id } });
  revalidarTudo();
}
