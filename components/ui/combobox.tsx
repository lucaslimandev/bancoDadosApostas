"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { buttonVariants } from "@/components/ui/button";

export type ComboboxOption = { value: string; label: string; group?: string };

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Selecione...",
  searchPlaceholder = "Buscar...",
  emptyText = "Nenhum resultado.",
  onCreateNew,
  disabled,
}: {
  options: ComboboxOption[];
  value: string | null | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  onCreateNew?: (texto: string) => Promise<ComboboxOption>;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [busca, setBusca] = useState("");
  const [criando, setCriando] = useState(false);

  const selecionado = options.find((o) => o.value === value);

  const grupos = useMemo(() => {
    const mapa = new Map<string, ComboboxOption[]>();
    for (const o of options) {
      const key = o.group ?? "";
      const lista = mapa.get(key) ?? [];
      lista.push(o);
      mapa.set(key, lista);
    }
    return mapa;
  }, [options]);

  const existeExato = options.some((o) => o.label.toLowerCase() === busca.trim().toLowerCase());

  async function handleCreateNew() {
    if (!onCreateNew || !busca.trim()) return;
    setCriando(true);
    try {
      const novo = await onCreateNew(busca.trim());
      onChange(novo.value);
      setOpen(false);
      setBusca("");
    } finally {
      setCriando(false);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full justify-between font-normal",
          !selecionado && "text-muted-foreground"
        )}
      >
        <span className="truncate">{selecionado?.label ?? placeholder}</span>
        <ChevronsUpDown className="size-3.5 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder={searchPlaceholder} value={busca} onValueChange={setBusca} />
          <CommandList>
            {Array.from(grupos.entries()).map(([group, opts]) => {
              const filtradas = opts.filter((o) => o.label.toLowerCase().includes(busca.trim().toLowerCase()));
              if (filtradas.length === 0) return null;
              return (
                <CommandGroup key={group || "default"} heading={group || undefined}>
                  {filtradas.map((o) => (
                    <CommandItem
                      key={o.value}
                      value={o.value}
                      onSelect={() => {
                        onChange(o.value);
                        setOpen(false);
                        setBusca("");
                      }}
                    >
                      <Check className={cn("size-3.5", o.value === value ? "opacity-100" : "opacity-0")} />
                      {o.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
            {!options.some((o) => o.label.toLowerCase().includes(busca.trim().toLowerCase())) && (
              <CommandEmpty>{emptyText}</CommandEmpty>
            )}
            {onCreateNew && busca.trim() && !existeExato && (
              <CommandGroup>
                <CommandItem value={`__criar__${busca}`} onSelect={handleCreateNew} disabled={criando}>
                  {criando ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
                  Criar &quot;{busca.trim()}&quot;
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
