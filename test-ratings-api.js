const axios = require('axios');

// Configuração da API (mesma do omdb.ts)
const MOVIE_DB_BASE_URL = 'https://movie-database-alternative.p.rapidapi.com/';
const RAPIDAPI_KEY = '184a5b4864mshd39f7e455b1d878p134d19jsnad12bbf6b6ee';

// Função para buscar ratings (mesma lógica do omdb.ts)
async function getMovieByImdbId(imdbId) {
  try {
    console.log(`\n🔍 Buscando ratings para IMDB ID: ${imdbId}\n`);
    console.log(`📡 URL: ${MOVIE_DB_BASE_URL}?r=json&i=${imdbId}\n`);

    const response = await axios.get(MOVIE_DB_BASE_URL, {
      params: {
        r: 'json',
        i: imdbId,
      },
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': 'movie-database-alternative.p.rapidapi.com',
      },
    });

    if (response.data.Response === 'False') {
      console.log(`❌ Filme não encontrado: ${imdbId}`);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error('❌ Erro ao buscar na Movie Database API:', error.message);
    return null;
  }
}

// Função para extrair ratings (mesma lógica do omdb.ts)
function extractRatings(movieData) {
  const ratings = {};

  // IMDB Rating
  if (movieData.imdbRating && movieData.imdbRating !== 'N/A') {
    ratings.imdb = parseFloat(movieData.imdbRating);
  }

  // Metacritic
  if (movieData.Metascore && movieData.Metascore !== 'N/A') {
    ratings.metacritic = parseInt(movieData.Metascore, 10);
  }

  // Rotten Tomatoes
  const rtRating = movieData.Ratings?.find((r) => r.Source === 'Rotten Tomatoes');
  if (rtRating) {
    const match = rtRating.Value.match(/(\d+)%/);
    if (match) {
      ratings.rottenTomatoes = parseInt(match[1], 10);
    }
  }

  return ratings;
}

// Teste principal
async function testAPI() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  🎬 TESTE DA NOVA API DE RATINGS - MOVIE DATABASE ALT');
  console.log('═══════════════════════════════════════════════════════');

  const imdbId = 'tt3581920'; // The Last of Us

  const movieData = await getMovieByImdbId(imdbId);

  if (!movieData) {
    console.log('\n❌ Nenhum dado retornado.\n');
    return;
  }

  console.log('═══════════════════════════════════════════════════════');
  console.log('📄 RESPOSTA COMPLETA DA API (JSON):');
  console.log('═══════════════════════════════════════════════════════');
  console.log(JSON.stringify(movieData, null, 2));

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('⭐ RATINGS ENCONTRADOS NO JSON:');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`Título: ${movieData.Title}`);
  console.log(`Ano: ${movieData.Year}`);
  console.log(`Tipo: ${movieData.Type}`);
  console.log('\nArray "Ratings":');
  if (movieData.Ratings && movieData.Ratings.length > 0) {
    movieData.Ratings.forEach((rating, index) => {
      console.log(`  ${index + 1}. ${rating.Source}: ${rating.Value}`);
    });
  } else {
    console.log('  ⚠️  Array vazio ou não existe');
  }

  console.log(`\nMetascore: ${movieData.Metascore}`);
  console.log(`imdbRating: ${movieData.imdbRating}`);

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('🎯 RATINGS EXTRAÍDOS (após processamento):');
  console.log('═══════════════════════════════════════════════════════');
  const extractedRatings = extractRatings(movieData);
  console.log(JSON.stringify(extractedRatings, null, 2));

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📊 RESUMO:');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`✅ IMDB Rating: ${extractedRatings.imdb || 'N/A'}`);
  console.log(`${extractedRatings.rottenTomatoes ? '✅' : '❌'} Rotten Tomatoes: ${extractedRatings.rottenTomatoes || 'NÃO DISPONÍVEL'}`);
  console.log(`${extractedRatings.metacritic ? '✅' : '❌'} Metacritic: ${extractedRatings.metacritic || 'NÃO DISPONÍVEL'}`);
  console.log('═══════════════════════════════════════════════════════\n');
}

// Executar teste
testAPI().catch(console.error);
