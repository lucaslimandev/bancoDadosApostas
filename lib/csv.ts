import Papa from "papaparse";
import type { Operacao, Liga, Time } from "@/lib/types";
import type { LigaImportRow } from "@/lib/actions/ligas";
import type { TimeImportRow } from "@/lib/actions/times";

function baixarArquivo(conteudo: string, nomeArquivo: string, mime: string) {
  const blob = new Blob([conteudo], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nomeArquivo;
  link.click();
  URL.revokeObjectURL(url);
}

async function parseArquivo<T>(file: File, normalizar: (linha: Record<string, unknown>) => T): Promise<T[]> {
  if (file.name.endsWith(".json")) {
    const texto = await file.text();
    const dados = JSON.parse(texto);
    return (Array.isArray(dados) ? dados : []).map(normalizar);
  }

  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (resultado) => {
        try {
          resolve((resultado.data as Record<string, string>[]).map(normalizar));
        } catch (e) {
          reject(e);
        }
      },
      error: reject,
    });
  });
}

// ---- Operações ----

const COLUNAS_OPERACAO = [
  "data",
  "ligaNome",
  "timeCasaNome",
  "timeForaNome",
  "mercado",
  "metodoNome",
  "tipo",
  "momento",
  "oddEntrada",
  "oddSaida",
  "stake",
  "responsabilidade",
  "resultado",
  "lucro",
  "observacoes",
] as const;

export type OperacaoImportRow = {
  data: Date;
  ligaNome: string;
  timeCasaNome: string;
  timeForaNome: string;
  mercado: string;
  metodoNome: string;
  tipo: "Lay" | "Back" | "Trade";
  momento: string;
  oddEntrada: number;
  oddSaida?: number | null;
  stake: number;
  responsabilidade?: number | null;
  resultado: "Green" | "Red" | "Anulado";
  lucro: number;
  observacoes?: string | null;
};

export function exportarOperacoesCSV(operacoes: Operacao[]) {
  const linhas = operacoes.map((op) => ({
    data: new Date(op.data).toISOString(),
    ligaNome: op.liga.nome,
    timeCasaNome: op.timeCasa.nome,
    timeForaNome: op.timeFora.nome,
    mercado: op.mercado,
    metodoNome: op.metodo.nome,
    tipo: op.tipo,
    momento: op.momento,
    oddEntrada: op.oddEntrada,
    oddSaida: op.oddSaida ?? "",
    stake: op.stake,
    responsabilidade: op.responsabilidade ?? "",
    resultado: op.resultado,
    lucro: op.lucro,
    observacoes: op.observacoes ?? "",
  }));
  const csv = Papa.unparse({ fields: [...COLUNAS_OPERACAO], data: linhas });
  baixarArquivo(csv, `operacoes-${Date.now()}.csv`, "text/csv;charset=utf-8;");
}

export function exportarOperacoesJSON(operacoes: Operacao[]) {
  baixarArquivo(JSON.stringify(operacoes, null, 2), `operacoes-${Date.now()}.json`, "application/json");
}

export async function importarArquivoOperacoes(file: File): Promise<OperacaoImportRow[]> {
  return parseArquivo(file, (linha) => ({
    data: new Date(String(linha.data)),
    ligaNome: String(linha.ligaNome ?? linha.liga ?? ""),
    timeCasaNome: String(linha.timeCasaNome ?? linha.timeCasa ?? ""),
    timeForaNome: String(linha.timeForaNome ?? linha.timeFora ?? ""),
    mercado: String(linha.mercado ?? ""),
    metodoNome: String(linha.metodoNome ?? linha.metodo ?? ""),
    tipo: (linha.tipo as OperacaoImportRow["tipo"]) ?? "Back",
    momento: String(linha.momento ?? ""),
    oddEntrada: Number(linha.oddEntrada),
    oddSaida: linha.oddSaida ? Number(linha.oddSaida) : null,
    stake: Number(linha.stake),
    responsabilidade: linha.responsabilidade ? Number(linha.responsabilidade) : null,
    resultado: (linha.resultado as OperacaoImportRow["resultado"]) ?? "Anulado",
    lucro: Number(linha.lucro) || 0,
    observacoes: linha.observacoes ? String(linha.observacoes) : null,
  }));
}

// ---- Ligas ----

export function exportarLigasCSV(ligas: Liga[]) {
  const linhas = ligas.map((l) => ({ nome: l.nome, pais: l.pais, tipo: l.tipo, nivel: l.nivel ?? "" }));
  const csv = Papa.unparse({ fields: ["nome", "pais", "tipo", "nivel"], data: linhas });
  baixarArquivo(csv, `ligas-${Date.now()}.csv`, "text/csv;charset=utf-8;");
}

export function exportarLigasJSON(ligas: Liga[]) {
  baixarArquivo(JSON.stringify(ligas, null, 2), `ligas-${Date.now()}.json`, "application/json");
}

export async function importarArquivoLigas(file: File): Promise<LigaImportRow[]> {
  return parseArquivo(file, (linha) => ({
    nome: String(linha.nome ?? ""),
    pais: String(linha.pais ?? "A definir"),
    tipo: (linha.tipo as LigaImportRow["tipo"]) ?? "Liga",
    nivel: linha.nivel ? String(linha.nivel) : null,
  }));
}

// ---- Times ----

export function exportarTimesCSV(times: Array<Time & { liga: Liga | null }>) {
  const linhas = times.map((t) => ({
    nome: t.nome,
    pais: t.pais ?? "",
    liga: t.liga?.nome ?? "",
    abreviacao: t.abreviacao ?? "",
  }));
  const csv = Papa.unparse({ fields: ["nome", "pais", "liga", "abreviacao"], data: linhas });
  baixarArquivo(csv, `times-${Date.now()}.csv`, "text/csv;charset=utf-8;");
}

export function exportarTimesJSON(times: Array<Time & { liga: Liga | null }>) {
  baixarArquivo(JSON.stringify(times, null, 2), `times-${Date.now()}.json`, "application/json");
}

export async function importarArquivoTimes(file: File): Promise<TimeImportRow[]> {
  return parseArquivo(file, (linha) => ({
    nome: String(linha.nome ?? ""),
    pais: linha.pais ? String(linha.pais) : null,
    ligaNome: linha.liga ? String(linha.liga) : linha.ligaNome ? String(linha.ligaNome) : null,
    abreviacao: linha.abreviacao ? String(linha.abreviacao) : null,
  }));
}
