'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { ResourceCard } from '@/components/ResourceCard';
import type { UserProfileData } from '@/lib/types';

type TabType = 'path' | 'videos' | 'articles' | 'communities' | 'saved';

const STYLE_TO_TYPE: Record<string, string> = {
  video: 'video',
  reading: 'article',
  community: 'community',
  projects: 'video', // projects learners get video resources as closest match
};

const BUDGET_TO_PAID: Record<string, string[]> = {
  free: ['free'],
  low: ['free', 'freemium'],
  medium: ['free', 'freemium', 'paid'],
  'no-limit': ['free', 'freemium', 'paid'],
};

export default function HobbyPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const hobbySlug = params.hobbySlug as string;
  const isPersonalized = searchParams.get('personalized') === 'true';

  const [activeTab, setActiveTab] = useState<TabType>('path');
  const [hobby, setHobby] = useState<Record<string, unknown> | null>(null);
  const [resources, setResources] = useState<Record<string, unknown>[]>([]);
  const [userLevel, setUserLevel] = useState('beginner');
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hobbiesRes, userRes, recRes, profileRes] = await Promise.all([
          fetch('/api/hobbies'),
          fetch('/api/auth/user'),
          fetch(`/api/recommendations?hobby=${hobbySlug}`),
          fetch('/api/profile'),
        ]);

        const allHobbies = await hobbiesRes.json();
        const foundHobby = Array.isArray(allHobbies)
          ? allHobbies.find((h: Record<string, unknown>) => h.slug === hobbySlug)
          : null;
        setHobby(foundHobby ?? null);

        if (userRes.ok) {
          const user = await userRes.json() as { hobbies?: Array<{ hobbyId: string; level: string }> };
          const userHobby = user.hobbies?.find((h) => h.hobbyId === (foundHobby as Record<string, string>)?.id);
          if (userHobby) setUserLevel(userHobby.level);
        }

        const recs = await recRes.json();
        setResources(Array.isArray(recs) ? recs : []);

        if (profileRes.ok) {
          setProfile(await profileRes.json() as UserProfileData);
        }
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
        if (typeof r.timeMinutes !== 'number') return false;
        return r.timeMinutes >= min && r.timeMinutes <= max;
      });
    }
    return filtered;
  };

  // Personalized top-5 filter based on profile
  const getPersonalizedResources = (): Record<string, unknown>[] => {
    if (!profile) return [];
    const allowedTypes = STYLE_TO_TYPE[profile.learningStyle]
      ? [STYLE_TO_TYPE[profile.learningStyle]]
      : ['video', 'article'];
    const allowedPaid = BUDGET_TO_PAID[profile.budget] ?? ['free', 'freemium', 'paid'];
    const userSkillLevel = profile.skillLevel === 'some' ? 'beginner' : profile.skillLevel;

    return resources
      .filter((r) => {
        const typeMatch = allowedTypes.includes(r.type as string);
        const budgetMatch = allowedPaid.includes(r.freePaid as string);
        const levelMatch = r.level === userSkillLevel || r.level === 'beginner';
        return typeMatch && budgetMatch && levelMatch;
      })
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading hobby...</p>
      </div>
    );
  }

  if (!hobby) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Hobby not found</p>
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

  const currentResources = tabResources[activeTab] ?? [];
  const personalizedResources = isPersonalized ? getPersonalizedResources() : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container-custom py-8">
          <Link href="/dashboard" className="text-primary hover:underline mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-5xl">{hobby.icon as string}</div>
            <div>
              <h1 className="text-4xl font-bold">{hobby.name as string}</h1>
              <p className="text-gray-600">
                Level: <span className="font-semibold capitalize">{userLevel}</span>
                {isPersonalized && profile && (
                  <span className="ml-3 badge">✨ Personalized for you</span>
                )}
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
              {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                <div key={level} className="card p-8">
                  <h3 className="text-xl font-bold mb-4 capitalize">
                    {level === 'beginner' && '🌱'}{level === 'intermediate' && '🌿'}{level === 'advanced' && '🌳'} {level}
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
                            .map((r) => r.title as string)
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

            {currentResources.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No resources found for these filters</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentResources.map((resource) => (
                  <ResourceCard
                    key={resource.id as string}
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

        {/* Personalized Top-5 Section */}
        {isPersonalized && personalizedResources.length > 0 && (
          <div className="mt-16">
            <div className="border-t pt-12">
              <h2 className="text-2xl font-bold mb-2">✨ Top 5 Resources for You</h2>
              <p className="text-gray-500 mb-8">
                Filtered by your {profile?.learningStyle} learning style, {profile?.budget} budget, and skill level.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {personalizedResources.map((resource) => (
                  <ResourceCard
                    key={resource.id as string}
                    resource={resource}
                    onStatusChange={() => setResources([...resources])}
                    onFeedback={() => setResources([...resources])}
                    onSave={() => setResources([...resources])}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {isPersonalized && !profile && (
          <div className="mt-16 border-t pt-12 text-center">
            <p className="text-gray-500 mb-4">Complete your profile to see personalized resources.</p>
            <Link href="/onboarding" className="btn-primary">Set up your profile</Link>
          </div>
        )}
      </div>
    </div>
  );
}
