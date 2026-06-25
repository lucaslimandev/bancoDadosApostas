import { round2 } from "@/lib/calculations";
import type { Configuracao, Metodo } from "@/lib/types";

export function calcValorStakeFixa(config: Pick<Configuracao, "stakeModo" | "stakeValor" | "stakePercentual">, bancaAtual: number): number {
  if (config.stakeModo === "Valor") return round2(config.stakeValor);
  return round2(bancaAtual * (config.stakePercentual / 100));
}

export function calcStakeEmReais(numStakes: number | null | undefined, valorStakeFixa: number): number {
  if (!numStakes) return 0;
  return round2(numStakes * valorStakeFixa);
}

export function calcStakeMetodo(
  metodo: Pick<Metodo, "stakesBack" | "stakesLay"> | undefined,
  tipo: "Lay" | "Back" | "Trade",
  valorStakeFixa: number
): number | null {
  if (!metodo) return null;
  if (tipo === "Back") return metodo.stakesBack ? calcStakeEmReais(metodo.stakesBack, valorStakeFixa) : null;
  if (tipo === "Lay") return metodo.stakesLay ? calcStakeEmReais(metodo.stakesLay, valorStakeFixa) : null;
  return null;
}
