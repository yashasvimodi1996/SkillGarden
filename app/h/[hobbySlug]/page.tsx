'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ResourceCard } from '@/components/ResourceCard';

type TabType = 'path' | 'videos' | 'articles' | 'communities' | 'saved';

export default function HobbyPage() {
  const params = useParams();
  const hobbySlug = params.hobbySlug as string;

  const [activeTab, setActiveTab] = useState<TabType>('path');
  const [hobby, setHobby] = useState<any>(null);
  const [resources, setResources] = useState<any[]>([]);
  const [userLevel, setUserLevel] = useState('beginner');
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all hobbies
        const hobbiesRes = await fetch('/api/hobbies');
        const allHobbies = await hobbiesRes.json();
        const hobby = allHobbies.find((h: any) => h.slug === hobbySlug);
        setHobby(hobby);

        // Get user level for this hobby
        const userRes = await fetch('/api/auth/user');
        if (userRes.ok) {
          const user = await userRes.json();
          const userHobby = user.hobbies?.find((h: any) => h.hobbyId === hobby?.id);
          if (userHobby) {
            setUserLevel(userHobby.level);
          }
        }

        // Fetch recommendations
        const recRes = await fetch(`/api/recommendations?hobby=${hobbySlug}`);
        const recs = await recRes.json();
        setResources(recs);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hobbySlug]);

  const filterResources = (type?: string) => {
    let filtered = resources;

    if (type) {
      filtered = filtered.filter((r) => r.type === type);
    } else if (activeTab === 'saved') {
      filtered = filtered.filter((r) => r.isSaved);
    }

    if (selectedLevel) {
      filtered = filtered.filter((r) => r.level === selectedLevel);
    }

    if (selectedTime) {
      const [min, max] = selectedTime.split('-').map(Number);
      filtered = filtered.filter((r) => {
        if (!r.timeMinutes) return false;
        return r.timeMinutes >= min && r.timeMinutes <= max;
      });
    }

    return filtered;
  };

  if (loading) {
    return (
      <div className="min-h-screen container-custom flex items-center justify-center">
        <p>Loading hobby...</p>
      </div>
    );
  }

  if (!hobby) {
    return (
      <div className="min-h-screen container-custom flex items-center justify-center">
        <p>Hobby not found</p>
      </div>
    );
  }

  const tabResources = {
    path: resources,
    videos: filterResources('video'),
    articles: filterResources('article'),
    communities: filterResources('community'),
    saved: filterResources(),
  };

  const currentResources = tabResources[activeTab] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container-custom py-8">
          <Link href="/dashboard" className="text-primary hover:underline mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-5xl">{hobby.icon}</div>
            <div>
              <h1 className="text-4xl font-bold">{hobby.name}</h1>
              <p className="text-gray-600">
                Level: <span className="font-semibold capitalize">{userLevel}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="container-custom overflow-x-auto">
          <div className="flex gap-0">
            {(['path', 'videos', 'articles', 'communities', 'saved'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium border-b-2 whitespace-nowrap capitalize ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'path' && '🗺️ Path'}
                {tab === 'videos' && '📺 Videos'}
                {tab === 'articles' && '📖 Articles'}
                {tab === 'communities' && '👥 Communities'}
                {tab === 'saved' && `❤️ Saved (${resources.filter((r) => r.isSaved).length})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-12">
        {/* Learning Path Tab */}
        {activeTab === 'path' && (
          <div>
            <h2 className="text-2xl font-bold mb-8">Learning Path</h2>
            <div className="space-y-8">
              {['beginner', 'intermediate', 'advanced'].map((level) => (
                <div key={level} className="card p-8">
                  <h3 className="text-xl font-bold mb-4 capitalize">
                    {level === 'beginner' && '🌱'} {level === 'intermediate' && '🌿'}{' '}
                    {level === 'advanced' && '🌳'} {level}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {level === 'beginner' && 'Get started with the basics and fundamentals'}
                    {level === 'intermediate' && 'Build on your foundation and explore deeper topics'}
                    {level === 'advanced' && 'Master advanced techniques and specialized skills'}
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-gray-50 p-4 rounded">
                        <div className="font-bold mb-2">Module {i}</div>
                        <p className="text-sm text-gray-600">
                          {resources
                            .filter((r) => r.level === level)
                            .slice((i - 1) * 2, i * 2)
                            .map((r) => r.title)
                            .join(', ') || 'No resources yet'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resource Tabs */}
        {activeTab !== 'path' && (
          <div>
            {/* Filters */}
            <div className="mb-8 flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Level</label>
                <select
                  value={selectedLevel || ''}
                  onChange={(e) => setSelectedLevel(e.target.value || null)}
                  className="border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">All Levels</option>
                  <option value="beginner">🌱 Beginner</option>
                  <option value="intermediate">🌿 Intermediate</option>
                  <option value="advanced">🌳 Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Duration</label>
                <select
                  value={selectedTime || ''}
                  onChange={(e) => setSelectedTime(e.target.value || null)}
                  className="border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Any Duration</option>
                  <option value="0-15">5-15 minutes</option>
                  <option value="15-45">15-45 minutes</option>
                  <option value="45-1000">45+ minutes</option>
                </select>
              </div>
            </div>

            {/* Resources Grid */}
            {currentResources.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No resources found for these filters</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onStatusChange={() => setResources([...resources])}
                    onFeedback={() => setResources([...resources])}
                    onSave={() => setResources([...resources])}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
