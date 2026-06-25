export type MetodoSeed = {
  nome: string;
  descricao?: string;
  cor: string;
  usaBack?: boolean;
  usaLay?: boolean;
  stakesBack?: number;
  stakesLay?: number;
  criterioEntradaPadrao?: string;
  criterioSaidaPadrao?: string;
};
export type LigaSeed = { nome: string; pais: string; tipo: "Liga" | "Copa" | "Continental" | "Selecoes"; nivel?: string };
export type TimeSeed = { nome: string; ligaNome: string; pais?: string; abreviacao?: string };

export const METODOS_SEED: MetodoSeed[] = [
  {
    nome: "Pressão Reversa",
    cor: "#3b82f6",
    descricao: "Entrada contra o favorito sob pressão do azarão.",
    usaBack: true,
    usaLay: false,
    stakesBack: 1.5,
    criterioEntradaPadrao: "Favorito com odd inflada por jogo fora de casa",
  },
  {
    nome: "Scalping Ao Vivo",
    cor: "#a855f7",
    descricao: "Entradas e saídas rápidas explorando variação de odd ao vivo.",
    usaBack: true,
    usaLay: true,
    stakesBack: 1,
    stakesLay: 1,
    criterioEntradaPadrao: "Movimento de odd após pressão ofensiva clara",
  },
  {
    nome: "Lay Empate",
    cor: "#f59e0b",
    descricao: "Lay no empate pré-jogo ou no início da partida.",
    usaBack: false,
    usaLay: true,
    stakesLay: 1,
    criterioEntradaPadrao: "Empate sobrevalorizado pré-jogo, equipes com tendência ofensiva",
  },
  {
    nome: "Cash Out Verde",
    cor: "#22c55e",
    descricao: "Trade para travar lucro com cash out manual.",
    usaBack: true,
    usaLay: true,
    stakesBack: 1.5,
    stakesLay: 1.5,
    criterioEntradaPadrao: "Gol cedo travou vantagem, saída programada na variação de odd",
    criterioSaidaPadrao: "Variação de odd favorável, lucro travado via cash out",
  },
];

export const LIGAS_SEED: LigaSeed[] = [
  { nome: "Brasileirão Série A", pais: "Brasil", tipo: "Liga", nivel: "1ª divisão" },
  { nome: "Brasileirão Série B", pais: "Brasil", tipo: "Liga", nivel: "2ª divisão" },
  { nome: "Premier League", pais: "Inglaterra", tipo: "Liga", nivel: "1ª divisão" },
  { nome: "Championship", pais: "Inglaterra", tipo: "Liga", nivel: "2ª divisão" },
  { nome: "La Liga", pais: "Espanha", tipo: "Liga", nivel: "1ª divisão" },
  { nome: "La Liga 2", pais: "Espanha", tipo: "Liga", nivel: "2ª divisão" },
  { nome: "Serie A", pais: "Itália", tipo: "Liga", nivel: "1ª divisão" },
  { nome: "Serie B", pais: "Itália", tipo: "Liga", nivel: "2ª divisão" },
  { nome: "Bundesliga", pais: "Alemanha", tipo: "Liga", nivel: "1ª divisão" },
  { nome: "2. Bundesliga", pais: "Alemanha", tipo: "Liga", nivel: "2ª divisão" },
  { nome: "Ligue 1", pais: "França", tipo: "Liga", nivel: "1ª divisão" },
  { nome: "Ligue 2", pais: "França", tipo: "Liga", nivel: "2ª divisão" },
  { nome: "Primeira Liga", pais: "Portugal", tipo: "Liga", nivel: "1ª divisão" },
  { nome: "Eredivisie", pais: "Holanda", tipo: "Liga", nivel: "1ª divisão" },
  { nome: "Liga Profesional", pais: "Argentina", tipo: "Liga", nivel: "1ª divisão" },
  { nome: "Liga MX", pais: "México", tipo: "Liga", nivel: "1ª divisão" },
  { nome: "MLS", pais: "Estados Unidos", tipo: "Liga", nivel: "1ª divisão" },
  { nome: "Saudi Pro League", pais: "Arábia Saudita", tipo: "Liga", nivel: "1ª divisão" },
  { nome: "Süper Lig", pais: "Turquia", tipo: "Liga", nivel: "1ª divisão" },
  { nome: "Scottish Premiership", pais: "Escócia", tipo: "Liga", nivel: "1ª divisão" },

  { nome: "Champions League", pais: "Europa", tipo: "Continental" },
  { nome: "Europa League", pais: "Europa", tipo: "Continental" },
  { nome: "Conference League", pais: "Europa", tipo: "Continental" },
  { nome: "Copa Libertadores", pais: "América do Sul", tipo: "Continental" },
  { nome: "Copa Sudamericana", pais: "América do Sul", tipo: "Continental" },
  { nome: "Copa do Brasil", pais: "Brasil", tipo: "Copa" },
  { nome: "Copa do Rei", pais: "Espanha", tipo: "Copa" },
  { nome: "Copa do Mundo FIFA", pais: "Mundial", tipo: "Selecoes" },
  { nome: "Eurocopa", pais: "Europa", tipo: "Selecoes" },
  { nome: "Copa América", pais: "América do Sul", tipo: "Selecoes" },
  { nome: "Liga das Nações UEFA", pais: "Europa", tipo: "Selecoes" },
];

