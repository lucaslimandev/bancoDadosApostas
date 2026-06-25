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
    if (filtros.liga && op.liga !== filtros.liga) return false;
    if (filtros.metodo && op.metodo !== filtros.metodo) return false;
    if (filtros.tipo && op.tipo !== filtros.tipo) return false;
    return true;
  });
}
