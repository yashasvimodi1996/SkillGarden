import Link from 'next/link';

export default function Home() {
  const hobbies = [
    { name: 'Gardening', icon: '🌱', slug: 'gardening' },
    { name: 'Fitness & Yoga', icon: '🧘', slug: 'fitness-yoga' },
    { name: 'Cooking & Baking', icon: '🍳', slug: 'cooking-baking' },
    { name: 'Photography', icon: '📸', slug: 'photography' },
    { name: 'Creative Arts', icon: '🎨', slug: 'creative-arts' },
    { name: 'Music', icon: '🎵', slug: 'music' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-white">
      {/* Navigation */}
      <nav className="container-custom py-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary">🌿 HobbySpring</div>
        <div className="flex gap-4">
          <Link href="/dashboard" className="btn-outline">
            Dashboard
          </Link>
          <Link href="/onboarding" className="btn-primary">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="container-custom py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 text-gray-900">
          Grow Your Hobby, Grow Yourself
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Discover curated learning paths and resources for 6 amazing hobbies. From beginner to expert, we've got you covered.
        </p>
        <Link href="/onboarding" className="btn-primary text-lg px-8 py-4 inline-block">
          Start Your Journey
        </Link>
      </div>

      {/* Hobbies Grid */}
      <div className="container-custom py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Choose Your Hobby</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hobbies.map((hobby) => (
            <Link
              key={hobby.slug}
              href={`/h/${hobby.slug}`}
              className="card p-8 text-center hover:shadow-xl transition-all"
            >
              <div className="text-5xl mb-4">{hobby.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{hobby.name}</h3>
              <p className="text-gray-600">Explore resources and learn →</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="container-custom py-16 bg-white rounded-lg my-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Why HobbySpring?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold mb-2">Curated Resources</h3>
            <p className="text-gray-600">Hand-picked videos, articles, and communities for every level</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-xl font-bold mb-2">Learning Paths</h3>
            <p className="text-gray-600">Beginner → Intermediate → Advanced structured roadmaps</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-bold mb-2">Personalized</h3>
            <p className="text-gray-600">Smart recommendations based on your skill and preferences</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 mt-16">
        <div className="container-custom text-center text-gray-600">
          <p>Built with ❤️ for hobbyists everywhere</p>
          <p className="mt-2 text-sm">HobbySpring © 2026</p>
        </div>
      </footer>
    </div>
  );
}
