"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { operacaoSchema, type OperacaoFormValues } from "@/lib/schemas";
import { calcResponsabilidade, calcLucroSugerido } from "@/lib/calculations";
import { MOMENTOS_SUGERIDOS, TIPOS_OPERACAO, RESULTADOS_OPERACAO } from "@/lib/constants";
import type { Liga, Metodo, Time } from "@/lib/types";
import { criarLiga } from "@/lib/actions/ligas";
import { criarMetodo } from "@/lib/actions/metodos";
import { criarTimeInline } from "@/lib/actions/times";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { Wand2 } from "lucide-react";

const TIPO_LIGA_LABEL: Record<string, string> = { Liga: "Ligas", Copa: "Copas", Continental: "Continentais", Selecoes: "Seleções" };

export type OperacaoFormProps = {
  ligas: Liga[];
  metodos: Metodo[];
  times: Time[];
  defaultValues?: Partial<OperacaoFormValues>;
  onSubmit: (values: OperacaoFormValues) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
};

export function OperacaoForm({
  ligas,
  metodos,
  times,
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
  isSubmitting,
}: OperacaoFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OperacaoFormValues>({
    resolver: zodResolver(operacaoSchema),
    defaultValues: {
      data: new Date(),
      ligaId: ligas[0]?.id ?? "",
      timeCasaId: "",
      timeForaId: "",
      mercado: "",
      metodoId: metodos[0]?.id ?? "",
      tipo: "Lay",
      momento: "Pré-jogo",
      oddEntrada: 2,
      oddSaida: undefined,
      stake: 4,
      responsabilidade: undefined,
      resultado: "Green",
      lucro: 0,
      observacoes: "",
      ...defaultValues,
    },
  });

  const tipo = watch("tipo");
  const resultado = watch("resultado");
  const oddEntrada = watch("oddEntrada");
  const oddSaida = watch("oddSaida");
  const stake = watch("stake");
  const ligaId = watch("ligaId");
  const metodoId = watch("metodoId");
  const timeCasaId = watch("timeCasaId");
  const timeForaId = watch("timeForaId");

  useEffect(() => {
    if (tipo === "Lay" && oddEntrada > 0 && stake > 0) {
      setValue("responsabilidade", calcResponsabilidade(Number(stake), Number(oddEntrada)));
    }
  }, [tipo, oddEntrada, stake, setValue]);

  function aplicarLucroSugerido() {
    const sugerido = calcLucroSugerido({
      tipo,
      resultado,
      oddEntrada: Number(oddEntrada),
      oddSaida: oddSaida ? Number(oddSaida) : null,
      stake: Number(stake),
    });
    setValue("lucro", sugerido);
  }

  const dataValue = watch("data");
  const dataISO = dataValue instanceof Date && !isNaN(dataValue.getTime()) ? format(dataValue, "yyyy-MM-dd'T'HH:mm") : "";

  const opcoesLiga = useMemo(
    () => ligas.map((l) => ({ value: l.id, label: l.nome, group: TIPO_LIGA_LABEL[l.tipo] ?? l.tipo })),
    [ligas]
  );
  const opcoesMetodo = useMemo(() => metodos.map((m) => ({ value: m.id, label: m.nome })), [metodos]);
  const timesDaLiga = useMemo(() => times.filter((t) => !ligaId || t.ligaId === ligaId), [times, ligaId]);
  const opcoesTime = useMemo(() => timesDaLiga.map((t) => ({ value: t.id, label: t.nome })), [timesDaLiga]);

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5 col-span-2">
          <Label>Data e hora</Label>
          <Input
            type="datetime-local"
            defaultValue={dataISO}
            onChange={(e) => setValue("data", e.target.value ? new Date(e.target.value) : new Date())}
          />
          {errors.data && <p className="text-xs text-destructive">{String(errors.data.message)}</p>}
        </div>

        <div className="space-y-1.5 col-span-2">
          <Label>Liga</Label>
          <Combobox
            options={opcoesLiga}
            value={ligaId}
            onChange={(v) => setValue("ligaId", v)}
            placeholder="Selecione a liga"
            searchPlaceholder="Buscar liga..."
            onCreateNew={async (texto) => {
              const nova = await criarLiga({ nome: texto, pais: "A definir", tipo: "Liga", nivel: null, ativo: true });
              return { value: nova.id, label: nova.nome, group: TIPO_LIGA_LABEL[nova.tipo] };
            }}
          />
          {errors.ligaId && <p className="text-xs text-destructive">{errors.ligaId.message}</p>}
        </div>

        <div className="space-y-1.5 col-span-2">
          <Label>Mercado</Label>
          <Input {...register("mercado")} placeholder="Ex.: Resultado Final" />
          {errors.mercado && <p className="text-xs text-destructive">{errors.mercado.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Time da casa</Label>
          <Combobox
            options={opcoesTime}
            value={timeCasaId}
            onChange={(v) => setValue("timeCasaId", v)}
            placeholder="Selecione o time"
            searchPlaceholder="Buscar time..."
            onCreateNew={async (texto) => {
              const novo = await criarTimeInline(texto, ligaId || null);
              return { value: novo.id, label: novo.nome };
            }}
          />
          {errors.timeCasaId && <p className="text-xs text-destructive">{errors.timeCasaId.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Time visitante</Label>
          <Combobox
            options={opcoesTime}
            value={timeForaId}
            onChange={(v) => setValue("timeForaId", v)}
            placeholder="Selecione o time"
            searchPlaceholder="Buscar time..."
            onCreateNew={async (texto) => {
              const novo = await criarTimeInline(texto, ligaId || null);
              return { value: novo.id, label: novo.nome };
            }}
          />
          {errors.timeForaId && <p className="text-xs text-destructive">{errors.timeForaId.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Método</Label>
          <Combobox
            options={opcoesMetodo}
            value={metodoId}
            onChange={(v) => setValue("metodoId", v)}
            placeholder="Selecione o método"
            searchPlaceholder="Buscar método..."
            onCreateNew={async (texto) => {
              const novo = await criarMetodo({ nome: texto, descricao: null, cor: "#64748b", ativo: true });
              return { value: novo.id, label: novo.nome };
            }}
          />
          {errors.metodoId && <p className="text-xs text-destructive">{errors.metodoId.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Momento</Label>
          <Input list="momentos-sugeridos" {...register("momento")} placeholder="Ex.: Pré-jogo" />
          <datalist id="momentos-sugeridos">
            {MOMENTOS_SUGERIDOS.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
          {errors.momento && <p className="text-xs text-destructive">{errors.momento.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Tipo</Label>
          <Select value={tipo} onValueChange={(v) => setValue("tipo", v as OperacaoFormValues["tipo"])}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIPOS_OPERACAO.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Resultado</Label>
          <Select value={resultado} onValueChange={(v) => setValue("resultado", v as OperacaoFormValues["resultado"])}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RESULTADOS_OPERACAO.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Odd de entrada</Label>
          <Input type="number" step="0.01" {...register("oddEntrada", { valueAsNumber: true })} />
          {errors.oddEntrada && <p className="text-xs text-destructive">{errors.oddEntrada.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Odd de saída {tipo !== "Trade" && <span className="text-muted-foreground">(opcional)</span>}</Label>
          <Input
            type="number"
            step="0.01"
            {...register("oddSaida", { setValueAs: (v) => (v === "" ? null : Number(v)) })}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Stake (u)</Label>
          <Input type="number" step="0.1" {...register("stake", { valueAsNumber: true })} />
          {errors.stake && <p className="text-xs text-destructive">{errors.stake.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>
            Responsabilidade (u) {tipo === "Lay" && <span className="text-muted-foreground">(auto)</span>}
          </Label>
          <Input
            type="number"
            step="0.01"
            {...register("responsabilidade", { setValueAs: (v) => (v === "" ? null : Number(v)) })}
            readOnly={tipo === "Lay"}
          />
        </div>

        <div className="space-y-1.5 col-span-2">
          <div className="flex items-center justify-between">
            <Label>Lucro (u)</Label>
            <Button type="button" variant="ghost" size="xs" onClick={aplicarLucroSugerido} className="gap-1 text-muted-foreground">
              <Wand2 className="size-3" />
              Sugerir lucro
            </Button>
          </div>
          <Input type="number" step="0.01" {...register("lucro", { valueAsNumber: true })} />
          {errors.lucro && <p className="text-xs text-destructive">{errors.lucro.message}</p>}
        </div>

        <div className="space-y-1.5 col-span-2">
          <Label>Observações</Label>
          <Textarea rows={2} {...register("observacoes")} placeholder="Opcional" />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
