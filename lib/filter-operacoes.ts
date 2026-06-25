import type { Operacao } from "@/lib/types";
import type { FiltrosState } from "@/lib/store/filters";

export function aplicarFiltros(operacoes: Operacao[], filtros: FiltrosState): Operacao[] {
  return operacoes.filter((op) => {
    const data = new Date(op.data);
    if (filtros.dataInicio && data < new Date(filtros.dataInicio)) return false;
    if (filtros.dataFim) {
      const fim = new Date(filtros.dataFim);
      fim.setHours(23, 59, 59, 999);
      if (data > fim) return false;
    }
    if (filtros.ligaIds.length > 0 && !filtros.ligaIds.includes(op.ligaId)) return false;
    if (filtros.metodoIds.length > 0 && !filtros.metodoIds.includes(op.metodoId)) return false;
    if (filtros.timeIds.length > 0 && !filtros.timeIds.includes(op.timeCasaId) && !filtros.timeIds.includes(op.timeForaId)) {
      return false;
    }
    if (filtros.tipo && op.tipo !== filtros.tipo) return false;
    return true;
  });
}
