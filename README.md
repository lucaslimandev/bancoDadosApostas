# TradeEsportivo

Web app de gestão de trading esportivo (lay / back / trade, pré-jogo e ao vivo). Tudo é medido em
**dinheiro real (R$)** — sem unidades abstratas — e em **porcentagem** para as métricas de
performance (ROI, Yield, Taxa de Acerto). PWA, mobile-first, pronto para deploy na Vercel.

## Funcionalidades

- **Dashboard**: KPIs animados em R$/% (lucro realizado, ROI, yield, taxa de acerto, banca atual,
  exposição em aberto, nº de operações, drawdown máximo), cartões de melhor/pior dia, melhor
  método/liga, maior sequência de greens/reds e recorte de desempenho por fase (pré-jogo vs ao
  vivo) e por faixa de minuto de entrada. Gráficos de evolução da banca, drawdown, lucro por
  método/liga e distribuição por tipo, com filtros globais por período, liga, método, time e tipo.
- **Calendário**: visão mensal com heatmap de lucro diário em R$, badges de stop loss/gain batido,
  painel lateral com detalhes das operações do dia (incluindo as em andamento) e atalho para
  registrar uma operação direto na data, visão em lista e os mesmos filtros globais.
- **Operações**: CRUD completo com cadastro **pré-jogo ou ao vivo** (minuto + período da entrada),
  **critério de entrada** e **critério de saída** independentes, e **status Aberta/Encerrada** —
  uma operação pode ser registrada sem resultado definido (fica "em andamento") e encerrada depois
  pelo botão "Encerrar", que abre o formulário focado nos campos de saída. Operações abertas
  aparecem destacadas num bloco no topo com a exposição total em aberto, e não entram no lucro
  realizado. Tabela ordenável/filtrável/paginável, seleção em massa, formulário com selects
  relacionais (liga/método/times) com busca e criação inline, cálculo automático de
  responsabilidade (lay) e lucro sugerido, duplicação e exportação/importação em CSV/JSON.
- **Métodos**: além de nome/descrição/cor/ativo, cada método define se usa **Back**, **Lay** ou
  ambos e **quantas stakes** (múltiplos da stake fixa) entra em cada lado, com preview em R$ ao
  vivo. Também define critérios de entrada/saída padrão sugeridos automaticamente ao cadastrar uma
  operação com esse método.
- **Ligas** e **Times**: cadastro com importação via CSV/JSON e seed inicial com as principais
  ligas/competições e clubes do mundo.
- **Gestão de Banca & Regras**: calculadora de stake/responsabilidade/risco em R$, lista editável
  de regras de ouro e tracker de stop diário (em R$) com alertas visuais.
- **Metas mensais**: meta de lucro em R$ e de número de operações, com progresso e histórico
  mensal.
- **Configurações**: banca inicial (R$), **stake fixa** configurável por **valor fixo em R$** ou
  **percentual da banca atual** (com o valor de "1 stake" sempre visível e recalculado), stops
  diários (R$), máx. operações simultâneas, tema claro/escuro, limpeza de dados e restauração dos
  dados de exemplo.

Excluir um método, liga ou time que esteja em uso bloqueia a exclusão a menos que você reatribua as
operações afetadas para outro item do mesmo tipo — nenhuma operação fica órfã.

## Stake fixa e stakes por modelo

A **stake fixa** é a unidade base de aposta: em vez de digitar valores aleatórios, você sempre
entra em múltiplos dela. Em Configurações, defina-a como valor fixo em R$ ou como percentual da
banca atual (recalculado automaticamente conforme seu resultado). Cada **Método** define quantas
stakes usa no Back e quantas usa no Lay (ex.: 1, 1.5, 2) — ao escolher o método e o tipo (Back/Lay)
no cadastro de uma operação, a stake em R$ é pré-preenchida automaticamente (editável manualmente).

## Pré-jogo e ao vivo, critérios e status

