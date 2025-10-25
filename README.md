# Servicos App (MVP)
PWA para contratação de serviços locais (eletricista, mecânico, encanador, autorizadas).
Stack: Next.js 15 (App Router) + React 19 + TS + Tailwind + Prisma + Neon + next-pwa.

## 🔐 Sessão & ENV (Next 15 + Vercel)

- Variáveis obrigatórias:
  - `DATABASE_URL` (Neon)
  - `AUTH_SECRET` (segredo para assinar o cookie HttpOnly da sessão)

### Onde configurar
- **Local**: `.env.local` (não versionado)
- **Vercel**: Project → Settings → Environment Variables  
  Adicionar `AUTH_SECRET` (All Environments ou separadamente para Production/Preview) **com o mesmo valor** usado localmente.

### Rotacionar AUTH_SECRET (passos)
1. Gerar um novo segredo:
   ```sh
   openssl rand -base64 48
Atualizar .env.local com o novo valor (sem aspas).

Definir o mesmo valor no Vercel (Production + Preview).

Redeploy.

Observação: rotacionar o segredo invalida sessões existentes (os usuários precisam logar novamente).
