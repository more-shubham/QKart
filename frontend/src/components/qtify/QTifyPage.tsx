'use client';

import { useState, useCallback, useMemo } from 'react';
import { Album, Song } from '@/types';
import { SearchBar } from '@/components/common/SearchBar';
import { AlbumCarousel } from './AlbumCarousel';
import { SongList } from './SongList';
import { GenreTabs } from './GenreTabs';

interface QTifyPageProps {
  featuredAlbums: Album[];
  topAlbums: Album[];
  topSongs: Song[];
  genres: string[];
}

export function QTifyPage({
  featuredAlbums,
  topAlbums,
  topSongs,
  genres,
}: QTifyPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const filteredTopAlbums = useMemo(() => {
    let result = topAlbums;

    if (selectedGenre) {
      result = result.filter((album) => album.genre === selectedGenre);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (album) =>
          album.title.toLowerCase().includes(query) ||
          album.artist.toLowerCase().includes(query)
      );
    }

    return result;
  }, [topAlbums, selectedGenre, searchQuery]);

  const filteredSongs = useMemo(() => {
    if (!searchQuery) return topSongs;

    const query = searchQuery.toLowerCase();
    return topSongs.filter(
      (song) =>
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query)
    );
  }, [topSongs, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-green-900 to-gray-900 py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            QTify
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Discover and stream your favorite music
          </p>

          <div className="max-w-xl">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search albums and songs..."
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Featured Albums */}
        <AlbumCarousel
          title="Featured Albums"
          albums={featuredAlbums}
          showCollapse={false}
        />

        {/* Genre Tabs */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Browse by Genre</h2>
          <GenreTabs
            genres={genres}
            selectedGenre={selectedGenre}
            onGenreChange={setSelectedGenre}
          />
        </div>

        {/* Top Albums */}
        <AlbumCarousel
          title="Top Albums"
          albums={filteredTopAlbums}
        />

        {/* Top Songs */}
        <div className="mt-8">
          <SongList songs={filteredSongs} title="Top Songs" />
        </div>
      </div>
    </div>
  );
}
