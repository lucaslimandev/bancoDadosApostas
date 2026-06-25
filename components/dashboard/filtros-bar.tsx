"use client";

import { useFiltrosStore } from "@/lib/store/filters";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, X } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LIGAS, METODOS, TIPOS_OPERACAO } from "@/lib/constants";

export function FiltrosBar() {
  const { dataInicio, dataFim, liga, metodo, tipo, setDataInicio, setDataFim, setLiga, setMetodo, setTipo, limparFiltros } =
    useFiltrosStore();

  const temFiltro = dataInicio || dataFim || liga || metodo || tipo;

  const range = {
    from: dataInicio ? parseISO(dataInicio) : undefined,
    to: dataFim ? parseISO(dataFim) : undefined,
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <Popover>
        <PopoverTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}>
          <CalendarIcon className="size-3.5" />
          {range.from ? (
            range.to ? (
              <>
                {format(range.from, "dd/MM/yy")} – {format(range.to, "dd/MM/yy")}
              </>
            ) : (
              format(range.from, "dd/MM/yy")
            )
          ) : (
            "Período"
          )}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            locale={ptBR}
            selected={range}
            onSelect={(r) => {
              setDataInicio(r?.from ? format(r.from, "yyyy-MM-dd") : null);
              setDataFim(r?.to ? format(r.to, "yyyy-MM-dd") : null);
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <Select value={liga ?? "todas"} onValueChange={(v) => setLiga(v === "todas" ? null : v)}>
        <SelectTrigger size="sm" className="w-[170px]">
          <SelectValue placeholder="Liga" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas as ligas</SelectItem>
          {LIGAS.map((l) => (
            <SelectItem key={l} value={l}>
              {l}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={metodo ?? "todos"} onValueChange={(v) => setMetodo(v === "todos" ? null : v)}>
        <SelectTrigger size="sm" className="w-[170px]">
          <SelectValue placeholder="Método" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos os métodos</SelectItem>
          {METODOS.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={tipo ?? "todos"} onValueChange={(v) => setTipo(v === "todos" ? null : (v as typeof tipo))}>
        <SelectTrigger size="sm" className="w-[140px]">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos os tipos</SelectItem>
          {TIPOS_OPERACAO.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {temFiltro && (
        <Button variant="ghost" size="sm" onClick={limparFiltros} className="gap-1.5 text-muted-foreground">
          <X className="size-3.5" />
          Limpar
        </Button>
      )}
    </div>
  );
}
