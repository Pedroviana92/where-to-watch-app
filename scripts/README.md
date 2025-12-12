# 🎬 Script de Seed - Popular Banco de Dados

Este script popula automaticamente o banco de dados com filmes e séries populares do TMDb, incluindo ratings completos (IMDB, Rotten Tomatoes, Metacritic) e informações de streaming.

## 📋 O que o script faz?

1. Busca os filmes/séries mais populares no TMDb
2. Para cada item:
   - Busca detalhes completos (título, sinopse, poster, etc)
   - Busca IMDB ID
   - Busca ratings da nova API (Movie Database Alternative via RapidAPI)
   - Busca plataformas de streaming disponíveis no Brasil
   - Salva tudo no banco de dados PostgreSQL
3. Mostra progresso em tempo real com cores e estatísticas
4. Pula itens que já existem no banco (não duplica)
5. Implementa rate limiting (1 segundo entre requisições) para evitar bloqueios

## 🚀 Como usar

### Uso básico (padrão: 100 filmes + 100 séries)

```bash
npm run seed
```

### Uso personalizado

```bash
# Buscar 50 filmes e 30 séries
npm run seed:custom -- --movies=50 --tv=30

# Buscar 200 filmes e 150 séries
npm run seed:custom -- --movies=200 --tv=150

# Apenas filmes (100)
npm run seed:custom -- --movies=100 --tv=0

# Apenas séries (80)
npm run seed:custom -- --movies=0 --tv=80
```

**Nota:** O script busca automaticamente múltiplas páginas da API do TMDb para atingir a quantidade desejada (cada página tem 20 resultados).

## ⏱️ Tempo de execução

- **100 filmes + 100 séries (padrão):** ~3-4 horas
  - Cada item leva aproximadamente 1-2 minutos (múltiplas APIs + rate limiting)

- **50 filmes + 30 séries:** ~1.5-2 horas

- **200 filmes + 150 séries:** ~6-8 horas

**Dica:** Execute em background ou use `screen`/`tmux` para sessões longas.

```bash
# Executar em background (exemplo)
nohup npm run seed > seed.log 2>&1 &

# Ver o progresso
tail -f seed.log
```

## 📊 Exemplo de saída

```
╔════════════════════════════════════════════════════════╗
║  🎬 SEED - POPULAR O BANCO COM FILMES/SÉRIES POPULARES ║
╚════════════════════════════════════════════════════════╝

📊 Configuração:
   Filmes: 100
   Séries: 100
   Delay entre requisições: 1000ms

============================================================
🎬 PROCESSANDO FILMES POPULARES
============================================================

📡 Buscando lista de filmes populares no TMDb...
  📄 Buscando 5 página(s) para obter 100 filmes...
✅ 100 filmes encontrados

[1/100] 🎬 Processando filme ID 945961...
  📡 Buscando detalhes no TMDb...
  🔗 Buscando IMDB ID...
  ⭐ Buscando ratings (IMDB: tt10872600)...
  📺 Buscando plataformas de streaming...
  💾 Salvando no banco de dados...
  ✅ Alien: Romulus salvo com sucesso!
     Ratings: IMDB=7.3, RT=80, MC=N/A
     Streaming: 2 plataforma(s)

[2/20] 🎬 Processando filme ID 533535...
  ⏭️  Já existe no banco, pulando...

...

============================================================
📊 RESUMO FINAL
============================================================

🎬 FILMES:
   Total processado: 100
   ✅ Salvos: 95
   ⏭️  Pulados (já existiam): 5
   ❌ Falhas: 0

📺 SÉRIES:
   Total processado: 100
   ✅ Salvos: 98
   ⏭️  Pulados (já existiam): 2
   ❌ Falhas: 0

🎉 Concluído! 193 itens adicionados ao banco de dados.
```

## ⚙️ Configurações

Você pode editar estas constantes no arquivo `seed-popular.ts`:

```typescript
const DEFAULT_MOVIES_COUNT = 100;       // Quantidade padrão de filmes
const DEFAULT_TV_COUNT = 100;           // Quantidade padrão de séries
const DELAY_BETWEEN_REQUESTS = 1000;   // Delay em ms (1000 = 1 segundo)
const RESULTS_PER_PAGE = 20;           // Resultados por página do TMDb (fixo)
```

**Suporte para múltiplas páginas:** O script busca automaticamente quantas páginas forem necessárias. Por exemplo:
- 100 filmes → Busca 5 páginas (5 × 20 = 100 resultados)
- 250 séries → Busca 13 páginas (13 × 20 = 260 resultados, usa os primeiros 250)

## ⚠️ Importante

### Limites de API

- **TMDb:** Gratuito, sem limite definido (mas respeite a taxa)
- **RapidAPI (Ratings):** Depende do seu plano
  - 20 filmes + 20 séries = ~40 requisições (mais se alguns não tiverem IMDB ID)

### Rate Limiting

O script tem um delay de **1 segundo** entre cada item para evitar bloqueios. Se você estourar limites, aumente o `DELAY_BETWEEN_REQUESTS`.

### Erros

- Se um item falhar, o script continua com os próximos
- Erros são exibidos em vermelho com detalhes
- Ao final, veja o resumo de falhas

## 🔧 Manutenção

### Ver o que está no banco

```bash
npm run db:studio
```

Isso abre o Prisma Studio no navegador para visualizar os dados.

### Limpar o banco antes de rodar

Se quiser começar do zero:

```bash
npx prisma db push --force-reset
npm run seed
```

## 💡 Dicas

1. **Execute periodicamente** (ex: 1x por semana) para manter o banco atualizado com novos lançamentos

2. **Use cron job** para automatizar:
   ```bash
   # Adicionar ao crontab (todo domingo às 2h)
   0 2 * * 0 cd /caminho/do/projeto && npm run seed
   ```

3. **Comece pequeno** para testar (ex: 5 filmes + 5 séries)

4. **Monitore os logs** para identificar problemas de API

5. **Backup do banco** antes de executar em produção

## 🐛 Troubleshooting

### "Cannot find module '@prisma/client'"
```bash
npm run db:generate
```

### "Rate limit exceeded"
- Aumente `DELAY_BETWEEN_REQUESTS` para 2000 ou 3000ms
- Reduza a quantidade de itens processados

### "Database connection error"
- Verifique se `DATABASE_URL` está correto no `.env`
- Teste a conexão com `npm run db:studio`

### "RapidAPI key invalid"
- Verifique se `RAPIDAPI_KEY` está correto no `.env`
- Confirme que sua assinatura está ativa

## 📈 Roadmap

Melhorias futuras:

- [ ] Adicionar modo "incremental" (apenas novos lançamentos)
- [ ] Suporte para múltiplas páginas do TMDb
- [ ] Retry automático em caso de falha
- [ ] Export de relatório em JSON/CSV
- [ ] Webhook/notificação ao concluir
