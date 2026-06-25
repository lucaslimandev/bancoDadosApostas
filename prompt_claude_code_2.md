# Prompt 2 para Claude Code — Alterações e novos recursos

> Cole tudo abaixo (a partir de "## Contexto") como uma nova mensagem no Claude Code, **dentro da mesma pasta do projeto que já criamos**. Estas são alterações incrementais sobre o app de gestão de trading esportivo que já está funcionando.

---

## Contexto

O app de gestão de trading esportivo (Next.js + TypeScript + Tailwind + shadcn/ui + Zustand + Prisma/SQLite + Recharts) já está criado e funcionando. Agora preciso que você **adicione os recursos abaixo** mantendo a mesma stack, o mesmo padrão de código, o mesmo design e a mesma organização por feature. Trabalhe de forma autônoma: atualize o schema do Prisma, gere as migrations, crie as telas e componentes, rode, teste e corrija até tudo funcionar. Faça commits incrementais e atualize o README no fim.

## 1. Cadastro de Métodos (gerenciável pelo usuário)

- Criar entidade **Metodo** no Prisma: id, nome (único), descricao (string?), cor (string — hex, para identificar nos gráficos e na tabela), ativo (boolean, default true), createdAt, updatedAt.
- Nova tela **"Métodos"** na sidebar com CRUD completo: criar, editar, ativar/desativar e excluir (com confirmação). Ao excluir um método em uso, avisar quantas operações o utilizam e oferecer reatribuir para outro método ou bloquear a exclusão — não deixar operações órfãs.
- No **formulário de operação**, o campo "Método" deve passar a ser um **select alimentado pela tabela Metodo** (apenas os ativos), com opção de "criar novo método" inline sem sair da tela.
- Os gráficos de "lucro por método" devem usar a **cor** cadastrada de cada método.
- **Filtro por método** em todas as telas relevantes (Dashboard, Operações, Calendário): permitir selecionar um ou vários métodos e recalcular KPIs e gráficos.
- Fazer **seed** dos métodos que já existiam (Pressão Reversa, Scalping Ao Vivo, Lay Empate, Cash Out Verde) com cores distintas.

## 2. Cadastro de Ligas (com importação e seed das principais)

- Criar entidade **Liga** no Prisma: id, nome (único), pais (string), tipo (enum opcional: Liga | Copa | Continental | Seleções), nivel (string? — ex.: "Série A", "Série B"), ativo (boolean), createdAt, updatedAt.
- Nova tela **"Ligas"** na sidebar com CRUD completo (criar, editar, ativar/desativar, excluir com a mesma proteção contra órfãs descrita acima).
- **Importação de ligas**: botão para importar via **CSV/JSON** (colunas: nome, pais, tipo, nivel) com validação Zod e relatório de quantas foram importadas / ignoradas (duplicadas).
- **Seed inicial com as 20 principais ligas do mundo, incluindo divisões A e B onde fizer sentido**, mais as principais copas e competições de seleções. Use ao menos:

  1. Brasileirão Série A — Brasil
  2. Brasileirão Série B — Brasil
  3. Premier League — Inglaterra
  4. Championship (2ª divisão) — Inglaterra
  5. La Liga — Espanha
  6. La Liga 2 (Segunda División) — Espanha
  7. Serie A — Itália
  8. Serie B — Itália
  9. Bundesliga — Alemanha
  10. 2. Bundesliga — Alemanha
  11. Ligue 1 — França
  12. Ligue 2 — França
  13. Primeira Liga — Portugal
  14. Eredivisie — Holanda
  15. Liga Profesional (Primera) — Argentina
  16. Liga MX — México
  17. MLS — Estados Unidos
  18. Saudi Pro League — Arábia Saudita
  19. Süper Lig — Turquia
  20. Scottish Premiership — Escócia

  E também competições (tipo Copa/Continental/Seleções):
  - Champions League, Europa League, Conference League (Continental — Europa)
  - Copa Libertadores, Copa Sudamericana (Continental — América do Sul)
  - Copa do Brasil, Copa do Rei (Copa nacional)
  - **Copa do Mundo FIFA**, Eurocopa, Copa América, Liga das Nações UEFA (Seleções)

- No **formulário de operação**, o campo "Liga" passa a ser um **select alimentado pela tabela Liga** (apenas ativas), agrupado por tipo (Ligas / Copas / Continentais / Seleções) e com busca, e com opção de "criar nova liga" inline.
- **Filtro por liga** (um ou vários) em Dashboard, Operações e Calendário.

## 3. Cadastro de Times (com importação)

- Criar entidade **Time** no Prisma: id, nome (string), pais (string?), ligaId (relação opcional com Liga), abreviacao (string?), ativo (boolean), createdAt, updatedAt. Permitir o mesmo nome em ligas diferentes.
- Nova tela **"Times"** na sidebar com CRUD completo, busca, filtro por liga e a mesma proteção contra exclusão de times em uso.
- **Importação de times** via **CSV/JSON** (colunas: nome, pais, liga, abreviacao) com validação, vínculo automático à liga pelo nome (criar a liga se não existir, ou avisar), e relatório de importados/ignorados.
- Fazer **seed** com alguns times reais das principais ligas para já nascer útil (ex.: alguns clubes de Brasileirão A, Premier League, La Liga, Serie A, Bundesliga, Ligue 1) — não precisa ser exaustivo, uns 6 a 8 por liga das maiores.
- No **formulário de operação**, os campos "Time Casa" e "Time Fora" passam a ser **selects com busca alimentados pela tabela Time**, idealmente filtrando os times pela liga escolhida (mas permitindo busca livre e criação inline de um novo time).

## 4. Exclusão em massa de operações

- Na tabela de **Operações**, adicionar uma **coluna de checkbox** por linha, mais um checkbox no cabeçalho para "selecionar todos" (respeitando os filtros ativos).
- Quando houver itens selecionados, exibir uma **barra de ações em massa** mostrando "X operações selecionadas" com botão **Excluir selecionadas** (modal de confirmação informando a quantidade) e, se possível, também **exportar selecionadas** (CSV/JSON).
- A exclusão em massa deve recalcular automaticamente todos os KPIs, gráficos e o calendário.
- Garantir performance: usar uma única operação de banco (deleteMany) e feedback de loading.

## 5. Ajustes gerais

- Atualizar os **filtros globais do Dashboard e do Calendário** para incluir os novos filtros (método, liga, tipo, time) de forma combinável.
- Garantir que **importar/exportar de operações** continue funcionando e passe a usar os nomes de liga/método/time corretamente vinculados.
- Atualizar o **seed geral** para que operações de exemplo referenciem as novas tabelas de Liga, Time e Método por relação (não por texto solto).
- Migrar dados existentes com cuidado: se já houver operações com liga/método em texto, crie as entradas correspondentes nas novas tabelas e vincule, sem perder histórico.
- Manter o design, o tema claro/escuro, a responsividade e as animações já existentes. Adicionar os novos itens na sidebar de navegação com ícones adequados (Métodos, Ligas, Times).

## Qualidade e entrega

- Sem erros de build ou lint: rode `npm run build` e corrija.
- Atualize o **README** com as novas entidades, as instruções de import (formato dos CSV/JSON) e como rodar as novas migrations/seed do Prisma.
- Ao final, rode o app, confirme que tudo funciona (cadastros, filtros, importações, exclusão em massa, calendário) e me diga a URL local.
- Se algo for ambíguo, tome a decisão mais profissional e siga — não pare para perguntar a cada passo.

Comece atualizando o schema do Prisma e o plano de migration, depois implemente tela por tela.
