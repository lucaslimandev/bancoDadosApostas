"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ligaSchema, ligaTipoEnum, type LigaFormValues } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

function revalidarTudo() {
  revalidatePath("/");
  revalidatePath("/ligas");
  revalidatePath("/operacoes");
  revalidatePath("/calendario");
}

export async function getLigas() {
  return prisma.liga.findMany({
    orderBy: { nome: "asc" },
    include: { _count: { select: { operacoes: true, times: true } } },
  });
}

export async function getLigasAtivas() {
  return prisma.liga.findMany({ where: { ativo: true }, orderBy: { nome: "asc" } });
}

export async function criarLiga(input: LigaFormValues) {
  const data = ligaSchema.parse(input);
  const liga = await prisma.liga.create({ data: { ...data, nivel: data.nivel ?? null } });
  revalidarTudo();
  return liga;
}

export async function atualizarLiga(id: string, input: LigaFormValues) {
  const data = ligaSchema.parse(input);
  const liga = await prisma.liga.update({ where: { id }, data: { ...data, nivel: data.nivel ?? null } });
  revalidarTudo();
  return liga;
}

export async function alternarAtivoLiga(id: string) {
  const liga = await prisma.liga.findUnique({ where: { id } });
  if (!liga) throw new Error("Liga não encontrada");
  const atualizada = await prisma.liga.update({ where: { id }, data: { ativo: !liga.ativo } });
  revalidarTudo();
  return atualizada;
}

export async function contarUsoLiga(id: string) {
  const [operacoes, times] = await Promise.all([
    prisma.operacao.count({ where: { ligaId: id } }),
    prisma.time.count({ where: { ligaId: id } }),
  ]);
  return { operacoes, times };
}

export async function excluirLiga(id: string, reatribuirParaId?: string) {
  const uso = await contarUsoLiga(id);
  if (uso.operacoes > 0) {
    if (!reatribuirParaId) {
      throw new Error(`Esta liga está em uso em ${uso.operacoes} operação(ões). Reatribua-as antes de excluir.`);
    }
    await prisma.operacao.updateMany({ where: { ligaId: id }, data: { ligaId: reatribuirParaId } });
  }
  if (uso.times > 0) {
    await prisma.time.updateMany({ where: { ligaId: id }, data: { ligaId: reatribuirParaId ?? null } });
  }
  await prisma.liga.delete({ where: { id } });
  revalidarTudo();
}

const ligaImportSchema = z.object({
  nome: z.string().min(1),
  pais: z.string().min(1),
  tipo: ligaTipoEnum.default("Liga"),
  nivel: z.string().nullish(),
});

export type LigaImportRow = z.infer<typeof ligaImportSchema>;

export async function importarLigas(linhas: LigaImportRow[]) {
  let importadas = 0;
  let ignoradas = 0;
  for (const linhaBruta of linhas) {
    const data = ligaImportSchema.parse(linhaBruta);
    const existente = await prisma.liga.findUnique({ where: { nome: data.nome } });
    if (existente) {
      ignoradas++;
      continue;
    }
    await prisma.liga.create({ data: { ...data, nivel: data.nivel ?? null, ativo: true } });
    importadas++;
  }
  revalidarTudo();
  return { importadas, ignoradas };
}
