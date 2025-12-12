'use client';

interface Rating {
  imdb?: number | null;
  rottenTomatoes?: number | null;
  metacritic?: number | null;
  tmdb?: number | null;
}

interface RatingsDisplayProps {
  ratings: Rating;
}

export default function RatingsDisplay({ ratings }: RatingsDisplayProps) {
  const ratingItems = [
    {
      name: 'IMDB',
      value: ratings.imdb,
      format: (val: number) => `${val.toFixed(1)}/10`,
      color: 'text-yellow-400',
      logo: '⭐',
    },
    {
      name: 'Rotten Tomatoes',
      value: ratings.rottenTomatoes,
      format: (val: number) => `${val}%`,
      color: (val: number) => (val >= 60 ? 'text-red-500' : 'text-green-500'),
      logo: '🍅',
    },
    {
      name: 'Metacritic',
      value: ratings.metacritic,
      format: (val: number) => `${val}/100`,
      color: (val: number) =>
        val >= 75 ? 'text-green-500' : val >= 50 ? 'text-yellow-500' : 'text-red-500',
      logo: 'M',
    },
    {
      name: 'TMDb',
      value: ratings.tmdb,
      format: (val: number) => `${val.toFixed(1)}/10`,
      color: 'text-blue-400',
      logo: '🎬',
    },
  ];

  const availableRatings = ratingItems.filter((item) => item.value != null && item.value > 0);

  if (availableRatings.length === 0) {
    return (
      <div className="text-gray-400 text-center py-4">
        Avaliações não disponíveis
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {availableRatings.map((item) => {
        const colorClass =
          typeof item.color === 'function'
            ? item.color(item.value!)
            : item.color;

        return (
          <div
            key={item.name}
            className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 text-center hover:border-white/20 transition-colors"
          >
            <div className="text-2xl mb-1">{item.logo}</div>
            <div className="text-xs text-gray-400 mb-1">{item.name}</div>
            <div className={`text-xl font-bold ${colorClass}`}>
              {item.format(item.value!)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
