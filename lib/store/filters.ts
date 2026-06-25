import { create } from "zustand";

export type FiltrosState = {
  dataInicio: string | null; // ISO yyyy-MM-dd
  dataFim: string | null;
  ligaIds: string[];
  metodoIds: string[];
  timeIds: string[];
  tipo: "Lay" | "Back" | "Trade" | null;
  setDataInicio: (v: string | null) => void;
  setDataFim: (v: string | null) => void;
  toggleLigaId: (id: string) => void;
  toggleMetodoId: (id: string) => void;
  toggleTimeId: (id: string) => void;
  setTipo: (v: "Lay" | "Back" | "Trade" | null) => void;
  limparFiltros: () => void;
};

function toggleEmArray(lista: string[], id: string): string[] {
  return lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id];
}

export const useFiltrosStore = create<FiltrosState>((set) => ({
  dataInicio: null,
  dataFim: null,
  ligaIds: [],
  metodoIds: [],
  timeIds: [],
  tipo: null,
  setDataInicio: (v) => set({ dataInicio: v }),
  setDataFim: (v) => set({ dataFim: v }),
  toggleLigaId: (id) => set((s) => ({ ligaIds: toggleEmArray(s.ligaIds, id) })),
  toggleMetodoId: (id) => set((s) => ({ metodoIds: toggleEmArray(s.metodoIds, id) })),
  toggleTimeId: (id) => set((s) => ({ timeIds: toggleEmArray(s.timeIds, id) })),
  setTipo: (v) => set({ tipo: v }),
  limparFiltros: () => set({ dataInicio: null, dataFim: null, ligaIds: [], metodoIds: [], timeIds: [], tipo: null }),
}));
