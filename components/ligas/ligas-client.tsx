"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Liga } from "@/lib/types";
import type { LigaFormValues } from "@/lib/schemas";
import { criarLiga, atualizarLiga, alternarAtivoLiga, contarUsoLiga, excluirLiga, importarLigas } from "@/lib/actions/ligas";
import { exportarLigasCSV, exportarLigasJSON, importarArquivoLigas } from "@/lib/csv";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LigaForm } from "@/components/ligas/liga-form";
import { DeleteGuardDialog, type OpcaoReatribuicao } from "@/components/catalogos/delete-guard-dialog";
import { Plus, Pencil, Trash2, Search, Download, FileUp, ChevronDown } from "lucide-react";

type LigaComContagem = Liga & { _count: { operacoes: number; times: number } };

const TIPO_LABEL: Record<string, string> = { Liga: "Ligas", Copa: "Copas", Continental: "Continentais", Selecoes: "Seleções" };

export function LigasClient({ ligas }: { ligas: LigaComContagem[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [busca, setBusca] = useState("");
  const [sheetAberto, setSheetAberto] = useState(false);
  const [editando, setEditando] = useState<Liga | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [excluindo, setExcluindo] = useState<Liga | null>(null);
  const [usageCount, setUsageCount] = useState<number | null>(null);
  const [excluindoLoading, setExcluindoLoading] = useState(false);

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return ligas;
    return ligas.filter((l) => `${l.nome} ${l.pais}`.toLowerCase().includes(termo));
  }, [ligas, busca]);

  const grupos = useMemo(() => {
    const mapa = new Map<string, LigaComContagem[]>();
    for (const l of filtradas) {
      const lista = mapa.get(l.tipo) ?? [];
      lista.push(l);
      mapa.set(l.tipo, lista);
    }
    return mapa;
  }, [filtradas]);

  function abrirCriacao() {
    setEditando(null);
    setSheetAberto(true);
  }

  function abrirEdicao(l: Liga) {
    setEditando(l);
    setSheetAberto(true);
  }

  async function handleSubmit(values: LigaFormValues) {
    setSubmitting(true);
    try {
      if (editando) {
        await atualizarLiga(editando.id, values);
        toast.success("Liga atualizada.");
      } else {
        await criarLiga(values);
        toast.success("Liga criada.");
      }
      setSheetAberto(false);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível salvar.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleAtivo(l: Liga) {
    await alternarAtivoLiga(l.id);
    router.refresh();
  }

  async function abrirExclusao(l: Liga) {
    setExcluindo(l);
    const uso = await contarUsoLiga(l.id);
    setUsageCount(uso.operacoes);
  }

  async function handleExcluir(reatribuirParaId?: string) {
    if (!excluindo) return;
    setExcluindoLoading(true);
    try {
      await excluirLiga(excluindo.id, reatribuirParaId);
      toast.success("Liga excluída.");
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
      const linhas = await importarArquivoLigas(file);
      const resultado = await importarLigas(linhas);
      toast.success(`${resultado.importadas} ligas importadas, ${resultado.ignoradas} ignoradas (duplicadas).`);
      router.refresh();
    } catch (err) {
      toast.error("Falha ao importar arquivo. Verifique o formato.");
      console.error(err);
    } finally {
      e.target.value = "";
    }
  }

  const opcoesReatribuicao: OpcaoReatribuicao[] = ligas
    .filter((l) => l.id !== excluindo?.id)
    .map((l) => ({ id: l.id, nome: l.nome }));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Ligas</h1>
          <p className="text-sm text-muted-foreground">Ligas, copas, competições continentais e de seleções.</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium hover:bg-muted">
              <Download className="size-3.5" /> Exportar <ChevronDown className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => exportarLigasCSV(ligas)}>CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportarLigasJSON(ligas)}>JSON</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => fileInputRef.current?.click()}>
            <FileUp className="size-3.5" /> Importar
          </Button>
          <input ref={fileInputRef} type="file" accept=".csv,.json" className="hidden" onChange={handleImport} />
          <Button size="sm" className="gap-1.5" onClick={abrirCriacao}>
            <Plus className="size-3.5" /> Nova liga
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <Input placeholder="Buscar por nome ou país..." className="pl-8" value={busca} onChange={(e) => setBusca(e.target.value)} />
      </div>

      {Array.from(grupos.entries()).map(([tipo, lista]) => (
        <div key={tipo} className="mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground mb-2">{TIPO_LABEL[tipo] ?? tipo}</h2>
          <div className="rounded-lg border divide-y">
            {lista.map((l) => (
              <div key={l.id} className={`flex items-center justify-between px-4 py-2.5 ${!l.ativo ? "opacity-60" : ""}`}>
                <div>
                  <p className="text-sm font-medium">{l.nome}</p>
                  <p className="text-xs text-muted-foreground">
                    {l.pais} {l.nivel ? `· ${l.nivel}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-[10px]">{l._count.operacoes} operações</Badge>
                  <Badge variant="secondary" className="text-[10px]">{l._count.times} times</Badge>
                  <Switch checked={l.ativo} onCheckedChange={() => handleToggleAtivo(l)} />
                  <Button variant="ghost" size="icon-sm" onClick={() => abrirEdicao(l)}>
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => abrirExclusao(l)}>
                    <Trash2 className="size-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {filtradas.length === 0 && <p className="text-sm text-muted-foreground text-center py-12">Nenhuma liga encontrada.</p>}

      <Sheet open={sheetAberto} onOpenChange={setSheetAberto}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>{editando ? "Editar liga" : "Nova liga"}</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-4">
            <LigaForm
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
        entidadeLabel="Esta liga"
        usageCount={usageCount}
        opcoesReatribuicao={opcoesReatribuicao}
        onConfirm={handleExcluir}
        loading={excluindoLoading}
      />
    </div>
  );
}
