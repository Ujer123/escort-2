'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ProfileManagement from '@/components/ProfileManagement';

// Create a wrapper component for CKEditor
const EditorWrapper = dynamic(() => {
  return import('@ckeditor/ckeditor5-react').then((mod) => {
    const { CKEditor } = mod;
    return import('@ckeditor/ckeditor5-build-classic').then((editorMod) => {
      const ClassicEditor = editorMod.default;
      
      return function EditorComponent({ data, onChange, config }) {
        return (
          <CKEditor
            editor={ClassicEditor}
            data={data}
            onChange={onChange}
            config={config}
          />
        );
      };
    });
  });
}, {
  ssr: false,
  loading: () => (
    <div className="p-4 text-center text-gray-500">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
      Loading editor...
    </div>
  )
});

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [seoContent, setSeoContent] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [h1, setH1] = useState('');
  const [schema, setSchema] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [robots, setRobots] = useState('index, follow');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [twitterTitle, setTwitterTitle] = useState('');
  const [twitterDescription, setTwitterDescription] = useState('');
  const [twitterImage, setTwitterImage] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [seoLoading, setSeoLoading] = useState(false);
  const router = useRouter();

  // Handle client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchUsers = useCallback(async () => {
    if (!isClient) return;
    
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/auth/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users:', response.status);
        if (response.status === 401) {
          router.push('/login');
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [isClient, router]);

  useEffect(() => {
    if (isClient) {
      fetchUsers();
    }
  }, [isClient, fetchUsers]);

  const handleBlockUser = async (userId) => {
    if (!isClient) return;
    
    setActionLoading(prev => ({ ...prev, [userId]: true }));
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('/api/auth/manageUser', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, action: 'block' }),
      });

      if (response.ok) {
        await fetchUsers();
      } else {
        console.error('Failed to block user');
      }
    } catch (error) {
      console.error('Error blocking user:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleUnblockUser = async (userId) => {
    if (!isClient) return;
    
    setActionLoading(prev => ({ ...prev, [userId]: true }));
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('/api/auth/manageUser', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, action: 'unblock' }),
      });

      if (response.ok) {
        await fetchUsers();
      } else {
        console.error('Failed to unblock user');
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleSeoSubmit = async () => {
    if (!isClient) return;
    
    setSeoLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('/api/seo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page: 'homepage',
          seotitle: seoTitle,
          seodescription: seoDescription,
          h1,
          content: seoContent,
          metaKeywords: metaKeywords.split(',').map(k => k.trim()).filter(k => k),
          canonicalUrl,
          robots,
          ogTitle,
          ogDescription,
          ogImage,
          twitterTitle,
          twitterDescription,
          twitterImage,
          schema: schema,
        }),
      });

      if (response.ok) {
        alert('SEO content saved successfully!');
      } else {
        alert('Failed to save SEO content');
      }
    } catch (error) {
      console.error('Error saving SEO:', error);
      alert('Error saving SEO content');
    } finally {
      setSeoLoading(false);
    }
  };

  if (!isClient || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-blue-300 text-lg font-medium">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-black">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">🛡️</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Admin Control Panel</h1>
                <p className="text-blue-300">System Administration Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-blue-300">Administrator</p>
                <p className="text-xs text-gray-400">Full System Access</p>
              </div>
              <button 
                onClick={() => {
                  if (isClient) {
                    localStorage.removeItem('token');
                    router.push('/login');
                  }
                }}
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
        <div className="bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl shadow-2xl mb-8">
          <div className="border-b border-blue-500/20">
            <nav className="flex space-x-0 px-2 py-2">
              {[
                { id: 'users', label: 'User Management', icon: '👥', color: 'from-purple-600 to-blue-600' },
                { id: 'seo', label: 'SEO Management', icon: '🔍', color: 'from-green-600 to-teal-600' },
                { id: 'profiles', label: 'Profile Management', icon: '👤', color: 'from-pink-600 to-purple-600' }
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
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">User Management</h2>
                    <p className="text-blue-300">Monitor and manage all registered users</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/20 rounded-2xl px-6 py-3">
                    <span className="text-blue-300 text-sm font-medium">Total Users: </span>
                    <span className="text-white text-2xl font-bold">{users.length}</span>
                  </div>
                </div>

                {users.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl">👥</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">No Users Yet</h3>
                    <p className="text-blue-300">The system is ready for user registrations.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map(user => (
                      <div key={user._id} className="bg-gradient-to-br from-blue-800/20 to-purple-800/20 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">{user.email?.[0]?.toUpperCase() || 'U'}</span>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-white truncate max-w-[200px]">{user.email}</h3>
                              <p className="text-blue-300 text-sm capitalize">{user.role || 'visitor'}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className={`w-3 h-3 rounded-full ${
                              user.isBlocked ? 'bg-red-500' : 'bg-green-500 animate-pulse'
                            }`}></span>
                            <span className={`text-xs font-medium ${
                              user.isBlocked ? 'text-red-400' : 'text-green-400'
                            }`}>
                              {user.isBlocked ? 'Blocked' : 'Active'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between items-center">
                            <span className="text-blue-300 text-sm">Account Type</span>
                            <span className="text-white font-bold capitalize">{user.role || 'Visitor'}</span>
                          </div>
                          {user.agencyName && (
                            <div className="flex justify-between items-center">
                              <span className="text-blue-300 text-sm">Agency Name</span>
                              <span className="text-white font-bold truncate max-w-[120px]">{user.agencyName}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center">
                            <span className="text-blue-300 text-sm">Status</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              user.isBlocked 
                                ? 'bg-red-500/20 text-red-400' 
                                : 'bg-green-500/20 text-green-400'
                            }`}>
                              {user.isBlocked ? '🚫 Blocked' : '✅ Active'}
                            </span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => user.isBlocked ? handleUnblockUser(user._id) : handleBlockUser(user._id)}
                          disabled={actionLoading[user._id]}
                          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                            user.isBlocked
                              ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                              : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                          } ${actionLoading[user._id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {actionLoading[user._id] ? (
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <span>{user.isBlocked ? '✅' : '🚫'}</span>
                              <span>{user.isBlocked ? 'Unblock User' : 'Block User'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'seo' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">SEO Management</h2>
                  <p className="text-green-300">Optimize your website for search engines</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-800/20 to-teal-800/20 backdrop-blur-sm border border-green-500/20 rounded-2xl p-8 shadow-xl">
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-green-300 mb-3 flex items-center">
                          <span className="mr-2">🏷️</span>
                          SEO Title
                        </label>
                        <input
                          type="text"
                          placeholder="Enter SEO title"
                          value={seoTitle}
                          onChange={(e) => setSeoTitle(e.target.value)}
                          className="w-full px-4 py-3 bg-black/20 border border-green-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-green-300 mb-3 flex items-center">
                          <span className="mr-2">🏷️</span>
                          H1 Tag
                        </label>
                        <input
                          type="text"
                          placeholder="Enter H1 tag"
                          value={h1}
                          onChange={(e) => setH1(e.target.value)}
                          className="w-full px-4 py-3 bg-black/20 border border-green-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-green-300 mb-3 flex items-center">
                        <span className="mr-2">📝</span>
                        SEO Description
                      </label>
                      <textarea
                        placeholder="Enter SEO description"
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-black/20 border border-green-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-green-300 mb-3 flex items-center">
                          <span className="mr-2">🔑</span>
                          Meta Keywords
                        </label>
                        <input
                          type="text"
                          placeholder="keyword1, keyword2, keyword3"
                          value={metaKeywords}
                          onChange={(e) => setMetaKeywords(e.target.value)}
                          className="w-full px-4 py-3 bg-black/20 border border-green-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-green-300 mb-3 flex items-center">
                          <span className="mr-2">🔗</span>
                          Canonical URL
                        </label>
                        <input
                          type="url"
                          placeholder="https://example.com/"
                          value={canonicalUrl}
                          onChange={(e) => setCanonicalUrl(e.target.value)}
                          className="w-full px-4 py-3 bg-black/20 border border-green-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-green-300 mb-3 flex items-center">
                        <span className="mr-2">🤖</span>
                        Robots Meta
                      </label>
                      <select
                        value={robots}
                        onChange={(e) => setRobots(e.target.value)}
                        className="w-full px-4 py-3 bg-black/20 border border-green-500/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
                      >
                        <option className="bg-black" value="index, follow">index, follow</option>
                        <option className="bg-black" value="noindex, follow">noindex, follow</option>
                        <option className="bg-black" value="index, nofollow">index, nofollow</option>
                        <option className="bg-black" value="noindex, nofollow">noindex, nofollow</option>
                      </select>
                    </div>

                    <div className="border-t border-green-500/20 pt-8">
                      <h3 className="text-lg font-semibold text-green-300 mb-6 flex items-center">
                        <span className="mr-2">📘</span>
                        Open Graph (Facebook)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-green-300 mb-3">OG Title</label>
                          <input
                            type="text"
                            placeholder="Open Graph title"
                            value={ogTitle}
                            onChange={(e) => setOgTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-black/20 border border-green-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-green-300 mb-3">OG Image URL</label>
                          <input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            value={ogImage}
                            onChange={(e) => setOgImage(e.target.value)}
                            className="w-full px-4 py-3 bg-black/20 border border-green-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-green-300 mb-3">OG Description</label>
                        <textarea
                          placeholder="Open Graph description"
                          value={ogDescription}
                          onChange={(e) => setOgDescription(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 bg-black/20 border border-green-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200 resize-none"
                        />
                      </div>
                    </div>

                    <div className="border-t border-green-500/20 pt-8">
                      <h3 className="text-lg font-semibold text-green-300 mb-6 flex items-center">
                        <span className="mr-2">🐦</span>
                        Twitter Cards
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-green-300 mb-3">Twitter Title</label>
                          <input
                            type="text"
                            placeholder="Twitter card title"
                            value={twitterTitle}
                            onChange={(e) => setTwitterTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-black/20 border border-green-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-green-300 mb-3">Twitter Image URL</label>
                          <input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            value={twitterImage}
                            onChange={(e) => setTwitterImage(e.target.value)}
                            className="w-full px-4 py-3 bg-black/20 border border-green-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-green-300 mb-3">Twitter Description</label>
                        <textarea
                          placeholder="Twitter card description"
                          value={twitterDescription}
                          onChange={(e) => setTwitterDescription(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 bg-black/20 border border-green-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200 resize-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-green-300 mb-3 flex items-center">
                        <span className="mr-2">✏️</span>
                        SEO Content
                      </label>
                      <div className="bg-black/20 border border-green-500/20 rounded-xl overflow-hidden">
                        <EditorWrapper
                          data={seoContent}
                          onChange={(event, editor) => setSeoContent(editor.getData())}
                          config={{
                            toolbar: [
                              'heading', '|',
                              'bold', 'italic', 'link', '|',
                              'bulletedList', 'numberedList', '|',
                              'outdent', 'indent', '|',
                              'blockQuote', 'insertTable', '|',
                              'undo', 'redo'
                            ]
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-green-300 mb-3 flex items-center">
                        <span className="mr-2">📦</span>
                        Schema (JSON-LD)
                      </label>
                      <textarea
                        placeholder="Enter JSON-LD schema markup"
                        value={schema}
                        onChange={(e) => setSchema(e.target.value)}
                        rows={6}
                        className="w-full px-4 py-3 bg-black/20 border border-green-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200 resize-none font-mono text-sm"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleSeoSubmit}
                        disabled={seoLoading}
                        className={`inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium rounded-xl shadow-lg hover:shadow-green-500/25 transition-all duration-200 space-x-2 ${
                          seoLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {seoLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <span className="text-lg">💾</span>
                            <span>Save SEO Content</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profiles' && <ProfileManagement />}
          </div>
        </div>
      </div>
    </div>
  );
}