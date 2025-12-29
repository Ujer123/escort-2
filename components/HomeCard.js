'use client'
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProfileCard from './ProfileCard';
import { ProfileCardSkeleton } from './ProfileCardSkeleton';
import Link from 'next/link';
import { fetchProfiles, fetchFavorites, toggleFavorite, toggleFavoriteLocal } from '../lib/slices/profileSlice';

import { slugify } from '../lib/utils';

export default function HomeCard() {
  const dispatch = useDispatch();
  const { profiles, favorites, loading, error } = useSelector((state) => state.profile);
  const fetchedRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only fetch once, even with strict mode
    if (mounted && !fetchedRef.current) {
      fetchedRef.current = true;
      dispatch(fetchProfiles());
      dispatch(fetchFavorites());
    }
  }, [mounted, dispatch]);

  const handleToggleFavorite = (profile) => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(toggleFavorite({ serviceId: profile._id }));
    } else {
      dispatch(toggleFavoriteLocal(profile));
    }
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-center gap-6 py-10 px-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProfileCardSkeleton key={i} />
        ))}
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

  const favoriteIds = new Set(favorites.map(fav => fav._id || fav.phone));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-center gap-6 py-10 px-10">
      {profiles.map((profile) => (
        <ProfileCard
          key={profile._id || profile.phone}
          data={profile}
          isFavorite={favoriteIds.has(profile._id || profile.phone)}
          onFavoriteToggle={handleToggleFavorite}
        />
      ))}
    </div>
  );
}
