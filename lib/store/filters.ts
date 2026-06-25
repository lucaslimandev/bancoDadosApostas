import { create } from "zustand";

export type FiltrosState = {
  dataInicio: string | null; // ISO yyyy-MM-dd
  dataFim: string | null;
  liga: string | null;
  metodo: string | null;
  tipo: "Lay" | "Back" | "Trade" | null;
  setDataInicio: (v: string | null) => void;
  setDataFim: (v: string | null) => void;
  setLiga: (v: string | null) => void;
  setMetodo: (v: string | null) => void;
  setTipo: (v: "Lay" | "Back" | "Trade" | null) => void;
  limparFiltros: () => void;
};

export const useFiltrosStore = create<FiltrosState>((set) => ({
  dataInicio: null,
  dataFim: null,
  liga: null,
  metodo: null,
  tipo: null,
  setDataInicio: (v) => set({ dataInicio: v }),
  setDataFim: (v) => set({ dataFim: v }),
  setLiga: (v) => set({ liga: v }),
  setMetodo: (v) => set({ metodo: v }),
  setTipo: (v) => set({ tipo: v }),
  limparFiltros: () => set({ dataInicio: null, dataFim: null, liga: null, metodo: null, tipo: null }),
}));
