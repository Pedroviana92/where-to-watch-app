'use client';

interface StreamingOption {
  provider: string;
  type: string;
  link: string | null;
  recordedAt?: Date;
}

interface StreamingAvailabilityProps {
  streamingOptions: StreamingOption[];
}

const streamingLogos: Record<string, string> = {
  'Netflix': '🔴',
  'Amazon Prime Video': '📦',
  'Disney+': '✨',
  'HBO Max': '🎭',
  'Star+': '⭐',
  'Globoplay': '🌐',
  'Paramount+': '🏔️',
  'Apple TV+': '🍎',
  'YouTube': '▶️',
  'Telecine Play': '🎬',
  'MUBI': '🎨',
};

const streamingColors: Record<string, string> = {
  'Netflix': 'border-red-500/50 hover:border-red-500',
  'Amazon Prime Video': 'border-blue-400/50 hover:border-blue-400',
  'Disney+': 'border-blue-600/50 hover:border-blue-600',
  'HBO Max': 'border-purple-500/50 hover:border-purple-500',
  'Star+': 'border-yellow-500/50 hover:border-yellow-500',
  'Globoplay': 'border-orange-500/50 hover:border-orange-500',
  'Paramount+': 'border-blue-500/50 hover:border-blue-500',
  'Apple TV+': 'border-gray-400/50 hover:border-gray-400',
};

const typeTranslation: Record<string, string> = {
  subscription: 'Assinatura',
  rent: 'Aluguel',
  buy: 'Compra',
  free: 'Gratuito',
  addon: 'Add-on',
};

export default function StreamingAvailability({ streamingOptions }: StreamingAvailabilityProps) {
  if (streamingOptions.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Onde Assistir</h3>
        <p className="text-gray-400 text-center py-4">
          Nenhuma opção de streaming disponível no momento
        </p>
      </div>
    );
  }

  // Agrupar por tipo de streaming
  const subscriptions = streamingOptions.filter((s) => s.type === 'subscription');
  const rentals = streamingOptions.filter((s) => s.type === 'rent');
  const purchases = streamingOptions.filter((s) => s.type === 'buy');
  const free = streamingOptions.filter((s) => s.type === 'free');

  const renderStreamingGroup = (options: StreamingOption[], title: string) => {
    if (options.length === 0) return null;

    return (
      <div className="mb-6 last:mb-0">
        <h4 className="text-sm font-medium text-gray-400 mb-3">{title}</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {options.map((option, index) => {
            const logo = streamingLogos[option.provider] || '🎬';
            const colorClass = streamingColors[option.provider] || 'border-gray-500/50 hover:border-gray-500';

            return (
              <a
                key={`${option.provider}-${index}`}
                href={option.link || '#'}
                target={option.link ? '_blank' : undefined}
                rel={option.link ? 'noopener noreferrer' : undefined}
                className={`bg-white/5 backdrop-blur-sm rounded-lg p-3 border ${colorClass} transition-all hover:bg-white/10 ${
                  !option.link ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{logo}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                      {option.provider}
                    </div>
                    {option.link && (
                      <div className="text-xs text-gray-400">Assistir →</div>
                    )}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Onde Assistir</h3>

      {renderStreamingGroup(subscriptions, 'Disponível em Assinatura')}
      {renderStreamingGroup(free, 'Gratuito')}
      {renderStreamingGroup(rentals, 'Aluguel')}
      {renderStreamingGroup(purchases, 'Compra')}

      <p className="text-xs text-gray-500 mt-4 text-center">
        As informações de disponibilidade podem variar. Verifique o serviço para confirmar.
      </p>
    </div>
  );
}
