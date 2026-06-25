"use server";

import { prisma } from "@/lib/prisma";
import { metaSchema, type MetaFormValues } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export async function getMetas() {
  return prisma.meta.findMany({ orderBy: { mes: "desc" } });
}

export async function getMetaDoMes(mes: string) {
  return prisma.meta.findUnique({ where: { mes } });
}

export async function salvarMeta(input: MetaFormValues) {
  const data = metaSchema.parse(input);
  const meta = await prisma.meta.upsert({
    where: { mes: data.mes },
    update: { metaLucroUnidades: data.metaLucroUnidades, metaOperacoes: data.metaOperacoes },
    create: data,
  });
  revalidatePath("/metas");
  return meta;
}
