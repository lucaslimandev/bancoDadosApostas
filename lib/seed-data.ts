import type { TipoOperacao, ResultadoOperacao, FaseOperacao, StatusOperacao } from "@prisma/client";

function diasAtras(n: number, hora = "16:30") {
  const d = new Date();
  d.setDate(d.getDate() - n);
  const [h, m] = hora.split(":").map(Number);
  d.setHours(h, m, 0, 0);
  return d;
}

// Os valores brutos abaixo são definidos numa escala simples (equivalente à antiga
// "unidade") e convertidos para R$ por FATOR_CONVERSAO ao gerar o seed final.
const FATOR_CONVERSAO = 50;

const CRITERIOS_ENTRADA: Record<string, string> = {
  "Lay Empate": "Empate sobrevalorizado pré-jogo, equipes com tendência ofensiva",
  "Scalping Ao Vivo": "Movimento de odd após pressão ofensiva clara",
  "Pressão Reversa": "Favorito com odd inflada por jogo fora de casa",
  "Cash Out Verde": "Gol cedo travou vantagem, saída programada na variação de odd",
};

type OperacaoSeedBruta = {
  data: Date;
  ligaNome: string;
  timeCasaNome: string;
  timeForaNome: string;
  mercado: string;
  metodoNome: string;
  tipo: TipoOperacao;
  momento: string;
  oddEntrada: number;
  oddSaida?: number;
  stake: number;
  responsabilidade?: number;
  resultado: ResultadoOperacao;
  lucro: number;
  observacoes?: string;
};

export type OperacaoSeedNomes = {
  data: Date;
  ligaNome: string;
  timeCasaNome: string;
  timeForaNome: string;
  mercado: string;
  metodoNome: string;
  tipo: TipoOperacao;
  momento: string;
  fase: FaseOperacao;
  minutoEntrada?: number | null;
  periodo?: string | null;
  oddEntrada: number;
  oddSaida?: number;
  stake: number;
  responsabilidade?: number;
  criterioEntrada?: string;
  criterioSaida?: string;
  status: StatusOperacao;
  resultado?: ResultadoOperacao;
  lucro?: number;
  observacoes?: string;
};

