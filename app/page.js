'use client';

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSEO } from '@/lib/slices/seoSlice';
import HomeCard from "@/components/HomeCard";
import Footer from '@/components/Footer';

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

  if (!mounted || loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {seoData && (
        <div className="px-8 py-10 bg-[#d52882] md:mx-10 md:mt-10 md:rounded-xl">
          <h1 className='text-lg font-bold'>{seoData.h1}</h1>
          <p>{seoData.description}</p>
        </div>
      )}
      <HomeCard />
      {seoData && (
        <div className='px-8 py-10 bg-[#d52882] md:m-10 md:rounded-xl' dangerouslySetInnerHTML={{ __html: seoData.content }} />
      )}
      <Footer/>
    </>
  );
}
