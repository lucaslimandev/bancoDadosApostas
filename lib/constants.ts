export const TIPOS_OPERACAO = ["Lay", "Back", "Trade"] as const;

export const RESULTADOS_OPERACAO = ["Green", "Red", "Anulado"] as const;

export const FASES_OPERACAO = ["PreJogo", "AoVivo"] as const;

export const FASE_OPERACAO_LABEL: Record<string, string> = {
  PreJogo: "Pré-jogo",
  AoVivo: "Ao vivo",
};

export const STATUS_OPERACAO_LABEL: Record<string, string> = {
  Aberta: "Aberta",
  Encerrada: "Encerrada",
};

export const PERIODOS_SUGERIDOS = ["1ºT", "Intervalo", "2ºT", "Prorrogação"] as const;

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
