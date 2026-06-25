"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Liga, Time } from "@/lib/types";
import type { TimeFormValues } from "@/lib/schemas";
import { criarTime, atualizarTime, alternarAtivoTime, contarUsoTime, excluirTime, importarTimes } from "@/lib/actions/times";
import { exportarTimesCSV, exportarTimesJSON, importarArquivoTimes } from "@/lib/csv";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TimeForm } from "@/components/times/time-form";
import { DeleteGuardDialog, type OpcaoReatribuicao } from "@/components/catalogos/delete-guard-dialog";
import { Plus, Pencil, Trash2, Search, Download, FileUp, ChevronDown } from "lucide-react";

type TimeComRelacoes = Time & { liga: Liga | null; _count: { operacoesCasa: number; operacoesFora: number } };

export function TimesClient({ times, ligas }: { times: TimeComRelacoes[]; ligas: Liga[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [busca, setBusca] = useState("");
  const [filtroLiga, setFiltroLiga] = useState<string | null>(null);
  const [sheetAberto, setSheetAberto] = useState(false);
  const [editando, setEditando] = useState<Time | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [excluindo, setExcluindo] = useState<Time | null>(null);
  const [usageCount, setUsageCount] = useState<number | null>(null);
  const [excluindoLoading, setExcluindoLoading] = useState(false);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return times.filter((t) => {
      if (filtroLiga && t.ligaId !== filtroLiga) return false;
      if (!termo) return true;
      return `${t.nome} ${t.pais ?? ""}`.toLowerCase().includes(termo);
    });
  }, [times, busca, filtroLiga]);

  function abrirCriacao() {
    setEditando(null);
    setSheetAberto(true);
  }

  function abrirEdicao(t: Time) {
    setEditando(t);
    setSheetAberto(true);
  }

  async function handleSubmit(values: TimeFormValues) {
    setSubmitting(true);
    try {
      if (editando) {
        await atualizarTime(editando.id, values);
        toast.success("Time atualizado.");
      } else {
        await criarTime(values);
        toast.success("Time criado.");
      }
      setSheetAberto(false);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível salvar.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleAtivo(t: Time) {
    await alternarAtivoTime(t.id);
    router.refresh();
  }

  async function abrirExclusao(t: Time) {
    setExcluindo(t);
    const count = await contarUsoTime(t.id);
    setUsageCount(count);
  }

  async function handleExcluir(reatribuirParaId?: string) {
    if (!excluindo) return;
    setExcluindoLoading(true);
    try {
      await excluirTime(excluindo.id, reatribuirParaId);
      toast.success("Time excluído.");
      setExcluindo(null);
      setUsageCount(null);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível excluir.");
    } finally {
      setExcluindoLoading(false);
    }
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const linhas = await importarArquivoTimes(file);
      const resultado = await importarTimes(linhas);
      toast.success(
        `${resultado.importados} times importados, ${resultado.ignorados} ignorados, ${resultado.ligasCriadas} ligas criadas.`
      );
      router.refresh();
    } catch (err) {
      toast.error("Falha ao importar arquivo. Verifique o formato.");
      console.error(err);
    } finally {
      e.target.value = "";
    }
  }

  const opcoesReatribuicao: OpcaoReatribuicao[] = times
    .filter((t) => t.id !== excluindo?.id)
    .map((t) => ({ id: t.id, nome: t.nome }));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Times</h1>
          <p className="text-sm text-muted-foreground">Cadastro de clubes usados nas operações.</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium hover:bg-muted">
              <Download className="size-3.5" /> Exportar <ChevronDown className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => exportarTimesCSV(times)}>CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportarTimesJSON(times)}>JSON</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => fileInputRef.current?.click()}>
            <FileUp className="size-3.5" /> Importar
          </Button>
          <input ref={fileInputRef} type="file" accept=".csv,.json" className="hidden" onChange={handleImport} />
          <Button size="sm" className="gap-1.5" onClick={abrirCriacao}>
            <Plus className="size-3.5" /> Novo time
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input placeholder="Buscar por nome ou país..." className="pl-8" value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>
        <Select value={filtroLiga ?? "todas"} onValueChange={(v) => setFiltroLiga(v === "todas" ? null : v)}>
          <SelectTrigger size="sm" className="w-[200px]">
            <SelectValue placeholder="Liga" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as ligas</SelectItem>
            {ligas.map((l) => (
              <SelectItem key={l.id} value={l.id}>
                {l.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border divide-y">
        {filtrados.map((t) => (
          <div key={t.id} className={`flex items-center justify-between px-4 py-2.5 ${!t.ativo ? "opacity-60" : ""}`}>
            <div>
              <p className="text-sm font-medium">
                {t.nome} {t.abreviacao && <span className="text-muted-foreground">({t.abreviacao})</span>}
              </p>
              <p className="text-xs text-muted-foreground">{t.liga?.nome ?? "Sem liga"}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-[10px]">
                {t._count.operacoesCasa + t._count.operacoesFora} operações
              </Badge>
              <Switch checked={t.ativo} onCheckedChange={() => handleToggleAtivo(t)} />
              <Button variant="ghost" size="icon-sm" onClick={() => abrirEdicao(t)}>
                <Pencil className="size-3.5" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={() => abrirExclusao(t)}>
                <Trash2 className="size-3.5 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {filtrados.length === 0 && <p className="text-sm text-muted-foreground text-center py-12">Nenhum time encontrado.</p>}
      </div>

      <Sheet open={sheetAberto} onOpenChange={setSheetAberto}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>{editando ? "Editar time" : "Novo time"}</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-4">
            <TimeForm
              ligas={ligas}
              defaultValues={editando ?? undefined}
              onSubmit={handleSubmit}
              onCancel={() => setSheetAberto(false)}
              submitLabel={editando ? "Salvar alterações" : "Criar"}
              isSubmitting={submitting}
            />
          </div>
        </SheetContent>
      </Sheet>

      <DeleteGuardDialog
        open={!!excluindo}
        onOpenChange={(open) => {
          if (!open) {
            setExcluindo(null);
            setUsageCount(null);
          }
        }}
        itemNome={excluindo?.nome ?? ""}
        entidadeLabel="Este time"
        usageCount={usageCount}
        opcoesReatribuicao={opcoesReatribuicao}
        onConfirm={handleExcluir}
        loading={excluindoLoading}
      />
    </div>
  );
}
