"use client";

import { useState } from "react";
import { useRegrasStore } from "@/lib/store/regras";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Plus, Trash2, RotateCcw } from "lucide-react";

export function RegrasOuro() {
  const { regras, adicionar, remover, alternar, restaurarPadrao } = useRegrasStore();
  const [novaRegra, setNovaRegra] = useState("");

  function handleAdicionar() {
    const texto = novaRegra.trim();
    if (!texto) return;
    adicionar(texto);
    setNovaRegra("");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="size-4 text-gold" /> Regras de Ouro
            </CardTitle>
            <CardDescription>Sua disciplina é o seu maior edge.</CardDescription>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={restaurarPadrao} title="Restaurar padrão">
            <RotateCcw className="size-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="space-y-2">
          {regras.map((r) => (
            <li key={r.id} className="flex items-center gap-2 group">
              <Checkbox checked={r.ativa} onCheckedChange={() => alternar(r.id)} />
              <span className={r.ativa ? "text-sm flex-1" : "text-sm flex-1 line-through text-muted-foreground"}>
                {r.texto}
              </span>
              <button
                onClick={() => remover(r.id)}
                className="text-muted-foreground hover:text-loss opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>

        <div className="flex gap-2 pt-2">
          <Input
            placeholder="Adicionar nova regra..."
            value={novaRegra}
            onChange={(e) => setNovaRegra(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdicionar()}
          />
          <Button size="icon" variant="outline" onClick={handleAdicionar}>
            <Plus className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
