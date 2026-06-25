import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

export function formatU(value: number, decimais = 1): string {
  const sinal = value > 0 ? "+" : ""
  return `${sinal}${value.toFixed(decimais)}u`
}

export function formatPercent(value: number, decimais = 1): string {
  const sinal = value > 0 ? "+" : ""
  return `${sinal}${value.toFixed(decimais)}%`
}
