'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { UserProfileData } from '@/lib/types';

const STORAGE_KEY = 'hobbyspring_onboarding_v1';
const TOTAL_STEPS = 5;

const MOTIVATIONS = [
  { value: 'stress-relief', label: '😌 Stress relief' },
  { value: 'creativity', label: '🎨 Creativity' },
  { value: 'fitness', label: '💪 Fitness' },
  { value: 'social', label: '👥 Social connection' },
  { value: 'skill-building', label: '📈 Skill building' },
  { value: 'mindfulness', label: '🧘 Mindfulness' },
  { value: 'career', label: '💼 Career growth' },
  { value: 'fun', label: '🎉 Just for fun' },
];

interface OnboardingState {
  // Step 1: Hobbies
  selectedHobbies: Record<string, { level: string; goals: string }>;
  // Step 3: Motivations + Time
  motivations: string[];
  timeAvailabilityMinutes: number;
  schedulePreference: string;
  // Step 4: Learning + Budget
  learningStyle: string;
  budget: string;
  // Step 5: Environment + Lifestyle
  environment: string;
  socialPreference: string;
  intensity: string;
  commitmentHorizon: string;
}

const defaultState: OnboardingState = {
  selectedHobbies: {},
  motivations: [],
  timeAvailabilityMinutes: 180,
  schedulePreference: 'flexible',
  learningStyle: 'video',
  budget: 'free',
  environment: 'house',
  socialPreference: 'both',
  intensity: 'gentle',
  commitmentHorizon: 'exploring',
};

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              i + 1 < current
                ? 'bg-primary text-white'
                : i + 1 === current
                ? 'bg-primary text-white ring-4 ring-primary/30'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {i + 1 < current ? '✓' : i + 1}
          </div>
          {i < total - 1 && (
            <div className={`h-0.5 w-8 mx-1 ${i + 1 < current ? 'bg-primary' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
      <span className="ml-2 text-sm text-gray-500">Step {current} of {total}</span>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [hobbies, setHobbies] = useState<Array<{ id: string; name: string; icon: string; resources: { id: string }[] }>>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<OnboardingState>(defaultState);

  // Load hobbies from API
  useEffect(() => {
    fetch('/api/hobbies')
      .then((r) => r.json())
      .then((data) => setHobbies(Array.isArray(data) ? data : []))
      .catch(() => setHobbies([]))
      .finally(() => setLoading(false));
  }, []);

  // Restore partial progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<OnboardingState>;
        setForm((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  const toggleHobby = (hobbyId: string) => {
    setForm((prev) => {
      const next = { ...prev.selectedHobbies };
      if (next[hobbyId]) {
        delete next[hobbyId];
      } else {
        next[hobbyId] = { level: 'beginner', goals: '' };
      }
      return { ...prev, selectedHobbies: next };
    });
  };

  const updateHobbyLevel = (hobbyId: string, level: string) => {
    setForm((prev) => ({
      ...prev,
      selectedHobbies: { ...prev.selectedHobbies, [hobbyId]: { ...prev.selectedHobbies[hobbyId], level } },
    }));
  };

  const updateHobbyGoals = (hobbyId: string, goals: string) => {
    setForm((prev) => ({
      ...prev,
      selectedHobbies: { ...prev.selectedHobbies, [hobbyId]: { ...prev.selectedHobbies[hobbyId], goals } },
    }));
  };

  const toggleMotivation = (value: string) => {
    setForm((prev) => ({
      ...prev,
      motivations: prev.motivations.includes(value)
        ? prev.motivations.filter((m) => m !== value)
        : [...prev.motivations, value],
    }));
  };

  const canAdvance = (): boolean => {
    if (step === 1) return Object.keys(form.selectedHobbies).length > 0;
    if (step === 3) return form.motivations.length > 0;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const hobbyIds = Object.keys(form.selectedHobbies);
      const levels = hobbyIds.map((id) => form.selectedHobbies[id].level);
      const goals = hobbyIds.map((id) => form.selectedHobbies[id].goals || null);

      // 1. Create/find user
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: `user${Date.now()}@hobbyspring.local`, name: 'User' }),
      });

      // 2. Save hobby selections
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hobbyIds, levels, goals }),
      });

      // 3. Save profile
      const profileData: UserProfileData = {
        motivations: form.motivations,
        timeAvailabilityMinutes: form.timeAvailabilityMinutes,
        schedulePreference: form.schedulePreference as UserProfileData['schedulePreference'],
        skillLevel: form.selectedHobbies[hobbyIds[0]]?.level === 'advanced'
          ? 'advanced'
          : form.selectedHobbies[hobbyIds[0]]?.level === 'intermediate'
          ? 'intermediate'
          : 'beginner',
        learningStyle: form.learningStyle as UserProfileData['learningStyle'],
        budget: form.budget as UserProfileData['budget'],
        environment: form.environment as UserProfileData['environment'],
        socialPreference: form.socialPreference as UserProfileData['socialPreference'],
        intensity: form.intensity as UserProfileData['intensity'],
        commitmentHorizon: form.commitmentHorizon as UserProfileData['commitmentHorizon'],
      };

      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      localStorage.removeItem(STORAGE_KEY);
      router.push('/recommendations');
    } catch (error) {
      console.error('Onboarding failed:', error);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <div className="container-custom py-8">
        <Link href="/" className="text-2xl font-bold text-primary">🌿 HobbySpring</Link>
      </div>

      <div className="container-custom py-4 pb-16">
        <div className="max-w-2xl mx-auto">
          <StepIndicator current={step} total={TOTAL_STEPS} />

          {/* ── Step 1: Select Hobbies ── */}
          {step === 1 && (
            <div>
              <h1 className="text-3xl font-bold mb-2">Choose Your Hobbies</h1>
              <p className="text-gray-600 mb-8">Pick 1–3 hobbies you want to explore.</p>
              {hobbies.length === 0 && (
                <p className="text-gray-400 mb-4">No hobbies available — database may still be loading.</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {hobbies.map((hobby) => (
                  <div
                    key={hobby.id}
                    onClick={() => toggleHobby(hobby.id)}
                    className={`card p-6 cursor-pointer transition-all ${
                      form.selectedHobbies[hobby.id]
                        ? 'ring-2 ring-primary bg-primary/5'
                        : 'hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        readOnly
                        checked={!!form.selectedHobbies[hobby.id]}
                        className="mt-1 w-5 h-5 accent-primary"
                      />
                      <div>
                        <div className="text-3xl mb-1">{hobby.icon}</div>
                        <h3 className="font-bold text-lg">{hobby.name}</h3>
                        <p className="text-sm text-gray-500">{hobby.resources.length} resources</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 2: Levels & Goals ── */}
          {step === 2 && (
            <div>
              <h1 className="text-3xl font-bold mb-2">Set Your Level & Goals</h1>
              <p className="text-gray-600 mb-8">Tell us where you are with each hobby.</p>
              <div className="space-y-6">
                {Object.keys(form.selectedHobbies).map((hobbyId) => {
                  const hobby = hobbies.find((h) => h.id === hobbyId);
                  if (!hobby) return null;
                  return (
                    <div key={hobbyId} className="card p-6">
                      <h3 className="text-xl font-bold mb-4">{hobby.icon} {hobby.name}</h3>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Skill Level</label>
                        <select
                          value={form.selectedHobbies[hobbyId].level}
                          onChange={(e) => updateHobbyLevel(hobbyId, e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        >
                          <option value="beginner">🌱 Beginner — Just starting out</option>
                          <option value="intermediate">🌿 Intermediate — Some experience</option>
                          <option value="advanced">🌳 Advanced — Quite experienced</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Goals (optional)</label>
                        <textarea
                          value={form.selectedHobbies[hobbyId].goals}
                          onChange={(e) => updateHobbyGoals(hobbyId, e.target.value)}
                          placeholder="e.g., Learn to grow herbs, Get stronger..."
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

          {/* ── Step 3: Motivations + Time ── */}
          {step === 3 && (
            <div>
              <h1 className="text-3xl font-bold mb-2">What Drives You?</h1>
              <p className="text-gray-600 mb-8">This helps us find hobbies that truly fit your life.</p>

              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3">Your motivations (select all that apply)</h2>
                <div className="grid grid-cols-2 gap-3">
                  {MOTIVATIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleMotivation(value)}
                      className={`px-4 py-3 rounded-lg border-2 text-left font-medium transition-all ${
                        form.motivations.includes(value)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {form.motivations.length === 0 && (
                  <p className="text-red-500 text-sm mt-2">Please select at least one motivation.</p>
                )}
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-1">Time available per week</h2>
                <p className="text-3xl font-bold text-primary mb-3">
                  {form.timeAvailabilityMinutes >= 60
                    ? `${Math.round(form.timeAvailabilityMinutes / 60 * 10) / 10} hrs`
                    : `${form.timeAvailabilityMinutes} min`}
                </p>
                <input
                  type="range"
                  min={30}
                  max={600}
                  step={30}
                  value={form.timeAvailabilityMinutes}
                  onChange={(e) => setForm((prev) => ({ ...prev, timeAvailabilityMinutes: parseInt(e.target.value) }))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>30 min</span><span>5 hrs</span><span>10 hrs</span>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-3">When do you prefer to practice?</h2>
                <div className="flex gap-3 flex-wrap">
                  {[
                    { value: 'weekday', label: '📅 Weekdays' },
                    { value: 'weekend', label: '🏖️ Weekends' },
                    { value: 'flexible', label: '🔄 Flexible' },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, schedulePreference: value }))}
                      className={`px-5 py-3 rounded-lg border-2 font-medium transition-all ${
                        form.schedulePreference === value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 4: Learning Style + Budget ── */}
          {step === 4 && (
            <div>
              <h1 className="text-3xl font-bold mb-2">How Do You Learn Best?</h1>
              <p className="text-gray-600 mb-8">We'll match resources to your style.</p>

              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3">Preferred learning style</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'video', label: '📺 Video tutorials', desc: 'YouTube, courses, demos' },
                    { value: 'reading', label: '📖 Reading & guides', desc: 'Articles, books, docs' },
                    { value: 'projects', label: '🔨 Hands-on projects', desc: 'Build, create, practice' },
                    { value: 'community', label: '👥 Community learning', desc: 'Forums, groups, events' },
                  ].map(({ value, label, desc }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, learningStyle: value }))}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        form.learningStyle === value
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold">{label}</div>
                      <div className="text-sm text-gray-500 mt-1">{desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-3">Budget for this hobby</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'free', label: '🆓 Free only', desc: 'No spending at all' },
                    { value: 'low', label: '💵 Low ($0–$50)', desc: 'Minimal investment' },
                    { value: 'medium', label: '💳 Medium ($50–$200)', desc: 'Some gear or courses' },
                    { value: 'no-limit', label: '💰 No limit', desc: 'Best experience possible' },
                  ].map(({ value, label, desc }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, budget: value }))}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        form.budget === value
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold">{label}</div>
                      <div className="text-sm text-gray-500 mt-1">{desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 5: Environment & Lifestyle ── */}
          {step === 5 && (
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Environment & Lifestyle</h1>
              <p className="text-gray-600 mb-8">Almost done! A few last details to personalize your plan.</p>

              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-3">Where do you live?</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'small-apartment', label: '🏙️ Small apartment' },
                      { value: 'house', label: '🏠 House / large space' },
                      { value: 'outdoor-access', label: '🌳 Outdoor access' },
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, environment: value }))}
                        className={`p-4 rounded-lg border-2 text-center text-sm font-medium transition-all ${
                          form.environment === value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-3">Social preference</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'solo', label: '🧍 Solo' },
                      { value: 'community', label: '👥 Community' },
                      { value: 'both', label: '🤝 Both' },
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, socialPreference: value }))}
                        className={`p-4 rounded-lg border-2 text-center font-medium transition-all ${
                          form.socialPreference === value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-3">Intensity level</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'gentle', label: '🌸 Gentle', desc: 'Relaxed pace' },
                      { value: 'moderate', label: '⚡ Moderate', desc: 'Balanced effort' },
                      { value: 'intense', label: '🔥 Intense', desc: 'Full commitment' },
                    ].map(({ value, label, desc }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, intensity: value }))}
                        className={`p-4 rounded-lg border-2 text-center transition-all ${
                          form.intensity === value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold">{label}</div>
                        <div className="text-xs text-gray-500 mt-1">{desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-3">Commitment horizon</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'exploring', label: '🔍 Just exploring' },
                      { value: '30-days', label: '📅 30-day challenge' },
                      { value: 'ongoing', label: '🌱 Long-term' },
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, commitmentHorizon: value }))}
                        className={`p-4 rounded-lg border-2 text-center text-sm font-medium transition-all ${
                          form.commitmentHorizon === value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-4 mt-10">
            {step === 1 ? (
              <Link href="/" className="btn-secondary px-6 py-3">Back</Link>
            ) : (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="btn-secondary px-6 py-3"
              >
                ← Back
              </button>
            )}

            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canAdvance()}
                className="btn-primary flex-1 py-3 disabled:opacity-40"
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary flex-1 py-3 disabled:opacity-40"
              >
                {submitting ? 'Saving...' : '🚀 Get My Recommendations'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
