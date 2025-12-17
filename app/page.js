'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSEO } from '@/lib/slices/seoSlice';
import HomeCard from "@/components/HomeCard";

export default function Home() {
  const dispatch = useDispatch();
  const { seoData, loading, error } = useSelector((state) => state.seo);

  useEffect(() => {
    dispatch(fetchSEO('homepage'));
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {seoData && (
        <div className="p-3">
          <h1>{seoData.h1}</h1>
          <p>{seoData.description}</p>
        </div>
      )}
      <HomeCard />
      {seoData && (
        <div className='p-3' dangerouslySetInnerHTML={{ __html: seoData.content }} />
      )}
    </>
  );
}
