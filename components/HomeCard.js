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
  const { profiles, favorites, loading, error, pagination } = useSelector((state) => state.profile);
  const fetchedRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !fetchedRef.current) {
      fetchedRef.current = true;
      Promise.all([
        dispatch(fetchProfiles()),
        dispatch(fetchFavorites())
      ]).catch(console.error); 
    }
  }, [mounted, dispatch]);

  const handleLoadMore = async () => {
    if (loadingMore || !pagination?.hasNext) return;

    setLoadingMore(true);
    try {
      await dispatch(fetchProfiles({ page: pagination.page + 1, limit: pagination.limit }));
    } catch (error) {
      console.error('Failed to load more profiles:', error);
    } finally {
      setLoadingMore(false);
    }
  };

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-center gap-6 py-10 px-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProfileCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  const favoriteIds = new Set(favorites.map(fav => fav._id || fav.phone));

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-center gap-6 py-10  px-2 md:px-10">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile._id || profile.phone}
            data={profile}
            isFavorite={favoriteIds.has(profile._id || profile.phone)}
            onFavoriteToggle={handleToggleFavorite}
          />
        ))}
      </div>

      {/* Load More Button */}
      {pagination?.hasNext && (
        <div className="flex justify-center py-8">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="bg-[#d52882] hover:bg-[#b52273] disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 disabled:cursor-not-allowed"
          >
            {loadingMore ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Loading...
              </div>
            ) : (
              `Load More Profiles (${pagination.total - profiles.length} remaining)`
            )}
          </button>
        </div>
      )}
    </>
  );
}
