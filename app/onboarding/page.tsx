'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function OnboardingPage() {
  const router = useRouter();
  const [hobbies, setHobbies] = useState<any[]>([]);
  const [selected, setSelected] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        const res = await fetch('/api/hobbies');
        const data = await res.json();
        setHobbies(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch hobbies:', error);
        setHobbies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHobbies();
  }, []);

  const toggleHobby = (hobbyId: string) => {
    setSelected((prev) => {
      const newSelected = { ...prev };
      if (newSelected[hobbyId]) {
        delete newSelected[hobbyId];
      } else {
        newSelected[hobbyId] = {
          level: 'beginner',
          goals: '',
        };
      }
      return newSelected;
    });
  };

  const updateLevel = (hobbyId: string, level: string) => {
    setSelected((prev) => ({
      ...prev,
      [hobbyId]: {
        ...prev[hobbyId],
        level,
      },
    }));
  };

  const updateGoals = (hobbyId: string, goals: string) => {
    setSelected((prev) => ({
      ...prev,
      [hobbyId]: {
        ...prev[hobbyId],
        goals,
      },
    }));
  };

  const handleSubmit = async () => {
    const hobbyIds = Object.keys(selected);
    const levels = hobbyIds.map((id) => selected[id].level);
    const goals = hobbyIds.map((id) => selected[id].goals || null);

    try {
      // First login
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `user${Date.now()}@hobbyspring.local`,
          name: 'New User',
        }),
      });

      // Then onboard
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hobbyIds, levels, goals }),
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Onboarding failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen container-custom flex items-center justify-center">
        <p>Loading hobbies...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      {/* Header */}
      <div className="container-custom py-8">
        <Link href="/" className="text-2xl font-bold text-primary">
          🌿 HobbySpring
        </Link>
      </div>

      {/* Main Content */}
      <div className="container-custom py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Welcome to HobbySpring!</h1>
          <p className="text-xl text-gray-600 mb-12">
            Let's set up your hobbies so we can personalize your learning experience.
          </p>

          {/* Step 1: Select Hobbies */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Step 1: Select 1-3 Hobbies</h2>
            {hobbies.length === 0 && (
              <p className="text-gray-500 mb-4">No hobbies available yet. The database may still be loading.</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {hobbies.map((hobby) => (
                <div
                  key={hobby.id}
                  onClick={() => toggleHobby(hobby.id)}
                  className={`card p-6 cursor-pointer transition-all ${
                    selected[hobby.id]
                      ? 'ring-2 ring-primary bg-primary/5'
                      : 'hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      checked={!!selected[hobby.id]}
                      readOnly
                      className="mt-1 mr-4 w-5 h-5"
                    />
                    <div>
                      <div className="text-3xl mb-2">{hobby.icon}</div>
                      <h3 className="font-bold text-lg">{hobby.name}</h3>
                      <p className="text-sm text-gray-600">
                        {hobby.resources.length} resources
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Set Levels & Goals */}
          {Object.keys(selected).length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Step 2: Set Your Level & Goals</h2>
              <div className="space-y-8">
                {Object.keys(selected).map((hobbyId) => {
                  const hobby = hobbies.find((h) => h.id === hobbyId);
                  return (
                    <div key={hobbyId} className="card p-6">
                      <h3 className="text-xl font-bold mb-4">{hobby.name}</h3>

                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                          Skill Level
                        </label>
                        <select
                          value={selected[hobbyId].level}
                          onChange={(e) => updateLevel(hobbyId, e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        >
                          <option value="beginner">🌱 Beginner - Just starting out</option>
                          <option value="intermediate">🌿 Intermediate - Some experience</option>
                          <option value="advanced">🌳 Advanced - Quite experienced</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Personal Goals (optional)
                        </label>
                        <textarea
                          value={selected[hobbyId].goals}
                          onChange={(e) => updateGoals(hobbyId, e.target.value)}
                          placeholder="e.g., Learn to grow herbs, Get stronger, Bake a cake, etc."
                          className="w-full border border-gray-300 rounded-lg px-4 py-2"
                          rows={2}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <Link href="/" className="btn-secondary">
              Back
            </Link>
            <button
              onClick={handleSubmit}
              disabled={Object.keys(selected).length === 0}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              Get Started →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
