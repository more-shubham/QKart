'use client';

import { useState } from 'react';
import { Album } from '@/types';
import { AlbumCard } from './AlbumCard';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface AlbumCarouselProps {
  title: string;
  albums: Album[];
  showCollapse?: boolean;
}

export function AlbumCarousel({ title, albums, showCollapse = true }: AlbumCarouselProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const displayedAlbums = isCollapsed ? albums : albums.slice(0, 5);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById(`carousel-${title}`);
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === 'left'
        ? scrollPosition - scrollAmount
        : scrollPosition + scrollAmount;
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {showCollapse && albums.length > 5 && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-green-500 text-sm font-medium hover:underline"
          >
            {isCollapsed ? 'Show Less' : 'Show All'}
          </button>
        )}
      </div>

      <div className="relative group">
        {!isCollapsed && albums.length > 5 && (
          <>
            <button
              onClick={() => handleScroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeftIcon className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRightIcon className="w-6 h-6 text-white" />
            </button>
          </>
        )}

        {isCollapsed ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        ) : (
          <div
            id={`carousel-${title}`}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          >
            {displayedAlbums.map((album) => (
              <div key={album.id} className="flex-shrink-0 w-48">
                <AlbumCard album={album} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
