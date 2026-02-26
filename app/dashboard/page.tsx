'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

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

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/user');
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen container-custom flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!user || user.hobbies.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
        <div className="container-custom py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to HobbySpring!</h1>
            <p className="text-xl text-gray-600 mb-8">
              Let's get you started with your first hobby.
            </p>
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
      {/* Header */}
      <div className="bg-white shadow py-6">
        <div className="container-custom flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">🌿 HobbySpring</h1>
          <div className="flex gap-4 items-center">
            <span className="text-gray-600">👋 {user.name}</span>
            <Link href="/saved" className="btn-outline">
              Saved
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-12">
        <h2 className="text-2xl font-bold mb-8">Your Hobbies</h2>

        {user.hobbies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No hobbies selected yet</p>
            <Link href="/onboarding" className="btn-primary">
              Add Hobbies
            </Link>
          </div>
        ) : (
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
                  <p className="text-sm text-gray-700 mb-4 italic">
                    Goal: {userHobby.goals}
                  </p>
                )}
                <p className="text-primary font-semibold">Explore resources →</p>
              </Link>
            ))}
          </div>
        )}

        {/* Browse All */}
        <div className="mt-16 p-8 bg-white rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Explore Other Hobbies</h3>
          <p className="text-gray-600 mb-6">Not in your list yet? Check out all hobbies:</p>
          <Link href="/" className="btn-primary">
            Browse All Hobbies
          </Link>
        </div>
      </div>
    </div>
  );
}
