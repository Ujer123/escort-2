'use client'
import { useEffect, useState, use } from 'react';
import { Heart, MessageCircle, Phone, Clock, MapPin, Star, Camera, Home, Calendar, Plane, Utensils,ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function ProfilePage({ params }) {
  const { slug } = use(params);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (slug) {
      fetch(`/api/profiles`)
        .then(res => res.json())
        .then(data => {
          const foundProfile = data.find(p => slugify(p.name) === slug);
          setProfile(foundProfile);
        });
    }
    
    // Uncomment this for real implementation
    /*
    if (slug) {
      fetch('/profiles.json')
        .then(res => res.json())
        .then(data => {
          const foundProfile = data.find(p => slugify(p.name) === slug);
          setProfile(foundProfile);
        });
    }
    */
  }, [slug]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-black/50 p-4 flex justify-between items-center">
        <div>
          <Link className="flex items-center gap-4" href="/">
            <div className="w-8 h-8 bg-pink-500 rounded flex items-center justify-center"><ChevronLeft/></div>
            <span className="text-sm opacity-75">BACK TO LIST</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="relative mb-4">
                <Image
                  height={384}
                  width={384}
                  src={profile.gallery[selectedImage] || profile.image}
                  alt={profile.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-green-500 text-xs px-2 py-1 rounded-full">ONLINE</span>
                </div>
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button className="bg-black/50 p-2 rounded-full">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="bg-black/50 p-2 rounded-full">
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Gallery */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {profile.gallery.map((img, index) => (
                  <Image 
                    key={index}
                    src={img}
                    alt={`Gallery ${index + 1}`}
                    width={80}
                    height={80}
                    objectFit="cover"
                    className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity"
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <p className="text-xs text-gray-400 uppercase tracking-wide">QUICK ACTIONS</p>
                <div className="space-y-2">
                  <button className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Send Message
                  </button>
                  <button className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    Call Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Info */}
          <div className="lg:col-span-2">
            {/* Profile Header */}
            <div className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                <div className="text-right">
                  <div className="text-2xl font-bold text-pink-500">{profile.price}</div>
                  <div className="text-sm text-gray-400">per hour</div>
                </div>
              </div>
              <p className="text-gray-300 mb-1">{profile.nationality}</p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  4.9 (127)
                </span>
                <span>Age {profile.age}</span>
                <span className="text-green-400">{profile.availability}</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-700 mb-6">
              <nav className="flex space-x-8">
                {['about', 'services', 'outcall', 'info'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 text-sm uppercase tracking-wide border-b-2 transition-colors ${
                      activeTab === tab
                        ? 'border-pink-500 text-pink-500'
                        : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'about' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">About Me</h3>
                  <div className="text-gray-300 leading-relaxed space-y-4">
                    <p>{profile.description}</p>
                    <p>{profile.fullDescription}</p>
                  </div>
                </div>
              )}

              {activeTab === 'services' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Services & Rates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.services.map((service, index) => {
                      // Create a mapping of icon names to actual components
                      const iconMap = {
                        MapPin: MapPin,
                        Home: Home,
                        Clock: Clock,
                        Calendar: Calendar,
                        Plane: Plane,
                        Utensils: Utensils
                      };
                      const IconComponent = iconMap[service.icon] || Clock;
                      return (
                        <div key={index} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <IconComponent className="w-5 h-5 text-pink-500" />
                            <span>{service.name}</span>
                          </div>
                          <span className="font-semibold text-pink-500">{service.price}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'outcall' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Outcall Information</h3>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-300 mb-4">Available for outcall services in the local area. Travel fees may apply for distances over 15 miles.</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Minimum booking:</span>
                        <span>2 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Travel fee:</span>
                        <span>$50 (15+ miles)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Advance notice:</span>
                        <span>2 hours preferred</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'info' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Physical Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(profile.stats).map(([key, value]) => (
                      <div key={key} className="bg-gray-800 p-3 rounded-lg">
                        <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                          {key}
                        </div>
                        <div className="font-semibold">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Section */}
            <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Ready to Book?</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 bg-white text-purple-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
                  Send Message
                </button>
                <button className="flex-1 bg-black/20 border border-white/30 py-3 px-6 rounded-lg hover:bg-black/30 transition-colors">
                  Call {profile.phone}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}