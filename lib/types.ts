import type { Operacao as OperacaoModel, Configuracao as ConfiguracaoModel, Meta as MetaModel } from "@prisma/client";

export type Operacao = OperacaoModel;
export type Configuracao = ConfiguracaoModel;
export type Meta = MetaModel;

export type TipoOperacao = "Lay" | "Back" | "Trade";
export type ResultadoOperacao = "Green" | "Red" | "Anulado";

export type OperacaoInput = {
  data: Date;
  liga: string;
  timeCasa: string;
  timeFora: string;
  mercado: string;
  metodo: string;
  tipo: TipoOperacao;
  momento: string;
  oddEntrada: number;
  oddSaida?: number | null;
  stake: number;
  responsabilidade?: number | null;
  resultado: ResultadoOperacao;
  lucro: number;
  observacoes?: string | null;
};

export type ConfiguracaoInput = {
  bancaInicial: number;
  valorUnidade: number;
  stopLossDiario: number;
  stopGainDiario: number;
  stakePadraoPercent: number;
  maxOperacoesSimultaneas: number;
  tema: string;
};

export type MetaInput = {
  mes: string;
  metaLucroUnidades: number;
  metaOperacoes: number;
};
