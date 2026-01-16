import HomeCard from "@/components/HomeCard";

// Force dynamic rendering to ensure fresh data on every request
export const dynamic = 'force-dynamic';

async function fetchSEOData(page) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/seo?page=${page}`, {
      cache: 'no-store', // Don't cache SEO data to ensure freshness
    });

    if (!response.ok) {
      console.warn('Failed to fetch SEO data:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.warn('Error fetching SEO data:', error);
    return null;
  }
}

export default async function Home() {
  // Fetch SEO data on the server
  const seoData = await fetchSEOData('homepage');

  return (
    <>
      {/* Render SEO header */}
      {seoData ? (
        <div className="px-8 py-10 bg-[#33182c] md:mx-10 md:mt-10 md:rounded-xl">
          <h1 className='text-lg font-bold'>{seoData.h1}</h1>
          <p>{seoData.description}</p>
        </div>
      ) : null}

      {/* Render HomeCard with server-side data fetching */}
      <HomeCard />

      {/* Render SEO footer */}
      {seoData ? (
        <div className='px-8 py-10 bg-[#33182c] md:m-10 md:rounded-xl' dangerouslySetInnerHTML={{ __html: seoData.content }} />
      ) : null}
    </>
  );
}
