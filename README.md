# TradeEsportivo

Web app de gestão de trading esportivo (lay / back / trade, pré-jogo e ao vivo). Permite registrar operações,
acompanhar performance em tempo real e disciplinar a gestão de banca, com tudo medido em **unidades (u)** —
onde 1u corresponde a um valor fixo em dinheiro definido nas configurações.

## Funcionalidades

- **Dashboard**: KPIs animados (lucro total, ROI, yield, taxa de acerto, banca atual, drawdown máximo, streak),
  gráficos de evolução da banca, drawdown, lucro por método/liga e distribuição por tipo, com filtros globais.
- **Calendário**: visão mensal com heatmap de lucro diário, badges de stop loss/gain batido, painel lateral com
  detalhes das operações do dia e atalho para registrar uma nova operação direto na data, além de visão em lista.
- **Operações**: CRUD completo com tabela ordenável/filtrável/paginável, formulário com cálculo automático de
  responsabilidade (lay) e lucro sugerido, duplicação, exclusão com confirmação e exportação/importação em CSV/JSON.
- **Gestão de Banca & Regras**: calculadora de stake/responsabilidade/risco, lista editável de regras de ouro e
  tracker de stop diário com alertas visuais.
- **Metas mensais**: definição de meta de lucro e de número de operações, com progresso e histórico mensal.
- **Configurações**: parâmetros da banca (banca inicial, valor da unidade, stops diários, stake padrão, máx.
  operações simultâneas), alternância de tema claro/escuro, limpeza de dados e restauração dos dados de exemplo.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS + [shadcn/ui](https://ui.shadcn.com) (sobre Base UI)
- Zustand (estado global de filtros e regras)
- TanStack Query (provider configurado para chamadas assíncronas client-side)
- Recharts (gráficos)
- react-day-picker + date-fns (calendário e datas)
- Lucide React (ícones) + Framer Motion (microanimações)
- Prisma + SQLite (`@prisma/adapter-better-sqlite3`), modelado para migrar a Postgres no futuro
- Zod + React Hook Form (formulários e validação)
- Papaparse (exportação/importação CSV)

## Como rodar localmente

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo de exemplo (o padrão já funciona para uso local com SQLite):

```bash
cp .env.example .env
```

### 3. Criar o banco e popular com dados de exemplo

```bash
npm run db:migrate   # cria/atualiza o banco SQLite local (dev.db) a partir do schema do Prisma
npm run db:seed       # popula o banco com configuração padrão, metas e ~16 operações de exemplo
```

Outros comandos úteis do Prisma:

```bash
npm run db:studio     # abre o Prisma Studio para inspecionar os dados
npm run db:reset       # reseta o banco e roda as migrations + seed novamente
```

### 4. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Build de produção

```bash
npm run build
npm run start
```

## Estrutura do projeto

```
app/                 rotas (App Router): dashboard, calendario, operacoes, gestao, metas, configuracoes
components/          componentes de UI organizados por feature (dashboard, calendario, operacoes, gestao, metas,
                     configuracoes, charts, layout) + components/ui (shadcn)
lib/                 lógica de domínio: cálculos (ROI, yield, drawdown, streaks), schemas Zod, server actions,
                     stores Zustand, cliente Prisma e dados de seed
prisma/              schema.prisma e script de seed
```

## Aviso de risco

Trading esportivo envolve risco real de perda. Esta ferramenta auxilia o controle de risco e a disciplina, mas
não o elimina, e não constitui recomendação de investimento.
