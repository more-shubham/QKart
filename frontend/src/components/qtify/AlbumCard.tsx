'use client';

import Image from 'next/image';
import { Album } from '@/types';
import { HeartIcon, PlayIcon } from '@heroicons/react/24/solid';

interface AlbumCardProps {
  album: Album;
  onPlay?: (album: Album) => void;
}

export function AlbumCard({ album, onPlay }: AlbumCardProps) {
  return (
    <div className="group relative bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-all cursor-pointer">
      <div className="relative aspect-square rounded-md overflow-hidden mb-4">
        <Image
          src={album.imageUrl}
          alt={album.title}
          fill
          className="object-cover"
        />
        <button
          onClick={() => onPlay?.(album)}
          className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-105 transform"
        >
          <PlayIcon className="w-6 h-6 text-black ml-1" />
        </button>
      </div>

      <h3 className="font-semibold text-white truncate">{album.title}</h3>
      <p className="text-gray-400 text-sm truncate mt-1">{album.artist}</p>

      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
        <span className="bg-gray-700 px-2 py-0.5 rounded">{album.genre}</span>
        <span>{album.releaseYear}</span>
      </div>

      <div className="flex items-center gap-1 mt-2 text-gray-400 text-sm">
        <HeartIcon className="w-4 h-4" />
        <span>{album.likes?.toLocaleString()}</span>
      </div>
    </div>
  );
}
