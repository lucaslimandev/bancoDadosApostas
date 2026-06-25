export const LIGAS = [
  "Brasileirão Série A",
  "Premier League",
  "La Liga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
] as const;

export const METODOS = [
  "Pressão Reversa",
  "Scalping Ao Vivo",
  "Lay Empate",
  "Cash Out Verde",
] as const;

export const MOMENTOS_SUGERIDOS = ["Pré-jogo", "1ºT", "Intervalo", "2ºT", "Acréscimos"] as const;

export const TIPOS_OPERACAO = ["Lay", "Back", "Trade"] as const;

export const RESULTADOS_OPERACAO = ["Green", "Red", "Anulado"] as const;

export const REGRAS_OURO_PADRAO = [
  "Stake entre 1% e 3% da banca por operação",
  "Nunca aumentar o stake após um red",
  "Respeitar o stop loss e o stop gain diário",
  "Máximo de 2 operações simultâneas ao vivo",
  "Registrar a operação antes de saber o resultado",
  "Proibido martingale ou reposição de perdas",
  "Fazer revisão semanal da performance",
  "Fechar a plataforma ao detectar sinais de tilt",
];
