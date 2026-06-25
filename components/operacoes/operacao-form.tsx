"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { operacaoSchema, type OperacaoFormValues } from "@/lib/schemas";
import { calcResponsabilidade, calcLucroSugerido } from "@/lib/calculations";
import { LIGAS, METODOS, MOMENTOS_SUGERIDOS, TIPOS_OPERACAO, RESULTADOS_OPERACAO } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2 } from "lucide-react";

export type OperacaoFormProps = {
  defaultValues?: Partial<OperacaoFormValues>;
  onSubmit: (values: OperacaoFormValues) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
};

export function OperacaoForm({ defaultValues, onSubmit, onCancel, submitLabel = "Salvar", isSubmitting }: OperacaoFormProps) {
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
      liga: LIGAS[0],
      timeCasa: "",
      timeFora: "",
      mercado: "",
      metodo: METODOS[0],
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

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values))}
      className="space-y-4"
    >
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

        <div className="space-y-1.5">
          <Label>Liga</Label>
          <Input list="ligas-sugeridas" {...register("liga")} placeholder="Ex.: Brasileirão Série A" />
          <datalist id="ligas-sugeridas">
            {LIGAS.map((l) => (
              <option key={l} value={l} />
            ))}
          </datalist>
          {errors.liga && <p className="text-xs text-destructive">{errors.liga.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Mercado</Label>
          <Input {...register("mercado")} placeholder="Ex.: Resultado Final" />
          {errors.mercado && <p className="text-xs text-destructive">{errors.mercado.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Time da casa</Label>
          <Input {...register("timeCasa")} placeholder="Ex.: Flamengo" />
          {errors.timeCasa && <p className="text-xs text-destructive">{errors.timeCasa.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Time visitante</Label>
          <Input {...register("timeFora")} placeholder="Ex.: Palmeiras" />
          {errors.timeFora && <p className="text-xs text-destructive">{errors.timeFora.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Método</Label>
          <Input list="metodos-sugeridos" {...register("metodo")} placeholder="Ex.: Lay Empate" />
          <datalist id="metodos-sugeridos">
            {METODOS.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
          {errors.metodo && <p className="text-xs text-destructive">{errors.metodo.message}</p>}
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
