'use client';

import Image from 'next/image';

interface MovieCardProps {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  releaseDate?: string | null;
  rating?: number;
  mediaType?: string;
  onClick: () => void;
}

export default function MovieCard({
  id,
  title,
  overview,
  posterPath,
  releaseDate,
  rating,
  mediaType,
  onClick,
}: MovieCardProps) {
  const posterUrl = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : '/placeholder-poster.png';

  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;
  const mediaTypeLabel = mediaType === 'tv' ? 'Série' : 'Filme';

  return (
    <div
      onClick={onClick}
      className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-all cursor-pointer group hover:scale-105"
    >
      <div className="relative aspect-[2/3] bg-gray-800">
        {posterPath ? (
          <Image
            src={posterUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
        )}

        {/* Badge de tipo (Filme/Série) */}
        {mediaType && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
            {mediaTypeLabel}
          </div>
        )}

        {/* Rating do TMDb */}
        {rating && rating > 0 && (
          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-yellow-400 font-bold flex items-center gap-1">
            ⭐ {rating.toFixed(1)}
          </div>
        )}

        {/* Overlay no hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-4">
        <h3 className="text-white font-semibold mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
          {title}
        </h3>

        {year && (
          <p className="text-gray-400 text-sm mb-2">{year}</p>
        )}

        <p className="text-gray-400 text-sm line-clamp-3">
          {overview || 'Sem descrição disponível.'}
        </p>

        <button className="mt-3 text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors">
          Ver detalhes →
        </button>
      </div>
    </div>
  );
}
