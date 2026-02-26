'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { RankedHobby, UserProfileData } from '@/lib/types';

interface UserHobby {
  hobbyId: string;
  hobby: {
    id: string;
    name: string;
    slug: string;
    icon: string;
    description: string;
  };
  level: string;
  goals: string | null;
}

interface User {
  id: string;
  email: string;
  name: string;
  hobbies: UserHobby[];
}

const LEARNING_LABELS: Record<string, string> = {
  video: '📺 Video',
  reading: '📖 Reading',
  projects: '🔨 Projects',
  community: '👥 Community',
};

const BUDGET_LABELS: Record<string, string> = {
  free: '🆓 Free',
  low: '💵 Low',
  medium: '💳 Medium',
  'no-limit': '💰 No limit',
};

const SKILL_LABELS: Record<string, string> = {
  beginner: '🌱 Beginner',
  some: '🌿 Some exp',
  intermediate: '🌿 Intermediate',
  advanced: '🌳 Advanced',
};

const SCHEDULE_LABELS: Record<string, string> = {
  weekday: '📅 Weekdays',
  weekend: '🏖️ Weekends',
  flexible: '🔄 Flexible',
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [recommendations, setRecommendations] = useState<RankedHobby[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [userRes, profileRes] = await Promise.all([
          fetch('/api/auth/user'),
          fetch('/api/profile'),
        ]);

        if (userRes.ok) {
          setUser(await userRes.json() as User);
        }

        if (profileRes.ok) {
          const profileData = await profileRes.json() as UserProfileData;
          setProfile(profileData);
          const recRes = await fetch('/api/hobby-recommendations');
          if (recRes.ok) {
            const recs = await recRes.json() as RankedHobby[];
            setRecommendations(Array.isArray(recs) ? recs : []);
          }
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (!user || user.hobbies.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
        <div className="container-custom py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to HobbySpring!</h1>
            <p className="text-xl text-gray-600 mb-8">Let&apos;s get you started.</p>
            <Link href="/onboarding" className="btn-primary text-lg px-8 py-4 inline-block">
              Choose Your Hobbies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow py-6">
        <div className="container-custom flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">🌿 HobbySpring</h1>
          <div className="flex gap-4 items-center">
            <span className="text-gray-600">👋 {user.name}</span>
            <Link href="/saved" className="btn-outline">Saved</Link>
          </div>
        </div>
      </div>

      <div className="container-custom py-12 space-y-12">

        {/* Profile Summary */}
        {profile && (
          <section className="card p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Your Profile</h2>
              <Link href="/onboarding" className="text-sm text-primary hover:underline font-medium">
                Edit answers →
              </Link>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="badge">
                ⏰ {profile.timeAvailabilityMinutes >= 60
                  ? `${Math.round((profile.timeAvailabilityMinutes / 60) * 10) / 10} hrs/week`
                  : `${profile.timeAvailabilityMinutes} min/week`}
              </span>
              {LEARNING_LABELS[profile.learningStyle] && (
                <span className="badge">{LEARNING_LABELS[profile.learningStyle]}</span>
              )}
              {BUDGET_LABELS[profile.budget] && (
                <span className="badge">{BUDGET_LABELS[profile.budget]}</span>
              )}
              {SKILL_LABELS[profile.skillLevel] && (
                <span className="badge">{SKILL_LABELS[profile.skillLevel]}</span>
              )}
              {SCHEDULE_LABELS[profile.schedulePreference] && (
                <span className="badge">{SCHEDULE_LABELS[profile.schedulePreference]}</span>
              )}
              {profile.motivations.slice(0, 3).map((m) => (
                <span key={m} className="badge capitalize">{m.replace('-', ' ')}</span>
              ))}
            </div>
          </section>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Recommended for You</h2>
              <Link href="/recommendations" className="text-sm text-primary hover:underline font-medium">
                See full analysis →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {recommendations.map((hobby, i) => {
                const pct = Math.round((hobby.score / hobby.maxScore) * 100);
                return (
                  <Link
                    key={hobby.slug}
                    href={`/h/${hobby.slug}?personalized=true`}
                    className="card p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-4xl">{hobby.icon}</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        i === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {i === 0 ? '🥇 Top' : i === 1 ? '🥈 #2' : '🥉 #3'}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{hobby.name}</h3>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-sm text-gray-500">{pct}% match</p>
                    {hobby.reasons[0] && (
                      <p className="text-xs text-gray-400 mt-2 line-clamp-2">✓ {hobby.reasons[0]}</p>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Your Hobbies */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Your Hobbies</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {user.hobbies.map((userHobby) => (
              <Link
                key={userHobby.hobbyId}
                href={`/h/${userHobby.hobby.slug}`}
                className="card p-8 hover:shadow-xl transition-all"
              >
                <div className="text-5xl mb-4">{userHobby.hobby.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{userHobby.hobby.name}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Level: <span className="font-semibold capitalize">{userHobby.level}</span>
                </p>
                {userHobby.goals && (
                  <p className="text-sm text-gray-700 mb-4 italic">Goal: {userHobby.goals}</p>
                )}
                <p className="text-primary font-semibold">Explore resources →</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Browse All */}
        <section className="p-8 bg-white rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Explore Other Hobbies</h3>
          <p className="text-gray-600 mb-6">Not in your list yet? Check out all hobbies:</p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/" className="btn-primary">Browse All Hobbies</Link>
            {!profile && (
              <Link href="/onboarding" className="btn-outline">Get personalized recommendations</Link>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
