import type { Operacao } from "@/lib/types";

export function calcResponsabilidade(stake: number, odd: number): number {
  return Math.round(stake * (odd - 1) * 100) / 100;
}

export function calcLucroSugerido(params: {
  tipo: "Lay" | "Back" | "Trade";
  resultado: "Green" | "Red" | "Anulado";
  oddEntrada: number;
  oddSaida?: number | null;
  stake: number;
}): number {
  const { tipo, resultado, oddEntrada, oddSaida, stake } = params;

  if (resultado === "Anulado") return 0;

  if (tipo === "Back") {
    if (resultado === "Green") return round2(stake * (oddEntrada - 1));
    return round2(-stake);
  }

  if (tipo === "Lay") {
    const responsabilidade = calcResponsabilidade(stake, oddEntrada);
    if (resultado === "Green") return round2(stake);
    return round2(-responsabilidade);
  }

  // Trade: lucro pela variação de odd entre entrada e saída
  if (oddSaida && oddSaida > 0) {
    if (resultado === "Green") return round2(stake * (oddEntrada / oddSaida - 1));
    return round2(-(stake * (oddEntrada / oddSaida - 1)));
  }
  return 0;
}

export function exposicaoReal(op: Pick<Operacao, "tipo" | "stake" | "responsabilidade" | "oddEntrada">): number {
  if (op.tipo === "Lay") {
    return op.responsabilidade ?? calcResponsabilidade(op.stake, op.oddEntrada);
  }
  return op.stake;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export type SeriePonto = {
  data: Date;
  lucroDoDia: number;
  banca: number;
  pico: number;
  drawdown: number;
};

export type Metricas = {
  numOperacoes: number;
  lucroTotal: number;
  roi: number;
  yield: number;
  taxaAcerto: number;
  bancaAtual: number;
  picoBanca: number;
  drawdownAtual: number;
  drawdownMaximo: number;
  streakAtual: number;
  streakTipo: "Green" | "Red" | null;
  greens: number;
  reds: number;
  anulados: number;
  serie: SeriePonto[];
};

export function ordenarPorData(operacoes: Operacao[]): Operacao[] {
  return [...operacoes].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
}

export function calcularMetricas(operacoesEntrada: Operacao[], bancaInicial: number): Metricas {
  const operacoes = ordenarPorData(operacoesEntrada);

  let banca = bancaInicial;
  let pico = bancaInicial;
  const serie: SeriePonto[] = [];

  // agrupa por dia para a curva de banca (um ponto por dia operado)
  const porDia = new Map<string, Operacao[]>();
  for (const op of operacoes) {
    const key = diaKey(new Date(op.data));
    const lista = porDia.get(key) ?? [];
    lista.push(op);
    porDia.set(key, lista);
  }

  for (const [key, ops] of porDia) {
    const lucroDoDia = ops.reduce((acc, o) => acc + o.lucro, 0);
    banca += lucroDoDia;
    pico = Math.max(pico, banca);
    const drawdown = banca - pico;
    serie.push({ data: new Date(key), lucroDoDia, banca, pico, drawdown });
  }

  const lucroTotal = round2(operacoes.reduce((acc, o) => acc + o.lucro, 0));
  const somaStake = operacoes.reduce((acc, o) => acc + o.stake, 0);
  const somaExposicao = operacoes.reduce((acc, o) => acc + exposicaoReal(o), 0);

  const validas = operacoes.filter((o) => o.resultado !== "Anulado");
  const greens = operacoes.filter((o) => o.resultado === "Green").length;
  const reds = operacoes.filter((o) => o.resultado === "Red").length;
  const anulados = operacoes.filter((o) => o.resultado === "Anulado").length;
  const taxaAcerto = validas.length > 0 ? round2((greens / validas.length) * 100) : 0;

  const yieldValor = somaStake > 0 ? round2((lucroTotal / somaStake) * 100) : 0;
  const roi = somaExposicao > 0 ? round2((lucroTotal / somaExposicao) * 100) : 0;

  const bancaAtual = round2(banca);
  const picoBanca = round2(pico);
  const drawdownAtual = round2(bancaAtual - picoBanca);
  const drawdownMaximo = serie.length > 0 ? round2(Math.min(...serie.map((s) => s.drawdown))) : 0;

  const { streakAtual, streakTipo } = calcularStreak(operacoes);

  return {
    numOperacoes: operacoes.length,
    lucroTotal,
    roi,
    yield: yieldValor,
    taxaAcerto,
    bancaAtual,
    picoBanca,
    drawdownAtual,
    drawdownMaximo,
    streakAtual,
    streakTipo,
    greens,
    reds,
    anulados,
    serie,
  };
}

function calcularStreak(operacoesOrdenadas: Operacao[]): { streakAtual: number; streakTipo: "Green" | "Red" | null } {
  const decisivas = operacoesOrdenadas.filter((o) => o.resultado !== "Anulado");
  if (decisivas.length === 0) return { streakAtual: 0, streakTipo: null };

  const ultimo = decisivas[decisivas.length - 1];
  let count = 0;
  for (let i = decisivas.length - 1; i >= 0; i--) {
    if (decisivas[i].resultado === ultimo.resultado) count++;
    else break;
  }
  return { streakAtual: count, streakTipo: ultimo.resultado as "Green" | "Red" };
}

export function diaKey(d: Date): string {
  const date = new Date(d);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function operacoesPorDia(operacoes: Operacao[]): Map<string, Operacao[]> {
  const mapa = new Map<string, Operacao[]>();
  for (const op of operacoes) {
    const key = diaKey(new Date(op.data));
    const lista = mapa.get(key) ?? [];
    lista.push(op);
    mapa.set(key, lista);
  }
  return mapa;
}

export function lucroPorDia(operacoes: Operacao[]): Map<string, number> {
  const mapa = new Map<string, number>();
  for (const op of operacoes) {
    const key = diaKey(new Date(op.data));
    mapa.set(key, round2((mapa.get(key) ?? 0) + op.lucro));
  }
  return mapa;
}

export function lucroPorMetodo(operacoes: Operacao[]): Array<{ metodo: string; lucro: number; cor: string }> {
  const mapa = new Map<string, { lucro: number; cor: string }>();
  for (const op of operacoes) {
    const atual = mapa.get(op.metodo.nome) ?? { lucro: 0, cor: op.metodo.cor };
    mapa.set(op.metodo.nome, { lucro: round2(atual.lucro + op.lucro), cor: op.metodo.cor });
  }
  return Array.from(mapa.entries())
    .map(([metodo, v]) => ({ metodo, lucro: v.lucro, cor: v.cor }))
    .sort((a, b) => b.lucro - a.lucro);
}

export function lucroPorLiga(operacoes: Operacao[]): Array<{ liga: string; lucro: number }> {
  const mapa = new Map<string, number>();
  for (const op of operacoes) {
    mapa.set(op.liga.nome, round2((mapa.get(op.liga.nome) ?? 0) + op.lucro));
  }
  return Array.from(mapa.entries())
    .map(([liga, lucro]) => ({ liga, lucro }))
    .sort((a, b) => b.lucro - a.lucro);
}

export function mesKey(d: Date): string {
  const date = new Date(d);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function metricasPorMes(operacoes: Operacao[]): Map<string, { lucro: number; numOperacoes: number }> {
  const mapa = new Map<string, { lucro: number; numOperacoes: number }>();
  for (const op of operacoes) {
    const key = mesKey(new Date(op.data));
    const atual = mapa.get(key) ?? { lucro: 0, numOperacoes: 0 };
    mapa.set(key, { lucro: round2(atual.lucro + op.lucro), numOperacoes: atual.numOperacoes + 1 });
  }
  return mapa;
}

export function distribuicaoTipo(operacoes: Operacao[]): Array<{ tipo: string; quantidade: number }> {
  const mapa = new Map<string, number>();
  for (const op of operacoes) {
    mapa.set(op.tipo, (mapa.get(op.tipo) ?? 0) + 1);
  }
  return Array.from(mapa.entries()).map(([tipo, quantidade]) => ({ tipo, quantidade }));
}