function parseMomento(momento: string): { fase: FaseOperacao; minutoEntrada: number | null; periodo: string | null } {
  if (momento === "Pré-jogo") return { fase: "PreJogo", minutoEntrada: null, periodo: null };
  const match = momento.match(/^(\d+)'\s*(.*)$/);
  if (!match) return { fase: "AoVivo", minutoEntrada: null, periodo: null };
  return { fase: "AoVivo", minutoEntrada: Number(match[1]), periodo: match[2] || null };
}

export function gerarOperacoesExemplo(): OperacaoSeedNomes[] {
  const encerradas: OperacaoSeedNomes[] = gerarOperacoesExemploBruto().map((op) => {
    const { fase, minutoEntrada, periodo } = parseMomento(op.momento);
    return {
      ...op,
      fase,
      minutoEntrada,
      periodo,
      stake: round2(op.stake * FATOR_CONVERSAO),
      responsabilidade: op.responsabilidade ? round2(op.responsabilidade * FATOR_CONVERSAO) : undefined,
      lucro: round2(op.lucro * FATOR_CONVERSAO),
      criterioEntrada: CRITERIOS_ENTRADA[op.metodoNome],
      criterioSaida: op.oddSaida ? "Variação de odd favorável, lucro travado via cash out" : undefined,
      status: "Encerrada",
    };
  });

  const aberta: OperacaoSeedNomes = {
    data: diasAtras(0, "20:15"),
    ligaNome: "Brasileirão Série A",
    timeCasaNome: "Flamengo",
    timeForaNome: "Palmeiras",
    mercado: "Resultado Final",
    metodoNome: "Lay Empate",
    tipo: "Lay",
    momento: "38' 1ºT",
    fase: "AoVivo",
    minutoEntrada: 38,
    periodo: "1ºT",
    oddEntrada: 3.6,
    stake: 200,
    responsabilidade: 520,
    criterioEntrada: CRITERIOS_ENTRADA["Lay Empate"],
    status: "Aberta",
  };

  return [...encerradas, aberta];
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function gerarOperacoesExemploBruto(): OperacaoSeedBruta[] {
  return [
    {
      data: diasAtras(28),
      ligaNome: "Brasileirão Série A",
      timeCasaNome: "Flamengo",
      timeForaNome: "Palmeiras",
      mercado: "Resultado Final",
      metodoNome: "Lay Empate",
      tipo: "Lay",
      momento: "Pré-jogo",
      oddEntrada: 3.4,
      stake: 4,
      responsabilidade: 9.6,
      resultado: "Green",
      lucro: 4,
      observacoes: "Empate saiu de cena no 2ºT, lay coberto antes do apito final.",
    },
    {
      data: diasAtras(27),
      ligaNome: "Premier League",
      timeCasaNome: "Arsenal",
      timeForaNome: "Chelsea",
      mercado: "Próximo Gol",
      metodoNome: "Scalping Ao Vivo",
      tipo: "Trade",
      momento: "22' 1ºT",
      oddEntrada: 2.1,
      oddSaida: 1.85,
      stake: 6,
      resultado: "Green",
      lucro: 0.86,
      observacoes: "Pressão do Arsenal, saída rápida no movimento de odd.",
    },
    {
      data: diasAtras(26),
      ligaNome: "La Liga",
      timeCasaNome: "Real Madrid",
      timeForaNome: "Sevilla",
      mercado: "Over/Under 2.5",
      metodoNome: "Pressão Reversa",
      tipo: "Back",
      momento: "Pré-jogo",
      oddEntrada: 1.95,
      stake: 5,
      resultado: "Green",
      lucro: 4.75,
    },
    {
      data: diasAtras(25),
      ligaNome: "Serie A",
      timeCasaNome: "Inter",
      timeForaNome: "Milan",
      mercado: "Resultado Final",
      metodoNome: "Lay Empate",
      tipo: "Lay",
      momento: "Pré-jogo",
      oddEntrada: 3.2,
      stake: 4,
      responsabilidade: 8.8,
      resultado: "Red",
      lucro: -8.8,
      observacoes: "Jogo travado, empate persistiu até o fim.",
    },
    {
      data: diasAtras(24),
      ligaNome: "Bundesliga",
      timeCasaNome: "Bayern de Munique",
      timeForaNome: "Dortmund",
      mercado: "Próximo Gol",
      metodoNome: "Cash Out Verde",
      tipo: "Trade",
      momento: "61' 2ºT",
      oddEntrada: 1.7,
      oddSaida: 1.4,
      stake: 8,
      resultado: "Green",
      lucro: 1.71,
    },
    {
      data: diasAtras(22),
      ligaNome: "Ligue 1",
      timeCasaNome: "PSG",
      timeForaNome: "Marselha",
      mercado: "Handicap Asiático",
      metodoNome: "Pressão Reversa",
      tipo: "Back",
      momento: "Pré-jogo",
      oddEntrada: 1.88,
      stake: 5,
      resultado: "Green",
      lucro: 4.4,
    },
    {
      data: diasAtras(20),
      ligaNome: "Brasileirão Série A",
      timeCasaNome: "Corinthians",
      timeForaNome: "São Paulo",
      mercado: "Resultado Final",
      metodoNome: "Lay Empate",
      tipo: "Lay",
      momento: "Pré-jogo",
      oddEntrada: 3.1,
      stake: 4,
      responsabilidade: 8.4,
      resultado: "Green",
      lucro: 4,
    },
    {
      data: diasAtras(19),
      ligaNome: "Premier League",
      timeCasaNome: "Man City",
      timeForaNome: "Liverpool",
      mercado: "Próximo Gol",
      metodoNome: "Scalping Ao Vivo",
      tipo: "Trade",
      momento: "10' 1ºT",
      oddEntrada: 2.5,
      oddSaida: 2.9,
      stake: 5,
      resultado: "Red",
      lucro: -0.69,
      observacoes: "Movimento contrário, saída no stop.",
    },
    {
      data: diasAtras(17),
      ligaNome: "La Liga",
      timeCasaNome: "Atlético de Madrid",
      timeForaNome: "Barcelona",
      mercado: "Resultado Final",
      metodoNome: "Lay Empate",
      tipo: "Lay",
      momento: "Pré-jogo",
      oddEntrada: 3.5,
      stake: 4,
      responsabilidade: 10,
      resultado: "Green",
      lucro: 4,
    },
    {
      data: diasAtras(15),
      ligaNome: "Serie A",
      timeCasaNome: "Juventus",
      timeForaNome: "Napoli",
      mercado: "Over/Under 2.5",
      metodoNome: "Pressão Reversa",
      tipo: "Back",
      momento: "Pré-jogo",
      oddEntrada: 2.05,
      stake: 5,
      resultado: "Anulado",
      lucro: 0,
      observacoes: "Jogo cancelado por chuva, stake devolvida.",
    },
    {
      data: diasAtras(13),
      ligaNome: "Bundesliga",
      timeCasaNome: "Leverkusen",
      timeForaNome: "RB Leipzig",
      mercado: "Próximo Gol",
      metodoNome: "Cash Out Verde",
      tipo: "Trade",
      momento: "75' 2ºT",
      oddEntrada: 1.6,
      oddSaida: 1.3,
      stake: 7,
      resultado: "Green",
      lucro: 1.62,
    },
    {
      data: diasAtras(11),
      ligaNome: "Brasileirão Série A",
      timeCasaNome: "Grêmio",
      timeForaNome: "Internacional",
      mercado: "Resultado Final",
      metodoNome: "Lay Empate",
      tipo: "Lay",
      momento: "Pré-jogo",
      oddEntrada: 3.3,
      stake: 4,
      responsabilidade: 9.2,
      resultado: "Red",
      lucro: -9.2,
    },
    {
      data: diasAtras(9),
      ligaNome: "Ligue 1",
      timeCasaNome: "Lyon",
      timeForaNome: "Monaco",
      mercado: "Handicap Asiático",
      metodoNome: "Pressão Reversa",
      tipo: "Back",
      momento: "Pré-jogo",
      oddEntrada: 1.92,
      stake: 5,
      resultado: "Green",
      lucro: 4.6,
    },
    {
      data: diasAtras(6),
      ligaNome: "Premier League",
      timeCasaNome: "Tottenham",
      timeForaNome: "Newcastle",
      mercado: "Próximo Gol",
      metodoNome: "Scalping Ao Vivo",
      tipo: "Trade",
      momento: "33' 1ºT",
      oddEntrada: 2.3,
      oddSaida: 1.95,
      stake: 6,
      resultado: "Green",
      lucro: 1.08,
    },
    {
      data: diasAtras(3),
      ligaNome: "La Liga",
      timeCasaNome: "Valencia",
      timeForaNome: "Betis",
      mercado: "Resultado Final",
      metodoNome: "Lay Empate",
      tipo: "Lay",
      momento: "Pré-jogo",
      oddEntrada: 3.15,
      stake: 4,
      responsabilidade: 8.6,
      resultado: "Green",
      lucro: 4,
    },
    {
      data: diasAtras(1),
      ligaNome: "Serie A",
      timeCasaNome: "Roma",
      timeForaNome: "Lazio",
      mercado: "Próximo Gol",
      metodoNome: "Cash Out Verde",
      tipo: "Trade",
      momento: "55' 2ºT",
      oddEntrada: 1.75,
      oddSaida: 1.5,
      stake: 7,
      resultado: "Green",
      lucro: 1.17,
    },
  ];
}

type ClientComCatalogos = {
  liga: { findUnique: (args: { where: { nome: string } }) => Promise<{ id: string } | null> };
  metodo: { findUnique: (args: { where: { nome: string } }) => Promise<{ id: string } | null> };
  time: { findFirst: (args: { where: { nome: string; ligaId: string } }) => Promise<{ id: string } | null> };
};

export async function resolverOperacoesExemplo(prisma: ClientComCatalogos) {
  const seeds = gerarOperacoesExemplo();
  const resolvidas = [];

  for (const seed of seeds) {
    const liga = await prisma.liga.findUnique({ where: { nome: seed.ligaNome } });
    const metodo = await prisma.metodo.findUnique({ where: { nome: seed.metodoNome } });
    if (!liga) throw new Error(`Liga de seed não encontrada no catálogo: ${seed.ligaNome}`);
    if (!metodo) throw new Error(`Método de seed não encontrado no catálogo: ${seed.metodoNome}`);
    const timeCasa = await prisma.time.findFirst({ where: { nome: seed.timeCasaNome, ligaId: liga.id } });
    const timeFora = await prisma.time.findFirst({ where: { nome: seed.timeForaNome, ligaId: liga.id } });
    if (!timeCasa) throw new Error(`Time de seed não encontrado no catálogo: ${seed.timeCasaNome}`);
    if (!timeFora) throw new Error(`Time de seed não encontrado no catálogo: ${seed.timeForaNome}`);

    resolvidas.push({
      data: seed.data,
      ligaId: liga.id,
      timeCasaId: timeCasa.id,
      timeForaId: timeFora.id,
      mercado: seed.mercado,
      metodoId: metodo.id,
      tipo: seed.tipo,
      momento: seed.momento,
      fase: seed.fase,
      minutoEntrada: seed.minutoEntrada,
      periodo: seed.periodo,
      oddEntrada: seed.oddEntrada,
      oddSaida: seed.oddSaida,
      stake: seed.stake,
      responsabilidade: seed.responsabilidade,
      criterioEntrada: seed.criterioEntrada,
      criterioSaida: seed.criterioSaida,
      status: seed.status,
      resultado: seed.resultado,
      lucro: seed.lucro,
      observacoes: seed.observacoes,
    });
  }

  return resolvidas;
}
