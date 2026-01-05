'use client';

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSEO } from '@/lib/slices/seoSlice';
import HomeCard from "@/components/HomeCard";


export default function Home() {
  const dispatch = useDispatch();
  const { seoData, loading, error } = useSelector((state) => state.seo);
  const fetchedRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only fetch once, even with strict mode
    if (mounted && !fetchedRef.current) {
      fetchedRef.current = true;
      dispatch(fetchSEO('homepage'));
    }
  }, [mounted, dispatch]);

  // Show skeleton while SEO is loading, but render HomeCard immediately
  if (!mounted) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {/* Render SEO header immediately with loading state */}
      {loading ? (
        <div className="px-8 py-10 bg-[#d52882] md:mx-10 md:mt-10 md:rounded-xl">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      ) : seoData ? (
        <div className="px-8 py-10 bg-[#d52882] md:mx-10 md:mt-10 md:rounded-xl">
          <h1 className='text-lg font-bold'>{seoData.h1}</h1>
          <p>{seoData.description}</p>
        </div>
      ) : null}

      {/* Render HomeCard immediately - it handles its own loading state */}
      <HomeCard />

      {/* Render SEO footer immediately with loading state */}
      {loading ? (
        <div className='px-8 py-10 bg-[#d52882] md:m-10 md:rounded-xl'>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      ) : seoData ? (
        <div className='px-8 py-10 bg-[#d52882] md:m-10 md:rounded-xl' dangerouslySetInnerHTML={{ __html: seoData.content }} />
      ) : null}
    </>
  );
}
