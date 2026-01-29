// Fetch profile data server-side
async function fetchProfileData(slug) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/profiles/${slug}`, {
      cache: 'no-store',
    });

    if (response.status === 404) {
      return { profile: null, notFound: true, error: null };
    }

    if (!response.ok) {
      return { profile: null, notFound: false, error: `Failed to fetch profile: ${response.status}` };
    }

    const profile = await response.json();
    return { profile, notFound: false, error: null };
  } catch (error) {
    console.error('Error fetching profile server-side:', error);
    return { profile: null, notFound: false, error: error?.message || 'Unknown error' };
  }
}

import ClientProfilePage from './ClientProfilePage';

export default async function ProfilePage({ params }) {
  const { slug } = await params;

  // Fetch profile data on the server
  const result = await fetchProfileData(slug);
  console.log('Fetched profile data for slug', slug, result);

  if (result.notFound) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white text-xl">Profile not found</div>
      </div>
    );
  }

  if (result.error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white text-xl">Unable to load profile. Please try again later.</div>
      </div>
    );
  }

  return <ClientProfilePage profile={result.profile} />;
}
