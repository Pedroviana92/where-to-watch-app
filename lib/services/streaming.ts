import axios from 'axios';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const STREAMING_API_URL = 'https://streaming-availability.p.rapidapi.com';

interface StreamingService {
  service: string;
  streamingType: 'subscription' | 'rent' | 'buy' | 'free' | 'addon';
  link: string;
}

interface StreamingCountryData {
  [serviceId: string]: StreamingService[];
}

interface StreamingAvailabilityResponse {
  streamingInfo: {
    [country: string]: StreamingCountryData;
  };
}

/**
 * Busca onde um filme/série está disponível para streaming
 * Usa a API Streaming Availability via RapidAPI
 */
export async function getStreamingAvailability(
  imdbId: string,
  country = 'br'
): Promise<StreamingService[]> {
  if (!RAPIDAPI_KEY) {
    console.warn('RAPIDAPI_KEY não configurada');
    return [];
  }

  try {
    const response = await axios.get<StreamingAvailabilityResponse>(
      `${STREAMING_API_URL}/get`,
      {
        params: {
          imdb_id: imdbId,
          output_language: 'pt',
        },
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com',
        },
      }
    );

    const countryData = response.data.streamingInfo?.[country];

    if (!countryData) {
      return [];
    }

    // Extrair todos os serviços de streaming disponíveis
    const services: StreamingService[] = [];

    Object.entries(countryData).forEach(([serviceId, streamingOptions]) => {
      streamingOptions.forEach((option) => {
        services.push({
          service: mapServiceIdToName(serviceId),
          streamingType: option.streamingType,
          link: option.link,
        });
      });
    });

    return services;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro ao buscar streaming availability:', error.response?.data || error.message);
    } else {
      console.error('Erro ao buscar streaming availability:', error);
    }
    return [];
  }
}

/**
 * Mapeia IDs de serviços para nomes amigáveis
 */
function mapServiceIdToName(serviceId: string): string {
  const serviceMap: Record<string, string> = {
    netflix: 'Netflix',
    prime: 'Amazon Prime Video',
    disney: 'Disney+',
    hbo: 'HBO Max',
    apple: 'Apple TV+',
    paramount: 'Paramount+',
    star: 'Star+',
    globo: 'Globoplay',
    telecine: 'Telecine Play',
    mubi: 'MUBI',
    spotify: 'Spotify',
    youtube: 'YouTube',
    // Adicione mais conforme necessário
  };

  return serviceMap[serviceId] || serviceId;
}

/**
 * Agrupa serviços de streaming por tipo
 */
export function groupStreamingByType(services: StreamingService[]) {
  return services.reduce((acc, service) => {
    const type = service.streamingType;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(service);
    return acc;
  }, {} as Record<string, StreamingService[]>);
}

/**
 * Obtém apenas os serviços de assinatura (subscription)
 */
export function getSubscriptionServices(services: StreamingService[]): StreamingService[] {
  return services.filter(s => s.streamingType === 'subscription');
}

/**
 * Verifica se está disponível em algum serviço de streaming popular no Brasil
 */
export function isAvailableInBrazil(services: StreamingService[]): boolean {
  const popularBrazilianServices = [
    'Netflix',
    'Amazon Prime Video',
    'Disney+',
    'HBO Max',
    'Star+',
    'Globoplay',
    'Paramount+',
  ];

  return services.some(service =>
    popularBrazilianServices.includes(service.service) &&
    service.streamingType === 'subscription'
  );
}

/**
 * Fallback: busca no TMDb onde assistir (menos detalhado mas gratuito)
 * Útil se a API do RapidAPI não estiver disponível
 */
export async function getStreamingFromTMDb(
  tmdbId: number,
  mediaType: 'movie' | 'tv' = 'movie'
): Promise<StreamingService[]> {
  const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;

  if (!TMDB_ACCESS_TOKEN) {
    return [];
  }

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/${mediaType}/${tmdbId}/watch/providers`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        },
      }
    );

    const brazilData = response.data.results?.BR;

    if (!brazilData) {
      return [];
    }

    const services: StreamingService[] = [];

    // Flatrate = Subscription
    if (brazilData.flatrate) {
      brazilData.flatrate.forEach((provider: any) => {
        services.push({
          service: provider.provider_name,
          streamingType: 'subscription',
          link: brazilData.link || '',
        });
      });
    }

    // Rent
    if (brazilData.rent) {
      brazilData.rent.forEach((provider: any) => {
        services.push({
          service: provider.provider_name,
          streamingType: 'rent',
          link: brazilData.link || '',
        });
      });
    }

    // Buy
    if (brazilData.buy) {
      brazilData.buy.forEach((provider: any) => {
        services.push({
          service: provider.provider_name,
          streamingType: 'buy',
          link: brazilData.link || '',
        });
      });
    }

    return services;
  } catch (error) {
    console.error('Erro ao buscar streaming do TMDb:', error);
    return [];
  }
}
