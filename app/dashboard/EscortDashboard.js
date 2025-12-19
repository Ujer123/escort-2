'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEscortData } from '@/lib/hooks/useEscortData';
import LoadingSpinner from './components/LoadingSpinner';
import DashboardHeader from './components/DashboardHeader';
import TabNavigation from './components/TabNavigation';
import OverviewTab from './components/OverviewTab';
import ProfilesTab from './components/ProfilesTab';
import AnalyticsTab from './components/AnalyticsTab';

export default function EscortDashboard() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();
  const { user, services, loading, refreshServices } = useEscortData();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/login');
  };

  const handleAddProfileClick = () => {
    setActiveTab('profiles');
    setShowAddForm(true);
  };

  const tabs = [
    { id: 'overview', label: 'Dashboard Overview', shortLabel: 'Overview', icon: '📊', color: 'from-purple-600 to-pink-600' },
    { id: 'profiles', label: 'My Profiles', shortLabel: 'Profiles', icon: '💎', color: 'from-pink-600 to-purple-600' },
    { id: 'analytics', label: 'Analytics', shortLabel: 'Analytics', icon: '📈', color: 'from-blue-600 to-purple-600' }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-gray-900 to-black">
      <DashboardHeader user={user} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="p-4 sm:p-8">
          {activeTab === 'overview' && (
            <OverviewTab
              services={services}
              onAddProfileClick={handleAddProfileClick}
            />
          )}

          {activeTab === 'profiles' && (
            <ProfilesTab
              services={services}
              showAddForm={showAddForm}
              onAddProfile={setShowAddForm}
              refreshServices={refreshServices}
            />
          )}

          {activeTab === 'analytics' && <AnalyticsTab />}
        </div>
      </div>
    </div>
  );
}
