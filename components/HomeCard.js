'use client'
import { useEffect, useState } from 'react';
import ProfileCard from './ProfileCard';
import Link from 'next/link';

import { slugify } from '../lib/utils';

export default function HomeCard() {
  const [profiles, setProfiles] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    const loadFallback = async () => {
      const res = await fetch('/profiles.json');
      if (!res.ok) throw new Error('Fallback fetch failed');
      return res.json();
    };

    try {
      const response = await fetch('/api/services');
      if (response.ok) {
        const data = await response.json();
        setProfiles(data);
      } else {
        throw new Error('API fetch failed');
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
      try {
        const data = await loadFallback();
        setProfiles(data);
      } catch (err) {
        console.error('Failed to load fallback profiles:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (profile) => {
    try {
      // Check if user is authenticated (has a token)
      const token = localStorage.getItem('token');
      
      if (token) {
        // Use API for authenticated users
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            serviceId: profile._id
          })
        });
        
        if (response.ok) {
          // Refresh favorites from API
          const favResponse = await fetch('/api/favorites', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (favResponse.ok) {
            const favoritesData = await favResponse.json();
            setFavorites(favoritesData.map(fav => fav.service));
          }
        }
      } else {
        // Fallback to localStorage for unauthenticated users
        const savedFavs = JSON.parse(localStorage.getItem('favorites') || '[]');
        const isFav = savedFavs.find(fav => fav._id === profile._id || fav.phone === profile.phone);
        
        if (isFav) {
          const newFavs = savedFavs.filter(fav => fav._id !== profile._id && fav.phone !== profile.phone);
          localStorage.setItem('favorites', JSON.stringify(newFavs));
          setFavorites(newFavs);
        } else {
          const newFavs = [...savedFavs, profile];
          localStorage.setItem('favorites', JSON.stringify(newFavs));
          setFavorites(newFavs);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  useEffect(() => {
    const loadFavorites = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        // Load favorites from API for authenticated users
        try {
          const response = await fetch('/api/favorites', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const favoritesData = await response.json();
            setFavorites(favoritesData.map(fav => fav.service));
          }
        } catch (error) {
          console.error('Error loading favorites:', error);
        }
      } else {
        // Load favorites from localStorage for unauthenticated users
        const savedFavs = localStorage.getItem('favorites');
        if (savedFavs) {
          setFavorites(JSON.parse(savedFavs));
        }
      }
    }
    
    loadFavorites();
   }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800 flex justify-center items-center">
        <div className="text-white text-xl">Loading profiles...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-center gap-6 py-10 px-10">
      {profiles.map((profile) => (
        <ProfileCard 
          key={profile._id || profile.phone}
          data={profile} 
          isFavorite={favorites.some(fav => fav._id === profile._id || fav.phone === profile.phone)}
          onFavoriteToggle={toggleFavorite}
        />
      ))}
    </div>
  );
}
