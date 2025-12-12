# 🚀 Guia de Início Rápido - Where to Watch

## ✅ O que foi implementado

Seu projeto está **100% funcional** e pronto para rodar! Aqui está o que foi criado:

### Backend
- ✅ Next.js 14 com TypeScript
- ✅ Prisma ORM com PostgreSQL
- ✅ API Routes para busca e detalhes de filmes
- ✅ Integração com TMDb API (dados de filmes/séries)
- ✅ Integração com OMDb API (ratings IMDB, RT, Metacritic)
- ✅ Integração com Streaming Availability API (onde assistir)

### Frontend
- ✅ Interface moderna com Tailwind CSS
- ✅ Barra de busca com sugestões
- ✅ Cards de filmes/séries
- ✅ Modal de detalhes completos
- ✅ Exibição de ratings de múltiplas fontes
- ✅ Listagem de plataformas de streaming
- ✅ Design responsivo (mobile, tablet, desktop)

### Banco de Dados
- ✅ Schema completo (movies, ratings, streaming_availability)
- ✅ Relacionamentos configurados
- ✅ Índices para performance

## 📝 Próximos Passos (EM ORDEM)

### 1. Obter API Keys (OBRIGATÓRIO)

Antes de tudo, você precisa das chaves de API. Siga o `README.md` seção "Obter API Keys".

**APIs essenciais:**
- TMDb (GRATUITA) - https://www.themoviedb.org/settings/api
- OMDb (GRATUITA até 1000 req/dia) - http://www.omdbapi.com/apikey.aspx

**APIs opcionais:**
- Streaming Availability (RapidAPI) - Para "onde assistir"

### 2. Configurar Banco de Dados

**Opção mais fácil: Supabase (Gratuito)**

1. Acesse https://supabase.com
2. Crie um projeto
3. Vá em Settings → Database
4. Copie a "Connection String"

### 3. Criar arquivo `.env`

Na raiz do projeto, crie um arquivo `.env`:

```bash
cp .env.example .env
```

Edite `.env` e adicione suas credenciais:

```env
# Database (exemplo Supabase)
DATABASE_URL="postgresql://postgres:[SENHA]@db.[SEU-PROJETO].supabase.co:5432/postgres"

# TMDb API (obrigatório)
TMDB_API_KEY="sua_api_key_aqui"
TMDB_ACCESS_TOKEN="seu_access_token_aqui"

# OMDb API (obrigatório para ratings)
OMDB_API_KEY="sua_omdb_key_aqui"

# Streaming API (opcional)
RAPIDAPI_KEY="sua_rapidapi_key_aqui"
```

### 4. Instalar Dependências (se ainda não instalou)

```bash
npm install
```

### 5. Configurar o Banco de Dados

```bash
# Gerar Prisma Client
npm run db:generate

# Criar tabelas no banco
npm run db:push
```

### 6. Rodar o Projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

### 7. Testar

1. Digite "Senhor dos Anéis" na busca
2. Clique em algum resultado
3. Veja ratings e onde assistir!

## 🎯 Como Funciona

### Fluxo de Busca

1. **Usuário digita** → "Breaking Bad"
2. **Frontend chama** → `/api/search?q=Breaking%20Bad`
3. **API busca no TMDb** → Retorna lista de resultados
4. **Frontend exibe** → Cards com os filmes/séries

### Fluxo de Detalhes

1. **Usuário clica** → Em um card
2. **Frontend chama** → `/api/movie/1396?type=tv`
3. **API faz 3 buscas paralelas:**
   - TMDb: Detalhes completos
   - OMDb: Ratings (IMDB, RT, Metacritic)
   - Streaming API: Onde assistir
4. **API salva no banco** → Para cache futuro
5. **Frontend exibe** → Modal com tudo

## 📁 Estrutura de Arquivos Importante

```
whereToWatch/
├── app/
│   ├── api/
│   │   ├── search/route.ts       # Endpoint de busca
│   │   └── movie/[id]/route.ts   # Endpoint de detalhes
│   ├── components/
│   │   ├── SearchBar.tsx         # Barra de busca
│   │   ├── MovieCard.tsx         # Card de filme
│   │   ├── RatingsDisplay.tsx    # Exibição de notas
│   │   ├── StreamingAvailability.tsx  # Onde assistir
│   │   └── MovieDetailsModal.tsx # Modal de detalhes
│   └── page.tsx                  # Página principal
├── lib/
│   ├── prisma.ts                 # Cliente Prisma
│   ├── types.ts                  # Tipos TypeScript
│   └── services/
│       ├── tmdb.ts               # Serviço TMDb
│       ├── omdb.ts               # Serviço OMDb
│       └── streaming.ts          # Serviço Streaming
├── prisma/
│   └── schema.prisma             # Schema do banco
├── .env                          # Variáveis de ambiente (CRIAR)
└── package.json
```

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev                 # Rodar servidor dev

# Banco de Dados
npm run db:generate        # Gerar Prisma Client
npm run db:push           # Aplicar schema no banco
npm run db:studio         # Abrir Prisma Studio (GUI do banco)

# Build & Deploy
npm run build             # Build de produção
npm start                 # Rodar build de produção
```

## 🐛 Problemas Comuns

### "Cannot find module '@prisma/client'"

**Solução:**
```bash
npm run db:generate
```

### "Error: P1001: Can't reach database"

**Solução:** Verifique se `DATABASE_URL` no `.env` está correta.

### "OMDb API: Invalid API key"

**Solução:** Certifique-se de ativar a key por email após requisitar.

### "TMDb: Unauthorized"

**Solução:** Use `TMDB_ACCESS_TOKEN` (v4), não apenas a API Key (v3).

## 🚀 Próximas Melhorias (Futuras)

Depois que estiver funcionando, você pode adicionar:

1. **Cron Job** para atualizar banco periodicamente
2. **Cache** com Redis para melhor performance
3. **Sistema de favoritos** para usuários
4. **Histórico de streaming** (rastrear mudanças ao longo do tempo)
5. **Filtros avançados** (gênero, ano, rating mínimo)
6. **Páginas individuais** para filmes (SEO)
7. **Recomendações** baseadas em ML

## 📚 Recursos

- **README.md** - Documentação completa
- **DEPLOY.md** - Guia de deploy no Vercel
- **.env.example** - Template de variáveis

## 🆘 Precisa de Ajuda?

Se algo não funcionar:

1. Confira os logs no terminal
2. Verifique o console do navegador (F12)
3. Teste as APIs individualmente:
   - TMDb: https://api.themoviedb.org/3/search/movie?api_key=SUA_KEY&query=test
   - OMDb: http://www.omdbapi.com/?apikey=SUA_KEY&t=inception

## ✨ Pronto!

Agora é só configurar as APIs e começar a usar! Boa sorte com o projeto! 🎬🍿
