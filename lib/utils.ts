import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

export function formatBRLSinal(value: number): string {
  const sinal = value > 0 ? "+" : ""
  return `${sinal}${formatBRL(value)}`
}

export function formatPercent(value: number, decimais = 1): string {
  const sinal = value > 0 ? "+" : ""
  return `${sinal}${value.toFixed(decimais)}%`
}

export function formatBRLCompacto(value: number): string {
  const sinal = value > 0 ? "+" : ""
  return `${sinal}${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value)}`
}

export function formatMomento(fase: "PreJogo" | "AoVivo", minutoEntrada?: number | null, periodo?: string | null): string {
  if (fase === "PreJogo") return "Pré-jogo"
  if (minutoEntrada === null || minutoEntrada === undefined) return "Ao vivo"
  return periodo ? `${minutoEntrada}' ${periodo}` : `${minutoEntrada}'`
}
