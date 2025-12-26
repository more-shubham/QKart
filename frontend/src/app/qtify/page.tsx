import { fetchQTifyData } from '@/services/api';
import { QTifyPage } from '@/components/qtify/QTifyPage';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'QTify - Music Streaming',
  description: 'Stream your favorite music on QTify',
};

export default async function QTifyRoute() {
  let data;
  try {
    data = await fetchQTifyData();
  } catch (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Unable to load music</h1>
          <p className="text-gray-400">Please ensure the backend server is running.</p>
        </div>
      </div>
    );
  }

  return (
    <QTifyPage
      featuredAlbums={data.featuredAlbums}
      topAlbums={data.topAlbums}
      topSongs={data.topSongs}
      genres={data.genres}
    />
  );
}
