# Where to Watch - Agregador de Filmes e Séries

## 🎬 Sobre o Projeto

Site agregador que mostra notas de filmes/séries de diferentes plataformas (IMDB, Rotten Tomatoes, Metacritic) e onde assistir em streamings brasileiros.

## 🚀 Tecnologias

- **Frontend/Backend**: Next.js 14 (App Router) + TypeScript
- **Estilização**: Tailwind CSS
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **APIs Externas**:
  - TMDb (The Movie Database)
  - OMDb (ratings)
  - Streaming Availability API

## 📋 Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL instalado (local ou remoto)
- Contas nas APIs externas (instruções abaixo)

## 🔧 Configuração Passo a Passo

### 1. Obter API Keys

#### TMDb API (GRATUITA)
1. Acesse: https://www.themoviedb.org/signup
2. Crie uma conta
3. Vá em Settings → API → Create → Developer
4. Preencha o formulário (use "Educational" como propósito)
5. Copie a **API Key (v3 auth)** e o **API Read Access Token (v4 auth)**

#### OMDb API (GRATUITA até 1000 req/dia)
1. Acesse: http://www.omdbapi.com/apikey.aspx
2. Escolha o plano FREE
3. Verifique seu email e ative a key
4. Copie a API key recebida

#### Streaming Availability API
**Opção 1: RapidAPI - Streaming Availability** (Recomendado)
1. Acesse: https://rapidapi.com/movie-of-the-night-movie-of-the-night-default/api/streaming-availability
2. Crie conta no RapidAPI
3. Subscribe no plano gratuito (500 requisições/mês)
4. Copie a `X-RapidAPI-Key`

**Opção 2: Watchmode API**
1. Acesse: https://api.watchmode.com/
2. Request API access
3. Aguarde aprovação por email

### 2. Configurar Banco de Dados PostgreSQL

#### Opção A: PostgreSQL Local
```bash
# Instalar PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Criar banco de dados
sudo -u postgres psql
CREATE DATABASE wheretowatch;
CREATE USER seu_usuario WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE wheretowatch TO seu_usuario;
\q
```

#### Opção B: PostgreSQL na Nuvem (Recomendado para iniciantes)

**Supabase (Gratuito)**
1. Acesse: https://supabase.com
2. Crie um projeto
3. Vá em Settings → Database
4. Copie a **Connection String** (modo "URI")

**Neon (Gratuito)**
1. Acesse: https://neon.tech
2. Crie um projeto
3. Copie a connection string

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
# Database (exemplo Supabase)
DATABASE_URL="postgresql://postgres:[SUA_SENHA]@db.[SEU_PROJETO].supabase.co:5432/postgres"

# TMDb API
TMDB_API_KEY="sua_api_key_aqui"
TMDB_ACCESS_TOKEN="seu_access_token_aqui"

# OMDb API
OMDB_API_KEY="sua_omdb_key_aqui"

# Streaming API (RapidAPI)
RAPIDAPI_KEY="sua_rapidapi_key_aqui"
```

### 4. Instalar Dependências e Configurar Banco

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npm run db:generate

# Aplicar schema no banco de dados
npm run db:push

# (Opcional) Abrir Prisma Studio para ver o banco
npm run db:studio
```

### 5. Rodar o Projeto

```bash
# Modo desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

## 📁 Estrutura do Projeto

```
whereToWatch/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── search/        # Endpoint de busca
│   │   └── movie/         # Endpoints de filmes
│   ├── components/        # Componentes React
│   ├── lib/              # Utilidades e serviços
│   ├── globals.css       # Estilos globais
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Página inicial
├── prisma/
│   └── schema.prisma     # Schema do banco de dados
├── .env                  # Variáveis de ambiente (criar)
├── .env.example          # Exemplo de variáveis
└── package.json
```

## 🗃️ Schema do Banco de Dados

### Tabela: movies
- Informações principais dos filmes/séries
- IDs do TMDb e IMDB
- Títulos em inglês e português
- Metadados (poster, sinopse, data de lançamento)

### Tabela: ratings
- Histórico de avaliações
- IMDB, Rotten Tomatoes, Metacritic, Google
- Timestamp de quando foi registrado

### Tabela: streaming_availability
- Onde está disponível atualmente
- Histórico de mudanças de plataforma
- Tipo de disponibilidade (assinatura, aluguel, compra)

## 🔄 Fluxo de Dados

1. **Usuário busca filme** → Frontend chama `/api/search`
2. **API busca no TMDb** → Retorna dados básicos do filme
3. **API busca no OMDb** → Retorna ratings (IMDB, RT, Metacritic)
4. **API busca Streaming** → Retorna onde assistir
5. **API agrega dados** → Salva no banco PostgreSQL
6. **Frontend exibe** → Mostra todas as informações ao usuário

## 📝 Próximos Passos de Implementação

- [x] Setup do projeto Next.js
- [x] Configuração do Prisma
- [x] Schema do banco de dados
- [ ] Implementar serviços de integração com APIs
- [ ] Criar API Routes
- [ ] Desenvolver componentes do frontend
- [ ] Deploy no Vercel

## 🚢 Deploy

O projeto está configurado para deploy no Vercel:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Não esqueça de configurar as variáveis de ambiente no painel do Vercel!

## 💡 Dicas

1. **Limite de APIs**: Use cache para não estourar limites gratuitos
2. **Banco de dados**: Comece com Supabase (gratuito e fácil)
3. **Desenvolvimento**: Use `npm run db:studio` para visualizar dados
4. **Produção**: Configure CONNECTION_POOLING no Vercel

## 🤝 Contribuindo

Este é um projeto educacional. Sinta-se livre para fazer fork e melhorias!

## 📄 Licença

MIT
