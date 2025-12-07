'use client'
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch('/api/favorites', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setFavorites(data.map(item => item.service));
          } else {
            console.error('Failed to fetch favorites');
          }
        } else {
          const savedFavs = JSON.parse(localStorage.getItem('favorites') || '[]');
          setFavorites(savedFavs);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex justify-center items-center">
        <div className="text-white text-2xl font-semibold animate-pulse">Loading favorites...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white">⭐ Your Favorites</h1>
        <p className="text-gray-400 mt-2">Here are the services you’ve saved</p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {favorites.map((service) => (
            <div
              key={service._id}
              className="bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 hover:scale-[1.02]"
            >
              <div className="flex items-center space-x-4">
                <Image
                  src={service.image || '/default-avatar.png'}
                  alt={service.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
                />
                <div>
                  <h2 className="text-xl font-bold text-white">{service.name}</h2>
                  <p className="text-gray-400 text-sm">{service.category || "Uncategorized"}</p>
                </div>
              </div>

              <p className="text-gray-300 mt-4 line-clamp-3">{service.description || "No description available."}</p>

              <button className="mt-5 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition">
                View Details
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-300 text-lg mt-20">
          No favorites found 💔
        </div>
      )}
    </div>
  );
}
