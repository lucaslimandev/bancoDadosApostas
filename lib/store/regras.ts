import { create } from "zustand";
import { persist } from "zustand/middleware";
import { REGRAS_OURO_PADRAO } from "@/lib/constants";

export type Regra = { id: string; texto: string; ativa: boolean };

type RegrasState = {
  regras: Regra[];
  adicionar: (texto: string) => void;
  remover: (id: string) => void;
  alternar: (id: string) => void;
  editar: (id: string, texto: string) => void;
  restaurarPadrao: () => void;
};

function regrasIniciais(): Regra[] {
  return REGRAS_OURO_PADRAO.map((texto, i) => ({ id: `padrao-${i}`, texto, ativa: true }));
}

export const useRegrasStore = create<RegrasState>()(
  persist(
    (set) => ({
      regras: regrasIniciais(),
      adicionar: (texto) =>
        set((s) => ({ regras: [...s.regras, { id: crypto.randomUUID(), texto, ativa: true }] })),
      remover: (id) => set((s) => ({ regras: s.regras.filter((r) => r.id !== id) })),
      alternar: (id) =>
        set((s) => ({ regras: s.regras.map((r) => (r.id === id ? { ...r, ativa: !r.ativa } : r)) })),
      editar: (id, texto) => set((s) => ({ regras: s.regras.map((r) => (r.id === id ? { ...r, texto } : r)) })),
      restaurarPadrao: () => set({ regras: regrasIniciais() }),
    }),
    { name: "trade-esportivo-regras" }
  )
);
