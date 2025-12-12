/**
 * Script para popular o banco de dados com filmes e séries populares
 *
 * Uso:
 *   npm run seed              # Busca 20 filmes + 20 séries (padrão)
 *   npm run seed -- --movies=50 --tv=30  # Personalizado
 */

import { prisma } from '../lib/prisma';
import {
  getPopularMovies,
  getPopularTVShows,
  getMovieDetails,
  getTVShowDetails,
  getMovieExternalIds,
  getTVShowExternalIds,
} from '../lib/services/tmdb';
import { getRatings } from '../lib/services/omdb';
import { getStreamingFromTMDb } from '../lib/services/streaming';

// Configurações
const DEFAULT_MOVIES_COUNT = 100;
const DEFAULT_TV_COUNT = 100;
const DELAY_BETWEEN_REQUESTS = 1000; // 1 segundo entre requisições (evitar rate limit)
const RESULTS_PER_PAGE = 20; // TMDb retorna 20 resultados por página

// Cores para logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Busca múltiplas páginas de filmes populares até atingir a quantidade desejada
 */
async function fetchPopularMovies(count: number) {
  const pagesNeeded = Math.ceil(count / RESULTS_PER_PAGE);
  log(`  📄 Buscando ${pagesNeeded} página(s) para obter ${count} filmes...`, 'blue');

  const allMovies = [];

  for (let page = 1; page <= pagesNeeded; page++) {
    const movies = await getPopularMovies(page);
    allMovies.push(...movies);

    if (page < pagesNeeded) {
      await delay(300); // Pequeno delay entre páginas
    }
  }

  return allMovies.slice(0, count);
}

/**
 * Busca múltiplas páginas de séries populares até atingir a quantidade desejada
 */
async function fetchPopularTVShows(count: number) {
  const pagesNeeded = Math.ceil(count / RESULTS_PER_PAGE);
  log(`  📄 Buscando ${pagesNeeded} página(s) para obter ${count} séries...`, 'blue');

  const allShows = [];

  for (let page = 1; page <= pagesNeeded; page++) {
    const shows = await getPopularTVShows(page);
    allShows.push(...shows);

    if (page < pagesNeeded) {
      await delay(300); // Pequeno delay entre páginas
    }
  }

  return allShows.slice(0, count);
}

