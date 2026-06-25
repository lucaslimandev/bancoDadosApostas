import { z } from "zod";

export const operacaoSchema = z
  .object({
    data: z.date(),
    ligaId: z.string().min(1, "Selecione a liga"),
    timeCasaId: z.string().min(1, "Selecione o time da casa"),
    timeForaId: z.string().min(1, "Selecione o time visitante"),
    mercado: z.string().min(1, "Informe o mercado"),
    metodoId: z.string().min(1, "Selecione o método"),
    tipo: z.enum(["Lay", "Back", "Trade"]),
    momento: z.string().min(1, "Informe o momento"),
    fase: z.enum(["PreJogo", "AoVivo"]),
    minutoEntrada: z.number().int().min(0).max(130).nullish(),
    periodo: z.string().nullish(),
    oddEntrada: z.number().positive("Odd deve ser positiva"),
    oddSaida: z.number().positive().nullish(),
    stake: z.number().positive("Stake deve ser positiva"),
    responsabilidade: z.number().nullish(),
    criterioEntrada: z.string().nullish(),
    criterioSaida: z.string().nullish(),
    status: z.enum(["Aberta", "Encerrada"]),
    resultado: z.enum(["Green", "Red", "Anulado"]).nullish(),
    lucro: z.number().nullish(),
    observacoes: z.string().nullish(),
  })
  .superRefine((data, ctx) => {
    if (data.status === "Encerrada") {
      if (!data.resultado) {
        ctx.addIssue({ code: "custom", path: ["resultado"], message: "Informe o resultado para encerrar a operação" });
      }
      if (data.lucro === null || data.lucro === undefined) {
        ctx.addIssue({ code: "custom", path: ["lucro"], message: "Informe o lucro para encerrar a operação" });
      }
    }
    if (data.fase === "AoVivo" && (data.minutoEntrada === null || data.minutoEntrada === undefined)) {
      ctx.addIssue({ code: "custom", path: ["minutoEntrada"], message: "Informe o minuto da entrada" });
    }
  });

export type OperacaoFormValues = z.infer<typeof operacaoSchema>;

export const metodoSchema = z
  .object({
    nome: z.string().min(1, "Informe o nome"),
    descricao: z.string().nullish(),
    cor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Cor deve ser um hex válido, ex.: #3b82f6"),
    ativo: z.boolean(),
    usaBack: z.boolean(),
    usaLay: z.boolean(),
    stakesBack: z.number().positive().nullish(),
    stakesLay: z.number().positive().nullish(),
    criterioEntradaPadrao: z.string().nullish(),
    criterioSaidaPadrao: z.string().nullish(),
  })
  .superRefine((data, ctx) => {
    if (!data.usaBack && !data.usaLay) {
      ctx.addIssue({ code: "custom", path: ["usaBack"], message: "Selecione Back, Lay ou ambos" });
    }
  });

export type MetodoFormValues = z.infer<typeof metodoSchema>;

export const ligaTipoEnum = z.enum(["Liga", "Copa", "Continental", "Selecoes"]);

export const ligaSchema = z.object({
  nome: z.string().min(1, "Informe o nome"),
  pais: z.string().min(1, "Informe o país"),
  tipo: ligaTipoEnum,
  nivel: z.string().nullish(),
  ativo: z.boolean(),
});

export type LigaFormValues = z.infer<typeof ligaSchema>;

export const timeSchema = z.object({
  nome: z.string().min(1, "Informe o nome"),
  pais: z.string().nullish(),
  abreviacao: z.string().nullish(),
  ligaId: z.string().nullish(),
  ativo: z.boolean(),
});

export type TimeFormValues = z.infer<typeof timeSchema>;

export const configuracaoSchema = z.object({
  bancaInicial: z.number().positive(),
  stakeModo: z.enum(["Valor", "Percentual"]),
  stakeValor: z.number().positive(),
  stakePercentual: z.number().positive(),
  stopLossDiario: z.number().nonnegative(),
  stopGainDiario: z.number().nonnegative(),
  maxOperacoesSimultaneas: z.number().int().positive(),
  tema: z.enum(["dark", "light"]),
});

export type ConfiguracaoFormValues = z.infer<typeof configuracaoSchema>;

export const metaSchema = z.object({
  mes: z.string().regex(/^\d{4}-\d{2}$/),
  metaLucro: z.number(),
  metaOperacoes: z.number().int().nonnegative(),
});

export type MetaFormValues = z.infer<typeof metaSchema>;