Cada operação tem uma **fase** (Pré-jogo ou Ao vivo). Ao vivo, registre o **minuto da entrada** e o
**período** (1ºT, intervalo, 2ºT, prorrogação); um campo de exibição amigável (ex.: "35' 1ºT") é
gerado automaticamente. Cada operação também guarda um **critério de entrada** (o que motivou a
entrada, sugerido a partir do método) e, quando encerrada, um **critério de saída**. O **status**
(Aberta/Encerrada) controla se a operação já tem resultado/lucro: operações abertas não entram nos
KPIs de lucro realizado, mas contam para o indicador de exposição em aberto.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS + [shadcn/ui](https://ui.shadcn.com) (sobre Base UI)
- Zustand (estado global de filtros e regras)
- TanStack Query (provider configurado para chamadas assíncronas client-side)
- Recharts (gráficos)
- react-day-picker + date-fns (calendário e datas)
- Lucide React (ícones) + Framer Motion (microanimações)
- Prisma + SQLite (dev, `@prisma/adapter-better-sqlite3`) / Postgres (produção,
  `@prisma/adapter-pg`) — schema/datasource comutável automaticamente (veja "Deploy na Vercel")
- Zod + React Hook Form (formulários e validação)
- Papaparse (exportação/importação CSV)
- PWA: manifest gerado (`app/manifest.ts`), ícones gerados via `next/og`, service worker básico
  (`public/sw.js`)

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
npm run db:seed       # popula configuração padrão, metas, catálogos e operações de exemplo
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

## Modelo de dados

- **Metodo**: `nome` (único), `descricao`, `cor`, `ativo`, `usaBack`/`usaLay`,
  `stakesBack`/`stakesLay` (nº de stakes fixas), `criterioEntradaPadrao`/`criterioSaidaPadrao`.
- **Liga**: `nome` (único), `pais`, `tipo` (`Liga` | `Copa` | `Continental` | `Selecoes`), `nivel`,
  `ativo`.
- **Time**: `nome`, `pais`, `abreviacao`, `ligaId` (opcional), `ativo`.
- **Operacao**: dados da partida/mercado, `tipo` (Lay/Back/Trade), `fase` (PreJogo/AoVivo) +
  `minutoEntrada`/`periodo`, odds, `stake`/`responsabilidade` (R$), `criterioEntrada`/
  `criterioSaida`, `status` (Aberta/Encerrada), `resultado`/`lucro` (nulos enquanto Aberta).
- **Configuracao**: `bancaInicial` (R$), `stakeModo` (Valor/Percentual), `stakeValor` (R$),
  `stakePercentual` (%), `stopLossDiario`/`stopGainDiario` (R$), `maxOperacoesSimultaneas`, `tema`.
- **Meta**: `mes`, `metaLucro` (R$), `metaOperacoes`.

`Operacao.ligaId`, `metodoId`, `timeCasaId` e `timeForaId` são protegidos contra exclusão em
cascata: a UI sempre conta o uso antes de excluir um item do catálogo e oferece reatribuir as
operações afetadas, ou bloqueia a exclusão se não houver para onde reatribuir.

## Importação via CSV/JSON

**Operações** — `data, ligaNome, timeCasaNome, timeForaNome, mercado, metodoNome, tipo, momento,
fase, minutoEntrada, periodo, oddEntrada, oddSaida, stake, responsabilidade, criterioEntrada,
criterioSaida, status, resultado, lucro, observacoes`

**Ligas** — `nome, pais, tipo, nivel` (tipo: `Liga` | `Copa` | `Continental` | `Selecoes`)

**Times** — `nome, pais, liga, abreviacao` (a coluna `liga` é o nome da liga; se não existir, é
criada)

Itens referenciados por nome que não existirem ainda são criados automaticamente (ligas, métodos,
times).

## PWA

O app é instalável no celular: manifest (`app/manifest.ts`), ícones gerados em build/runtime via
`next/og` (`app/icon.tsx`, `app/apple-icon.tsx`, `/icon-192.png`, `/icon-512.png`) e um service
worker básico (`public/sw.js`, registrado por `components/pwa/sw-register.tsx`) que cacheia o
shell estático (`/_next/static/*`) e faz network-first com fallback de cache para navegação —
mutações (server actions, sempre POST) nunca são interceptadas, então os dados continuam sempre
atualizados quando há conexão.

## Deploy na Vercel

O datasource do Prisma troca entre **SQLite** (local) e **Postgres** (produção) automaticamente
com base no prefixo de `DATABASE_URL` — não é preciso editar código:

- `prisma/schema.prisma` + `prisma/migrations/` → usado quando `DATABASE_URL` é `file:...` (local).
- `prisma/schema.postgresql.prisma` + `prisma/migrations-postgresql/` → usado quando
  `DATABASE_URL` começa com `postgres://`/`postgresql://`. `prisma.config.ts` faz essa seleção.

Passo a passo:

1. Crie um banco Postgres (ex.: [Neon](https://neon.tech), integração nativa com a Vercel).
2. No projeto da Vercel, configure a variável de ambiente `DATABASE_URL` com a connection string do
   Postgres (inclua `?sslmode=require` se necessário).
3. O script `postinstall` (`prisma generate`) e o `vercel-build`
   (`prisma migrate deploy && next build`) já estão configurados em `package.json` — a Vercel os
   executa automaticamente, aplicando as migrations Postgres no banco antes do build.
4. (Opcional) Para popular o banco de produção com os dados de exemplo, rode localmente
   `DATABASE_URL="<sua-url-postgres>" npm run db:seed` uma única vez.
5. Faça o deploy normalmente (`vercel` ou via integração com o Git).

Se um dia precisar alterar o schema, edite **os dois arquivos** (`schema.prisma` e
`schema.postgresql.prisma` — devem ficar idênticos exceto o `datasource`), gere a migration SQLite
com `npm run db:migrate` e gere a migration Postgres correspondente com:

```bash
npx prisma migrate diff --from-schema-datasource prisma/schema.postgresql.prisma \
  --to-schema-datamodel prisma/schema.postgresql.prisma --script
```

(ou usando uma DATABASE_URL Postgres real com `prisma migrate dev --schema prisma/schema.postgresql.prisma`),
e adicione o SQL resultante em uma nova pasta dentro de `prisma/migrations-postgresql/`.

## Estrutura do projeto

```
app/                 rotas (App Router): dashboard, calendario, operacoes, metodos, ligas, times,
                     gestao, metas, configuracoes; manifest/ícones PWA (manifest.ts, icon.tsx,
                     apple-icon.tsx, icon-192.png/, icon-512.png/)
components/          componentes de UI organizados por feature + components/ui (shadcn) +
                     components/pwa (registro do service worker)
lib/                 lógica de domínio: cálculos (ROI, yield, drawdown, streaks, exposição,
                     desempenho por fase/minuto), stake fixa, schemas Zod, server actions, stores
                     Zustand, cliente Prisma (SQLite/Postgres) e dados de seed/catálogo
prisma/              schema.prisma (SQLite) + schema.postgresql.prisma (Postgres), migrations/ +
                     migrations-postgresql/, script de seed
public/sw.js         service worker básico
```

## Aviso de risco

Trading esportivo envolve risco real de perda. Esta ferramenta auxilia o controle de risco e a
disciplina, mas não o elimina, e não constitui recomendação de investimento.
