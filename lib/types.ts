import type {
  Operacao as OperacaoModel,
  Configuracao as ConfiguracaoModel,
  Meta as MetaModel,
  Metodo as MetodoModel,
  Liga as LigaModel,
  Time as TimeModel,
  LigaTipo as LigaTipoModel,
} from "@prisma/client";

export type Configuracao = ConfiguracaoModel;
export type Meta = MetaModel;
export type Metodo = MetodoModel;
export type Liga = LigaModel;
export type Time = TimeModel;
export type LigaTipo = LigaTipoModel;

export type TipoOperacao = "Lay" | "Back" | "Trade";
export type ResultadoOperacao = "Green" | "Red" | "Anulado";

export type Operacao = OperacaoModel & {
  liga: Liga;
  metodo: Metodo;
  timeCasa: Time;
  timeFora: Time;
};
