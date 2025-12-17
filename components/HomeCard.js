'use client'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProfileCard from './ProfileCard';
import Link from 'next/link';
import { fetchProfiles, fetchFavorites, toggleFavorite, toggleFavoriteLocal } from '../lib/slices/profileSlice';

import { slugify } from '../lib/utils';

export default function HomeCard() {
  const dispatch = useDispatch();
  const { profiles, favorites, loading, error } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfiles());
    dispatch(fetchFavorites());
  }, [dispatch]);

  const handleToggleFavorite = (profile) => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(toggleFavorite({ serviceId: profile._id }));
    } else {
      dispatch(toggleFavoriteLocal(profile));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800 flex justify-center items-center">
        <div className="text-white text-xl">Loading profiles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-800 flex justify-center items-center">
        <div className="text-red-500 text-xl">{error}</div>
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
          onFavoriteToggle={handleToggleFavorite}
        />
      ))}
    </div>
  );
}
