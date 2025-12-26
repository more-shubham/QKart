'use client';

interface GenreTabsProps {
  genres: string[];
  selectedGenre: string | null;
  onGenreChange: (genre: string | null) => void;
}

export function GenreTabs({ genres, selectedGenre, onGenreChange }: GenreTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onGenreChange(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selectedGenre === null
            ? 'bg-green-500 text-black'
            : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
      >
        All
      </button>
      {genres.map((genre) => (
        <button
          key={genre}
          onClick={() => onGenreChange(genre)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedGenre === genre
              ? 'bg-green-500 text-black'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}