async function seedMovie(tmdbId: number, index: number, total: number) {
  try {
    log(`\n[${index}/${total}] 🎬 Processando filme ID ${tmdbId}...`, 'cyan');

    // Verificar se já existe
    const existing = await prisma.movie.findUnique({ where: { tmdbId } });
    if (existing) {
      log(`  ⏭️  Já existe no banco, pulando...`, 'yellow');
      return { success: true, skipped: true };
    }

    // Buscar detalhes
    log(`  📡 Buscando detalhes no TMDb...`, 'blue');
    const details = await getMovieDetails(tmdbId);

    // Buscar IMDB ID
    log(`  🔗 Buscando IMDB ID...`, 'blue');
    const externalIds = await getMovieExternalIds(tmdbId);
    const imdbId = externalIds.imdb_id;

    // Buscar ratings
    let ratings: { imdb?: number; rottenTomatoes?: number; metacritic?: number } = {};
    if (imdbId) {
      log(`  ⭐ Buscando ratings (IMDB: ${imdbId})...`, 'blue');
      await delay(500); // Delay extra para API de ratings
      ratings = await getRatings(imdbId);
    }

    // Buscar streaming
    log(`  📺 Buscando plataformas de streaming...`, 'blue');
    const streamingServices = await getStreamingFromTMDb(tmdbId, 'movie');

    // Salvar no banco
    log(`  💾 Salvando no banco de dados...`, 'blue');
    await prisma.movie.create({
      data: {
        tmdbId,
        imdbId,
        title: details.title || '',
        titlePt: details.title || '',
        overview: details.overview,
        posterPath: details.poster_path,
        backdropPath: details.backdrop_path,
        releaseDate: details.release_date ? new Date(details.release_date) : null,
        mediaType: 'movie',
        ratings: {
          create: {
            imdbRating: ratings.imdb || null,
            rottenTomatoes: ratings.rottenTomatoes || null,
            metacritic: ratings.metacritic || null,
          },
        },
        streamingAvailability: {
          create: streamingServices.map((service) => ({
            provider: service.service,
            streamingType: service.streamingType,
            link: service.link,
            available: true,
          })),
        },
      },
    });

    log(`  ✅ ${details.title} salvo com sucesso!`, 'green');
    log(`     Ratings: IMDB=${ratings.imdb || 'N/A'}, RT=${ratings.rottenTomatoes || 'N/A'}, MC=${ratings.metacritic || 'N/A'}`, 'green');
    log(`     Streaming: ${streamingServices.length} plataforma(s)`, 'green');

    return { success: true, skipped: false };
  } catch (error: any) {
    log(`  ❌ Erro ao processar filme ${tmdbId}: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function seedTVShow(tmdbId: number, index: number, total: number) {
  try {
    log(`\n[${index}/${total}] 📺 Processando série ID ${tmdbId}...`, 'cyan');

    // Verificar se já existe
    const existing = await prisma.movie.findUnique({ where: { tmdbId } });
    if (existing) {
      log(`  ⏭️  Já existe no banco, pulando...`, 'yellow');
      return { success: true, skipped: true };
    }

    // Buscar detalhes
    log(`  📡 Buscando detalhes no TMDb...`, 'blue');
    const details = await getTVShowDetails(tmdbId);

    // Buscar IMDB ID
    log(`  🔗 Buscando IMDB ID...`, 'blue');
    const externalIds = await getTVShowExternalIds(tmdbId);
    const imdbId = externalIds.imdb_id;

    // Buscar ratings
    let ratings: { imdb?: number; rottenTomatoes?: number; metacritic?: number } = {};
    if (imdbId) {
      log(`  ⭐ Buscando ratings (IMDB: ${imdbId})...`, 'blue');
      await delay(500); // Delay extra para API de ratings
      ratings = await getRatings(imdbId);
    }

    // Buscar streaming
    log(`  📺 Buscando plataformas de streaming...`, 'blue');
    const streamingServices = await getStreamingFromTMDb(tmdbId, 'tv');

    // Salvar no banco
    log(`  💾 Salvando no banco de dados...`, 'blue');
    await prisma.movie.create({
      data: {
        tmdbId,
        imdbId,
        title: details.name || '',
        titlePt: details.name || '',
        overview: details.overview,
        posterPath: details.poster_path,
        backdropPath: details.backdrop_path,
        releaseDate: details.first_air_date ? new Date(details.first_air_date) : null,
        mediaType: 'tv',
        ratings: {
          create: {
            imdbRating: ratings.imdb || null,
            rottenTomatoes: ratings.rottenTomatoes || null,
            metacritic: ratings.metacritic || null,
          },
        },
        streamingAvailability: {
          create: streamingServices.map((service) => ({
            provider: service.service,
            streamingType: service.streamingType,
            link: service.link,
            available: true,
          })),
        },
      },
    });

    log(`  ✅ ${details.name} salvo com sucesso!`, 'green');
    log(`     Ratings: IMDB=${ratings.imdb || 'N/A'}, RT=${ratings.rottenTomatoes || 'N/A'}, MC=${ratings.metacritic || 'N/A'}`, 'green');
    log(`     Streaming: ${streamingServices.length} plataforma(s)`, 'green');

    return { success: true, skipped: false };
  } catch (error: any) {
    log(`  ❌ Erro ao processar série ${tmdbId}: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function main() {
  const args = process.argv.slice(2);
  const moviesCount = parseInt(args.find(arg => arg.startsWith('--movies='))?.split('=')[1] || String(DEFAULT_MOVIES_COUNT));
  const tvCount = parseInt(args.find(arg => arg.startsWith('--tv='))?.split('=')[1] || String(DEFAULT_TV_COUNT));

  log('\n╔════════════════════════════════════════════════════════╗', 'bright');
  log('║  🎬 SEED - POPULAR O BANCO COM FILMES/SÉRIES POPULARES ║', 'bright');
  log('╚════════════════════════════════════════════════════════╝\n', 'bright');

  log(`📊 Configuração:`, 'yellow');
  log(`   Filmes: ${moviesCount}`, 'yellow');
  log(`   Séries: ${tvCount}`, 'yellow');
  log(`   Delay entre requisições: ${DELAY_BETWEEN_REQUESTS}ms\n`, 'yellow');

  const stats = {
    movies: { total: 0, success: 0, skipped: 0, failed: 0 },
    tv: { total: 0, success: 0, skipped: 0, failed: 0 },
  };

  try {
    // ========== FILMES ==========
    log('\n' + '='.repeat(60), 'bright');
    log('🎬 PROCESSANDO FILMES POPULARES', 'bright');
    log('='.repeat(60) + '\n', 'bright');

    log('📡 Buscando lista de filmes populares no TMDb...', 'blue');
    const moviesToProcess = await fetchPopularMovies(moviesCount);

    log(`✅ ${moviesToProcess.length} filmes encontrados\n`, 'green');

    for (let i = 0; i < moviesToProcess.length; i++) {
      const movie = moviesToProcess[i];
      stats.movies.total++;

      const result = await seedMovie(movie.id, i + 1, moviesToProcess.length);

      if (result.success && result.skipped) {
        stats.movies.skipped++;
      } else if (result.success) {
        stats.movies.success++;
      } else {
        stats.movies.failed++;
      }

      // Delay entre requisições
      if (i < moviesToProcess.length - 1) {
        await delay(DELAY_BETWEEN_REQUESTS);
      }
    }

    // ========== SÉRIES ==========
    log('\n' + '='.repeat(60), 'bright');
    log('📺 PROCESSANDO SÉRIES POPULARES', 'bright');
    log('='.repeat(60) + '\n', 'bright');

    log('📡 Buscando lista de séries populares no TMDb...', 'blue');
    const tvToProcess = await fetchPopularTVShows(tvCount);

    log(`✅ ${tvToProcess.length} séries encontradas\n`, 'green');

    for (let i = 0; i < tvToProcess.length; i++) {
      const show = tvToProcess[i];
      stats.tv.total++;

      const result = await seedTVShow(show.id, i + 1, tvToProcess.length);

      if (result.success && result.skipped) {
        stats.tv.skipped++;
      } else if (result.success) {
        stats.tv.success++;
      } else {
        stats.tv.failed++;
      }

      // Delay entre requisições
      if (i < tvToProcess.length - 1) {
        await delay(DELAY_BETWEEN_REQUESTS);
      }
    }

    // ========== RESUMO ==========
    log('\n' + '='.repeat(60), 'bright');
    log('📊 RESUMO FINAL', 'bright');
    log('='.repeat(60) + '\n', 'bright');

    log('🎬 FILMES:', 'yellow');
    log(`   Total processado: ${stats.movies.total}`, 'yellow');
    log(`   ✅ Salvos: ${stats.movies.success}`, 'green');
    log(`   ⏭️  Pulados (já existiam): ${stats.movies.skipped}`, 'yellow');
    log(`   ❌ Falhas: ${stats.movies.failed}`, 'red');

    log('\n📺 SÉRIES:', 'yellow');
    log(`   Total processado: ${stats.tv.total}`, 'yellow');
    log(`   ✅ Salvos: ${stats.tv.success}`, 'green');
    log(`   ⏭️  Pulados (já existiam): ${stats.tv.skipped}`, 'yellow');
    log(`   ❌ Falhas: ${stats.tv.failed}`, 'red');

    const totalSuccess = stats.movies.success + stats.tv.success;
    log(`\n🎉 Concluído! ${totalSuccess} itens adicionados ao banco de dados.\n`, 'bright');

  } catch (error) {
    log(`\n❌ Erro fatal: ${error}`, 'red');
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
