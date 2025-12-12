# Guia de Deploy no Vercel

## 📦 Pré-requisitos

Antes de fazer o deploy, certifique-se de ter:

1. ✅ Conta no GitHub
2. ✅ Conta no Vercel (pode criar em https://vercel.com usando sua conta GitHub)
3. ✅ Banco de dados PostgreSQL configurado (recomendado: Supabase ou Neon)
4. ✅ API Keys obtidas:
   - TMDb API Key + Access Token (https://www.themoviedb.org/settings/api)
   - RapidAPI Key (https://rapidapi.com) - Usada para:
     - Movie Database Alternative (ratings: IMDB, Rotten Tomatoes, Metacritic)
     - Streaming Availability (onde assistir - opcional)

## 🚀 Passo a Passo para Deploy

### 1. Preparar o Repositório Git

```bash
# Inicializar git (se ainda não estiver inicializado)
git init

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "Initial commit: Where to Watch project"

# Criar repositório no GitHub e adicionar remote
git remote add origin https://github.com/seu-usuario/where-to-watch.git

# Push para o GitHub
git branch -M main
git push -u origin main
```

### 2. Conectar ao Vercel

#### Opção A: Via Dashboard (Recomendado)

1. Acesse https://vercel.com/dashboard
2. Clique em "Add New Project"
3. Selecione "Import Git Repository"
4. Escolha o repositório `where-to-watch`
5. Clique em "Import"

#### Opção B: Via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login no Vercel
vercel login

# Deploy
vercel
```

### 3. Configurar Variáveis de Ambiente no Vercel

**IMPORTANTE**: Durante a importação do projeto, você precisará adicionar as variáveis de ambiente.

No painel do Vercel:

1. Vá em **Settings** → **Environment Variables**
2. Adicione as seguintes variáveis:

```env
# Database (exemplo Supabase com connection pooling)
DATABASE_URL=postgresql://postgres:[SENHA]@db.[PROJETO].supabase.co:6543/postgres?pgbouncer=true

# TMDb API (https://www.themoviedb.org/settings/api)
TMDB_API_KEY=sua_tmdb_api_key
TMDB_ACCESS_TOKEN=seu_tmdb_access_token

# RapidAPI (https://rapidapi.com)
# Usado para Movie Database Alternative (ratings) e Streaming Availability
RAPIDAPI_KEY=sua_rapidapi_key
```

**Dica**: Marque todas as variáveis para os ambientes: `Production`, `Preview`, e `Development`

### 4. Configurar Prisma no Vercel

O Vercel precisa gerar o Prisma Client durante o build. Adicione ao `package.json` se ainda não tiver:

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

Esta linha já está incluída no projeto como `db:generate`, mas o Vercel rodará automaticamente o `postinstall`.

### 5. Fazer Deploy

Após configurar tudo:

1. Clique em **Deploy**
2. Aguarde o build (leva 2-5 minutos)
3. Acesse a URL gerada: `https://seu-projeto.vercel.app`

### 6. Aplicar Schema no Banco de Dados

**IMPORTANTE**: Antes de usar a aplicação, você precisa criar as tabelas no banco de dados.

#### Opção A: Localmente com DATABASE_URL de produção

```bash
# Usar a DATABASE_URL de produção
DATABASE_URL="sua_connection_string_producao" npx prisma db push
```

#### Opção B: Via Vercel CLI

```bash
# Pull das variáveis de ambiente
vercel env pull .env.production

# Rodar migration
DATABASE_URL="$(grep DATABASE_URL .env.production | cut -d '=' -f2-)" npx prisma db push
```

### 7. (Opcional) Popular Banco com Conteúdo

Depois que as tabelas forem criadas, você pode popular o banco com filmes/séries populares:

```bash
# Usar DATABASE_URL de produção
DATABASE_URL="sua_connection_string_producao" npm run seed

# Ou quantidade customizada
DATABASE_URL="sua_connection_string_producao" npm run seed:custom -- --movies=50 --tv=50
```

**Nota**: Isso vai levar tempo (1-4 horas dependendo da quantidade). Execute localmente, não no Vercel.

### 8. Verificar Deployment

Acesse sua URL do Vercel e teste:

1. ✅ Página inicial carrega
2. ✅ Busca funciona (tente "Senhor dos Anéis")
3. ✅ Detalhes do filme aparecem
4. ✅ Ratings são exibidos
5. ✅ Streaming availability funciona (se configurou a API)

## 🔧 Configurações Avançadas

### Connection Pooling (Importante para PostgreSQL)

Para evitar problemas de conexão com o banco, use Prisma Data Proxy ou configure connection pooling:

#### Opção 1: Supabase Connection Pooling

```env
# Use a connection pooling URL do Supabase
# No painel Supabase: Settings → Database → Connection Pooling
DATABASE_URL=postgresql://postgres.[HASH]:[SENHA]@[POOL-HOST]:6543/postgres?pgbouncer=true
```

#### Opção 2: Prisma Accelerate

```bash
# Habilitar Prisma Accelerate
npx prisma generate --accelerate
```

### Custom Domain

No painel do Vercel:

1. Vá em **Settings** → **Domains**
2. Adicione seu domínio customizado
3. Configure os DNS conforme instruções

### Analytics

O Vercel oferece analytics gratuito:

1. Vá em **Analytics** no dashboard
2. Ative Vercel Analytics
3. Adicione ao seu `app/layout.tsx`:

```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## 🐛 Troubleshooting

### Erro: "Cannot connect to database"

**Solução**: Verifique se a `DATABASE_URL` está correta e se o IP do Vercel tem acesso ao banco.

Para Supabase: O Vercel já tem acesso por padrão.

### Erro: "Prisma Client not generated"

**Solução**: Adicione `postinstall` script no `package.json`:

```json
"postinstall": "prisma generate"
```

### Erro: "Too many connections"

**Solução**: Use connection pooling (veja seção acima).

### Build falha no Vercel

**Solução**: Verifique os logs de build:
1. Vá em **Deployments** → selecione o deployment falhado
2. Clique em **Building** para ver os logs
3. Corrija o erro e faça push novamente

## 📊 Monitoramento

### Logs em Tempo Real

```bash
# Via Vercel CLI
vercel logs

# Logs de uma função específica
vercel logs api/search
```

### Performance

No dashboard do Vercel, você pode ver:
- Tempo de build
- Tempo de resposta das APIs
- Uso de banda
- Requests por dia

## 🔄 Atualizações Contínuas

Depois do primeiro deploy, qualquer push para o branch `main` no GitHub irá:

1. Automaticamente criar um novo deployment
2. Rodar os testes (se configurados)
3. Fazer deploy para produção
4. Gerar uma URL de preview para cada PR

## 💡 Dicas Finais

1. **Use Preview Deployments**: Cada PR cria uma URL de preview
2. **Configure Webhooks**: Para notificações de deploy
3. **Enable HTTPS**: Automático no Vercel
4. **Optimize Images**: Next.js otimiza automaticamente via CDN do Vercel
5. **Cache Strategy**: Configure headers de cache nas API routes se necessário

## 🆘 Suporte

Se tiver problemas:

1. Documentação Vercel: https://vercel.com/docs
2. Documentação Next.js: https://nextjs.org/docs
3. Documentação Prisma: https://www.prisma.io/docs
4. Discord Vercel: https://vercel.com/discord

## ✅ Checklist de Deploy

Antes de considerar o deploy completo, verifique:

- [ ] Projeto buildando localmente sem erros
- [ ] Todas as variáveis de ambiente configuradas no Vercel
- [ ] Banco de dados acessível
- [ ] Schema do Prisma aplicado no banco
- [ ] Testes básicos funcionando na URL de produção
- [ ] APIs externas (TMDb, OMDb) respondendo
- [ ] Imagens carregando corretamente
- [ ] Performance aceitável (Core Web Vitals)
- [ ] SEO básico configurado (title, description)

Parabéns! Seu projeto está no ar! 🎉
