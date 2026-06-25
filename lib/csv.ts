import Papa from "papaparse";
import type { Operacao } from "@/lib/types";
import type { OperacaoFormValues } from "@/lib/schemas";

const COLUNAS = [
  "data",
  "liga",
  "timeCasa",
  "timeFora",
  "mercado",
  "metodo",
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

function baixarArquivo(conteudo: string, nomeArquivo: string, mime: string) {
  const blob = new Blob([conteudo], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nomeArquivo;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportarOperacoesCSV(operacoes: Operacao[]) {
  const linhas = operacoes.map((op) => ({
    data: new Date(op.data).toISOString(),
    liga: op.liga,
    timeCasa: op.timeCasa,
    timeFora: op.timeFora,
    mercado: op.mercado,
    metodo: op.metodo,
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
  const csv = Papa.unparse({ fields: [...COLUNAS], data: linhas });
  baixarArquivo(csv, `operacoes-${Date.now()}.csv`, "text/csv;charset=utf-8;");
}

export function exportarOperacoesJSON(operacoes: Operacao[]) {
  baixarArquivo(JSON.stringify(operacoes, null, 2), `operacoes-${Date.now()}.json`, "application/json");
}

export async function importarArquivo(file: File): Promise<OperacaoFormValues[]> {
  if (file.name.endsWith(".json")) {
    const texto = await file.text();
    const dados = JSON.parse(texto);
    return (Array.isArray(dados) ? dados : []).map(normalizarLinha);
  }

  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (resultado) => {
        try {
          resolve((resultado.data as Record<string, string>[]).map(normalizarLinha));
        } catch (e) {
          reject(e);
        }
      },
      error: reject,
    });
  });
}

function normalizarLinha(linha: Record<string, unknown>): OperacaoFormValues {
  return {
    data: new Date(String(linha.data)),
    liga: String(linha.liga ?? ""),
    timeCasa: String(linha.timeCasa ?? ""),
    timeFora: String(linha.timeFora ?? ""),
    mercado: String(linha.mercado ?? ""),
    metodo: String(linha.metodo ?? ""),
    tipo: (linha.tipo as OperacaoFormValues["tipo"]) ?? "Back",
    momento: String(linha.momento ?? ""),
    oddEntrada: Number(linha.oddEntrada),
    oddSaida: linha.oddSaida ? Number(linha.oddSaida) : null,
    stake: Number(linha.stake),
    responsabilidade: linha.responsabilidade ? Number(linha.responsabilidade) : null,
    resultado: (linha.resultado as OperacaoFormValues["resultado"]) ?? "Anulado",
    lucro: Number(linha.lucro) || 0,
    observacoes: linha.observacoes ? String(linha.observacoes) : null,
  };
}
