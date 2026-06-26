// Integrações de Postgres na Vercel (Neon, Vercel Postgres etc.) nem sempre usam o nome
// "DATABASE_URL" — variam entre POSTGRES_URL, POSTGRES_PRISMA_URL, etc. Verificamos todos os
// nomes comuns para não depender de o usuário renomear a variável manualmente no dashboard.
const ENV_CANDIDATES = [
  "DATABASE_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL",
  "POSTGRES_URL_NON_POOLING",
  "DATABASE_URL_UNPOOLED",
] as const;

export function resolveDatabaseUrl(): string {
  for (const nome of ENV_CANDIDATES) {
    const valor = process.env[nome];
    if (valor) return valor;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "Nenhuma variável de banco de dados encontrada (tentei: " +
        ENV_CANDIDATES.join(", ") +
        "). Configure DATABASE_URL nas Environment Variables do projeto na Vercel com a connection string do Postgres."
    );
  }

  return "file:./dev.db";
}
