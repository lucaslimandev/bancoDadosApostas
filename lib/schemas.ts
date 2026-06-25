import { z } from "zod";

export const operacaoSchema = z.object({
  data: z.date(),
  liga: z.string().min(1, "Informe a liga"),
  timeCasa: z.string().min(1, "Informe o time da casa"),
  timeFora: z.string().min(1, "Informe o time visitante"),
  mercado: z.string().min(1, "Informe o mercado"),
  metodo: z.string().min(1, "Informe o método"),
  tipo: z.enum(["Lay", "Back", "Trade"]),
  momento: z.string().min(1, "Informe o momento"),
  oddEntrada: z.number().positive("Odd deve ser positiva"),
  oddSaida: z.number().positive().nullish(),
  stake: z.number().positive("Stake deve ser positiva"),
  responsabilidade: z.number().nullish(),
  resultado: z.enum(["Green", "Red", "Anulado"]),
  lucro: z.number(),
  observacoes: z.string().nullish(),
});

export type OperacaoFormValues = z.infer<typeof operacaoSchema>;

export const configuracaoSchema = z.object({
  bancaInicial: z.number().positive(),
  valorUnidade: z.number().positive(),
  stopLossDiario: z.number().nonnegative(),
  stopGainDiario: z.number().nonnegative(),
  stakePadraoPercent: z.number().positive(),
  maxOperacoesSimultaneas: z.number().int().positive(),
  tema: z.enum(["dark", "light"]),
});

export type ConfiguracaoFormValues = z.infer<typeof configuracaoSchema>;

export const metaSchema = z.object({
  mes: z.string().regex(/^\d{4}-\d{2}$/),
  metaLucroUnidades: z.number(),
  metaOperacoes: z.number().int().nonnegative(),
});

export type MetaFormValues = z.infer<typeof metaSchema>;
