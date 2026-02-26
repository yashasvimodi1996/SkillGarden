'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { RankedHobby } from '@/lib/types';

interface HobbyFromAPI {
  id: string;
  slug: string;
  name: string;
}

export default function RecommendationsPage() {
  const [ranked, setRanked] = useState<RankedHobby[]>([]);
  const [hobbies, setHobbies] = useState<HobbyFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const [adding, setAdding] = useState<Record<string, boolean>>({});

  useEffect(() => {
    Promise.all([
      fetch('/api/hobby-recommendations').then((r) => r.json()),
      fetch('/api/hobbies').then((r) => r.json()),
    ])
      .then(([recs, allHobbies]) => {
        setRanked(Array.isArray(recs) ? recs : []);
        setHobbies(Array.isArray(allHobbies) ? allHobbies : []);
      })
      .catch(() => {
        setRanked([]);
        setHobbies([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddToDashboard = async (slug: string) => {
    const hobby = hobbies.find((h) => h.slug === slug);
    if (!hobby) return;
    setAdding((prev) => ({ ...prev, [slug]: true }));
    try {
      await fetch('/api/dashboard-hobby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hobbyId: hobby.id, level: 'beginner' }),
      });
      setAdded((prev) => ({ ...prev, [slug]: true }));
    } catch {
      // ignore
    } finally {
      setAdding((prev) => ({ ...prev, [slug]: false }));
    }
  };

  const scorePercent = (score: number, max: number) => Math.round((score / max) * 100);

  const rankLabel = (i: number) => {
    if (i === 0) return { emoji: '🥇', label: 'Best Match', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' };
    if (i === 1) return { emoji: '🥈', label: 'Great Fit', color: 'text-gray-500 bg-gray-50 border-gray-200' };
    return { emoji: '🥉', label: 'Good Match', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container-custom py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">🌿 HobbySpring</Link>
          <Link href="/dashboard" className="btn-outline">Go to Dashboard</Link>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Your Hobby Matches 🎯</h1>
            <p className="text-xl text-gray-600">
              Based on your goals, lifestyle, and preferences — here are your top picks.
            </p>
          </div>

          {loading && (
            <div className="text-center py-20">
              <div className="text-4xl mb-4 animate-pulse">🌿</div>
              <p className="text-gray-500">Calculating your matches...</p>
            </div>
          )}

          {!loading && ranked.length === 0 && (
            <div className="text-center py-20 card p-12">
              <p className="text-gray-500 mb-6">No recommendations available yet.</p>
              <Link href="/onboarding" className="btn-primary">Complete your profile →</Link>
            </div>
          )}

          {!loading && ranked.length > 0 && (
            <div className="space-y-6">
              {ranked.map((hobby, i) => {
                const { emoji, label, color } = rankLabel(i);
                const pct = scorePercent(hobby.score, hobby.maxScore);
                const isAdded = added[hobby.slug];
                const isAdding = adding[hobby.slug];

                return (
                  <div key={hobby.slug} className="card p-8 hover:shadow-lg transition-shadow">
                    {/* Header row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <span className="text-5xl">{hobby.icon}</span>
                        <div>
                          <div className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border mb-1 ${color}`}>
                            {emoji} {label}
                          </div>
                          <h2 className="text-2xl font-bold">{hobby.name}</h2>
                        </div>
                      </div>
                      {/* Score */}
                      <div className="text-right">
                        <div className="text-3xl font-bold text-primary">{pct}%</div>
                        <div className="text-xs text-gray-400">match score</div>
                      </div>
                    </div>

                    {/* Score bar */}
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    {/* Why this fits you */}
                    {hobby.reasons.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                          Why this fits you
                        </h3>
                        <ul className="space-y-2">
                          {hobby.reasons.map((reason, ri) => (
                            <li key={ri} className="flex items-start gap-2 text-gray-700">
                              <span className="text-primary mt-0.5 font-bold">✓</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 flex-wrap">
                      <Link
                        href={`/h/${hobby.slug}?personalized=true`}
                        className="btn-primary px-6 py-2"
                      >
                        View tailored plan →
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleAddToDashboard(hobby.slug)}
                        disabled={isAdded || isAdding}
                        className={`px-6 py-2 rounded-lg border-2 font-medium transition-all ${
                          isAdded
                            ? 'border-green-400 bg-green-50 text-green-700 cursor-default'
                            : 'btn-outline'
                        }`}
                      >
                        {isAdded ? '✓ Added to Dashboard' : isAdding ? 'Adding...' : '+ Add to Dashboard'}
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Bottom CTA */}
              <div className="text-center pt-6">
                <p className="text-gray-500 mb-4">Want to see your full hobby library?</p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Link href="/dashboard" className="btn-primary px-8 py-3">Go to Dashboard</Link>
                  <Link href="/" className="btn-outline px-8 py-3">Browse all hobbies</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