export const TIMES_SEED: TimeSeed[] = [
  // Brasileirão Série A
  { nome: "Flamengo", ligaNome: "Brasileirão Série A", pais: "Brasil", abreviacao: "FLA" },
  { nome: "Palmeiras", ligaNome: "Brasileirão Série A", pais: "Brasil", abreviacao: "PAL" },
  { nome: "Corinthians", ligaNome: "Brasileirão Série A", pais: "Brasil", abreviacao: "COR" },
  { nome: "São Paulo", ligaNome: "Brasileirão Série A", pais: "Brasil", abreviacao: "SAO" },
  { nome: "Grêmio", ligaNome: "Brasileirão Série A", pais: "Brasil", abreviacao: "GRE" },
  { nome: "Internacional", ligaNome: "Brasileirão Série A", pais: "Brasil", abreviacao: "INT" },
  { nome: "Atlético-MG", ligaNome: "Brasileirão Série A", pais: "Brasil", abreviacao: "CAM" },
  { nome: "Fluminense", ligaNome: "Brasileirão Série A", pais: "Brasil", abreviacao: "FLU" },

  // Premier League
  { nome: "Arsenal", ligaNome: "Premier League", pais: "Inglaterra", abreviacao: "ARS" },
  { nome: "Chelsea", ligaNome: "Premier League", pais: "Inglaterra", abreviacao: "CHE" },
  { nome: "Man City", ligaNome: "Premier League", pais: "Inglaterra", abreviacao: "MCI" },
  { nome: "Liverpool", ligaNome: "Premier League", pais: "Inglaterra", abreviacao: "LIV" },
  { nome: "Tottenham", ligaNome: "Premier League", pais: "Inglaterra", abreviacao: "TOT" },
  { nome: "Newcastle", ligaNome: "Premier League", pais: "Inglaterra", abreviacao: "NEW" },
  { nome: "Man United", ligaNome: "Premier League", pais: "Inglaterra", abreviacao: "MUN" },
  { nome: "Aston Villa", ligaNome: "Premier League", pais: "Inglaterra", abreviacao: "AVL" },

  // La Liga
  { nome: "Real Madrid", ligaNome: "La Liga", pais: "Espanha", abreviacao: "RMA" },
  { nome: "Sevilla", ligaNome: "La Liga", pais: "Espanha", abreviacao: "SEV" },
  { nome: "Atlético de Madrid", ligaNome: "La Liga", pais: "Espanha", abreviacao: "ATM" },
  { nome: "Barcelona", ligaNome: "La Liga", pais: "Espanha", abreviacao: "BAR" },
  { nome: "Valencia", ligaNome: "La Liga", pais: "Espanha", abreviacao: "VAL" },
  { nome: "Betis", ligaNome: "La Liga", pais: "Espanha", abreviacao: "BET" },
  { nome: "Athletic Bilbao", ligaNome: "La Liga", pais: "Espanha", abreviacao: "ATH" },
  { nome: "Real Sociedad", ligaNome: "La Liga", pais: "Espanha", abreviacao: "RSO" },

  // Serie A
  { nome: "Inter", ligaNome: "Serie A", pais: "Itália", abreviacao: "INT" },
  { nome: "Milan", ligaNome: "Serie A", pais: "Itália", abreviacao: "MIL" },
  { nome: "Juventus", ligaNome: "Serie A", pais: "Itália", abreviacao: "JUV" },
  { nome: "Napoli", ligaNome: "Serie A", pais: "Itália", abreviacao: "NAP" },
  { nome: "Roma", ligaNome: "Serie A", pais: "Itália", abreviacao: "ROM" },
  { nome: "Lazio", ligaNome: "Serie A", pais: "Itália", abreviacao: "LAZ" },
  { nome: "Atalanta", ligaNome: "Serie A", pais: "Itália", abreviacao: "ATA" },
  { nome: "Fiorentina", ligaNome: "Serie A", pais: "Itália", abreviacao: "FIO" },

  // Bundesliga
  { nome: "Bayern de Munique", ligaNome: "Bundesliga", pais: "Alemanha", abreviacao: "BAY" },
  { nome: "Dortmund", ligaNome: "Bundesliga", pais: "Alemanha", abreviacao: "BVB" },
  { nome: "Leverkusen", ligaNome: "Bundesliga", pais: "Alemanha", abreviacao: "LEV" },
  { nome: "RB Leipzig", ligaNome: "Bundesliga", pais: "Alemanha", abreviacao: "RBL" },
  { nome: "Eintracht Frankfurt", ligaNome: "Bundesliga", pais: "Alemanha", abreviacao: "SGE" },
  { nome: "Wolfsburg", ligaNome: "Bundesliga", pais: "Alemanha", abreviacao: "WOB" },
  { nome: "Stuttgart", ligaNome: "Bundesliga", pais: "Alemanha", abreviacao: "VFB" },
  { nome: "Freiburg", ligaNome: "Bundesliga", pais: "Alemanha", abreviacao: "SCF" },

  // Ligue 1
  { nome: "PSG", ligaNome: "Ligue 1", pais: "França", abreviacao: "PSG" },
  { nome: "Marselha", ligaNome: "Ligue 1", pais: "França", abreviacao: "OM" },
  { nome: "Lyon", ligaNome: "Ligue 1", pais: "França", abreviacao: "OL" },
  { nome: "Monaco", ligaNome: "Ligue 1", pais: "França", abreviacao: "ASM" },
  { nome: "Lille", ligaNome: "Ligue 1", pais: "França", abreviacao: "LOSC" },
  { nome: "Nice", ligaNome: "Ligue 1", pais: "França", abreviacao: "OGCN" },
  { nome: "Rennes", ligaNome: "Ligue 1", pais: "França", abreviacao: "SRFC" },
  { nome: "Lens", ligaNome: "Ligue 1", pais: "França", abreviacao: "RCL" },
];
