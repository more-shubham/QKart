'use client';

import { Song } from '@/types';
import { PlayIcon } from '@heroicons/react/24/solid';

interface SongListProps {
  songs: Song[];
  title?: string;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatPlays(plays: number): string {
  if (plays >= 1000000) {
    return `${(plays / 1000000).toFixed(1)}M`;
  }
  if (plays >= 1000) {
    return `${(plays / 1000).toFixed(1)}K`;
  }
  return plays.toString();
}

export function SongList({ songs, title }: SongListProps) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      {title && (
        <h3 className="text-xl font-bold text-white p-4 border-b border-gray-700">
          {title}
        </h3>
      )}

      <div className="divide-y divide-gray-700">
        {songs.map((song, index) => (
          <div
            key={song.id}
            className="flex items-center gap-4 p-4 hover:bg-gray-700 transition-colors group cursor-pointer"
          >
            <span className="w-8 text-center text-gray-500 group-hover:hidden">
              {index + 1}
            </span>
            <button className="w-8 hidden group-hover:flex items-center justify-center">
              <PlayIcon className="w-5 h-5 text-white" />
            </button>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{song.title}</p>
              <p className="text-sm text-gray-400 truncate">{song.artist}</p>
            </div>

            {song.albumTitle && (
              <p className="hidden md:block text-gray-400 text-sm truncate max-w-[200px]">
                {song.albumTitle}
              </p>
            )}

            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <span title="Total plays">{formatPlays(song.plays)}</span>
              <span>{formatDuration(song.durationSeconds)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
