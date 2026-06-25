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
import { TIPOS_OPERACAO } from "@/lib/constants";
import { MultiSelectFilter } from "@/components/dashboard/multi-select-filter";
import type { Liga, Metodo, Time } from "@/lib/types";

export function FiltrosBar({
  ligas,
  metodos,
  times,
  mostrarPeriodo = true,
}: {
  ligas: Liga[];
  metodos: Metodo[];
  times: Time[];
  mostrarPeriodo?: boolean;
}) {
  const {
    dataInicio,
    dataFim,
    ligaIds,
    metodoIds,
    timeIds,
    tipo,
    setDataInicio,
    setDataFim,
    toggleLigaId,
    toggleMetodoId,
    toggleTimeId,
    setTipo,
    limparFiltros,
  } = useFiltrosStore();

  const temFiltro = dataInicio || dataFim || ligaIds.length > 0 || metodoIds.length > 0 || timeIds.length > 0 || tipo;

  const range = {
    from: dataInicio ? parseISO(dataInicio) : undefined,
    to: dataFim ? parseISO(dataFim) : undefined,
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {mostrarPeriodo && (
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
      )}

      <MultiSelectFilter
        label="Liga"
        options={ligas.map((l) => ({ value: l.id, label: l.nome }))}
        selected={ligaIds}
        onToggle={toggleLigaId}
      />

      <MultiSelectFilter
        label="Método"
        options={metodos.map((m) => ({ value: m.id, label: m.nome }))}
        selected={metodoIds}
        onToggle={toggleMetodoId}
      />

      <MultiSelectFilter
        label="Time"
        options={times.map((t) => ({ value: t.id, label: t.nome }))}
        selected={timeIds}
        onToggle={toggleTimeId}
      />

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
