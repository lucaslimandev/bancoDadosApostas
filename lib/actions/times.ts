"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { timeSchema, type TimeFormValues } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

function revalidarTudo() {
  revalidatePath("/");
  revalidatePath("/times");
  revalidatePath("/operacoes");
  revalidatePath("/calendario");
}

export async function getTimes() {
  return prisma.time.findMany({
    orderBy: { nome: "asc" },
    include: { liga: true, _count: { select: { operacoesCasa: true, operacoesFora: true } } },
  });
}

export async function getTimesAtivos(ligaId?: string) {
  return prisma.time.findMany({
    where: { ativo: true, ...(ligaId ? { ligaId } : {}) },
    orderBy: { nome: "asc" },
  });
}

export async function criarTime(input: TimeFormValues) {
  const data = timeSchema.parse(input);
  const time = await prisma.time.create({
    data: { ...data, pais: data.pais ?? null, abreviacao: data.abreviacao ?? null, ligaId: data.ligaId ?? null },
  });
  revalidarTudo();
  return time;
}

export async function atualizarTime(id: string, input: TimeFormValues) {
  const data = timeSchema.parse(input);
  const time = await prisma.time.update({
    where: { id },
    data: { ...data, pais: data.pais ?? null, abreviacao: data.abreviacao ?? null, ligaId: data.ligaId ?? null },
  });
  revalidarTudo();
  return time;
}

export async function alternarAtivoTime(id: string) {
  const time = await prisma.time.findUnique({ where: { id } });
  if (!time) throw new Error("Time não encontrado");
  const atualizado = await prisma.time.update({ where: { id }, data: { ativo: !time.ativo } });
  revalidarTudo();
  return atualizado;
}

export async function contarUsoTime(id: string) {
  const [casa, fora] = await Promise.all([
    prisma.operacao.count({ where: { timeCasaId: id } }),
    prisma.operacao.count({ where: { timeForaId: id } }),
  ]);
  return casa + fora;
}

export async function excluirTime(id: string, reatribuirParaId?: string) {
  const usoCount = await contarUsoTime(id);
  if (usoCount > 0) {
    if (!reatribuirParaId) {
      throw new Error(`Este time está em uso em ${usoCount} operação(ões). Reatribua-as antes de excluir.`);
    }
    await prisma.operacao.updateMany({ where: { timeCasaId: id }, data: { timeCasaId: reatribuirParaId } });
    await prisma.operacao.updateMany({ where: { timeForaId: id }, data: { timeForaId: reatribuirParaId } });
  }
  await prisma.time.delete({ where: { id } });
  revalidarTudo();
}

export async function criarTimeInline(nome: string, ligaId?: string | null) {
  const time = await prisma.time.create({ data: { nome, ligaId: ligaId ?? null } });
  revalidarTudo();
  return time;
}

const timeImportSchema = z.object({
  nome: z.string().min(1),
  pais: z.string().nullish(),
  ligaNome: z.string().nullish(),
  abreviacao: z.string().nullish(),
});

export type TimeImportRow = z.infer<typeof timeImportSchema>;

export async function importarTimes(linhas: TimeImportRow[]) {
  let importados = 0;
  let ignorados = 0;
  let ligasCriadas = 0;

  for (const linhaBruta of linhas) {
    const linha = timeImportSchema.parse(linhaBruta);

    let ligaId: string | null = null;
    if (linha.ligaNome) {
      const liga = await prisma.liga.findUnique({ where: { nome: linha.ligaNome } });
      if (liga) {
        ligaId = liga.id;
      } else {
        const novaLiga = await prisma.liga.create({
          data: { nome: linha.ligaNome, pais: linha.pais ?? "A definir", tipo: "Liga" },
        });
        ligaId = novaLiga.id;
        ligasCriadas++;
      }
    }

    const existente = await prisma.time.findFirst({ where: { nome: linha.nome, ligaId } });
    if (existente) {
      ignorados++;
      continue;
    }

    await prisma.time.create({
      data: { nome: linha.nome, pais: linha.pais ?? null, abreviacao: linha.abreviacao ?? null, ligaId },
    });
    importados++;
  }

  revalidarTudo();
  return { importados, ignorados, ligasCriadas };
}
