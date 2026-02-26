'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ResourceCard } from '@/components/ResourceCard';

interface SavedResource {
  id: string;
  title: string;
  type: string;
  level: string;
  timeMinutes: number;
  hobby: {
    name: string;
    slug: string;
  };
  status: string;
  isSaved: boolean;
}

export default function SavedPage() {
  const [resources, setResources] = useState<SavedResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        // Get user hobbies
        const userRes = await fetch('/api/auth/user');
        if (userRes.ok) {
          const user = await userRes.json();
          const hobbySlugs = user.hobbies.map((h: any) => h.hobby.slug);

          // Fetch all resources from all hobbies
          const allSaved = [];
          for (const slug of hobbySlugs) {
            const res = await fetch(`/api/recommendations?hobby=${slug}`);
            const hobby_resources = await res.json();
            allSaved.push(...hobby_resources.filter((r: any) => r.isSaved));
          }

          setResources(allSaved);
        }
      } catch (error) {
        console.error('Failed to fetch saved resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen container-custom flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container-custom py-8">
          <Link href="/dashboard" className="text-primary hover:underline mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold">❤️ Saved Resources</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-12">
        {resources.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-8">No saved resources yet</p>
            <Link href="/dashboard" className="btn-primary">
              Explore Hobbies
            </Link>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-8">
              You have {resources.length} saved resource{resources.length !== 1 ? 's' : ''}
            </p>

            {/* Group by hobby */}
            {Object.entries(
              resources.reduce(
                (acc, resource) => {
                  const key = resource.hobby.slug;
                  if (!acc[key]) {
                    acc[key] = [];
                  }
                  acc[key].push(resource);
                  return acc;
                },
                {} as Record<string, SavedResource[]>
              )
            ).map(([slug, hobbyResources]) => (
              <div key={slug} className="mb-12">
                <h2 className="text-2xl font-bold mb-6">
                  <Link href={`/h/${slug}`} className="hover:underline">
                    {hobbyResources[0]?.hobby.name}
                  </Link>
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hobbyResources.map((resource) => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      onStatusChange={() => setResources([...resources])}
                      onFeedback={() => setResources([...resources])}
                      onSave={() => {
                        setResources(resources.filter((r) => r.id !== resource.id));
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
