'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminProfileForm from '@/components/AdminProfileForm';

export default function EscortDashboard() {
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Handle client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        // Fetch user data
        const userResponse = await fetch('/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          
          // Verify user is escort
          if (userData.role !== 'escort') {
            router.push('/');
            return;
          }
          
          setUser(userData);
          
          // Fetch services with authentication to get filtered results
          const servicesResponse = await fetch('/api/services', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (servicesResponse.ok) {
            const servicesData = await servicesResponse.json();
            setServices(servicesData);
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/login');
  };

  const refreshServices = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/services', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Error refreshing services:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-purple-300 text-lg font-medium">Loading Escort Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">💎</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Escort Control Panel</h1>
                <p className="text-purple-300">Professional Profile Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-purple-300">Welcome, {user?.email?.split('@')[0]}</p>
                <p className="text-xs text-gray-400">Escort Professional</p>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-6 py-2 rounded-full text-white font-medium transition-all duration-200 shadow-lg hover:shadow-red-500/25"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl shadow-2xl mb-8">
          <div className="border-b border-purple-500/20">
            <nav className="flex space-x-0 px-2 py-2">
              {[
                { id: 'overview', label: 'Dashboard Overview', icon: '📊', color: 'from-purple-600 to-pink-600' },
                { id: 'profiles', label: 'My Profiles', icon: '💎', color: 'from-pink-600 to-purple-600' },
                { id: 'analytics', label: 'Analytics', icon: '📈', color: 'from-blue-600 to-purple-600' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-6 rounded-xl font-medium text-sm flex items-center justify-center space-x-2 transition-all duration-200 mx-1 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-105`
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'overview' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h2>
                  <p className="text-purple-300">Monitor your profile performance and engagement</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-purple-800/50 to-purple-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-300 text-sm font-medium">Total Profiles</p>
                        <p className="text-3xl font-bold text-white mt-2">{services.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">📋</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-800/50 to-green-900/50 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-300 text-sm font-medium">Active Now</p>
                        <p className="text-3xl font-bold text-white mt-2">
                          {services.filter(s => s.availability === 'Available now').length}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">✨</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-pink-800/50 to-pink-900/50 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-pink-300 text-sm font-medium">Profile Views</p>
                        <p className="text-3xl font-bold text-white mt-2">1.2k</p>
                      </div>
                      <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">👀</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-yellow-800/50 to-yellow-900/50 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-300 text-sm font-medium">Favorites</p>
                        <p className="text-3xl font-bold text-white mt-2">47</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">⭐</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-purple-800/30 to-pink-800/30 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 mb-8 shadow-xl">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="mr-2">🚀</span>
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button 
                      onClick={() => {
                        setActiveTab('profiles');
                        setShowAddForm(true);
                      }}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center space-x-2"
                    >
                      <span className="text-xl">➕</span>
                      <span>New Profile</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('analytics')}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center space-x-2"
                    >
                      <span className="text-xl">📊</span>
                      <span>Analytics</span>
                    </button>
                    <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-green-500/25 flex items-center justify-center space-x-2">
                      <span className="text-xl">💬</span>
                      <span>Messages</span>
                    </button>
                    <button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-orange-500/25 flex items-center justify-center space-x-2">
                      <span className="text-xl">⚙️</span>
                      <span>Settings</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profiles' && (
              <div>

                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Profile Management</h2>
                  <p className="text-pink-300">Create and manage your professional profiles</p>
                </div>

                {/* Add Profile Form */}
                {showAddForm && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gradient-to-br from-gray-900 to-black border border-purple-500/20 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                      <div className="sticky top-0 bg-gradient-to-r from-purple-900/80 to-pink-900/80 backdrop-blur-sm border-b border-purple-500/20 p-6">
                        <div className="flex justify-between items-center">
                          <h2 className="text-2xl font-bold text-white flex items-center">
                            <span className="mr-3">✨</span>
                            Create New Profile
                          </h2>
                          <button 
                            onClick={() => setShowAddForm(false)}
                            className="w-10 h-10 bg-red-500/20 hover:bg-red-500/30 rounded-full flex items-center justify-center text-red-400 hover:text-red-300 transition-all duration-200"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                      <div className="p-6">
                        <AdminProfileForm 
                          onProfileAdded={() => {
                            setShowAddForm(false);
                            refreshServices();
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Profiles Section */}
                <div className="bg-gradient-to-br from-pink-800/20 to-purple-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl shadow-xl">
                  <div className="p-6 border-b border-purple-500/20">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-white flex items-center">
                        <span className="mr-3">💎</span>
                        My Profiles
                      </h2>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-purple-300">
                          {services.length} {services.length === 1 ? 'profile' : 'profiles'} total
                        </div>
                        <button 
                          onClick={() => setShowAddForm(true)}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/25 flex items-center space-x-2"
                        >
                          <span>✨</span>
                          <span>Add New</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {services.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                          <span className="text-4xl">🌟</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">
                          Ready to shine?
                        </h3>
                        <p className="text-purple-300 mb-8 max-w-md mx-auto">
                          Create your first profile to start attracting clients and building your professional presence.
                        </p>
                        <button 
                          onClick={() => setShowAddForm(true)}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/25 inline-flex items-center space-x-2"
                        >
                          <span className="text-xl">✨</span>
                          <span>Create Your First Profile</span>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => (
                          <div key={service._id} className="bg-gradient-to-br from-purple-800/20 to-pink-800/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                  <span className="text-white font-bold">{service.name?.[0]?.toUpperCase()}</span>
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold text-white">{service.name}</h3>
                                  <p className="text-purple-300 text-sm">{service.nationality || 'Not specified'}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className={`w-3 h-3 rounded-full ${
                                  service.availability === 'Available now' 
                                    ? 'bg-green-500 animate-pulse' 
                                    : 'bg-gray-500'
                                }`}></span>
                                <span className={`text-xs font-medium ${
                                  service.availability === 'Available now' 
                                    ? 'text-green-400' 
                                    : 'text-gray-400'
                                }`}>
                                  {service.availability === 'Available now' ? 'Online' : 'Offline'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="space-y-3 mb-6">
                              <div className="flex justify-between items-center">
                                <span className="text-purple-300 text-sm">Starting Price</span>
                                <span className="text-white font-bold">{service.price}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-purple-300 text-sm">Profile Views</span>
                                <span className="text-white font-bold">127</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-purple-300 text-sm">Favorites</span>
                                <span className="text-yellow-400 font-bold">12 ⭐</span>
                              </div>
                            </div>
                            
                            <div className="flex space-x-3">
                              <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm">
                                ✏️ Edit
                              </button>
                              <button className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm">
                                👁️ View
                              </button>
                              <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm">
                                🗑️
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Analytics & Insights</h2>
                  <p className="text-blue-300">Track your profile performance and engagement metrics</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-800/20 to-purple-800/20 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 shadow-xl">
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl">📈</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Analytics Coming Soon
                    </h3>
                    <p className="text-blue-300 max-w-md mx-auto">
                      Detailed analytics and insights about your profile performance, visitor engagement, and booking trends will be available here.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
