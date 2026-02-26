const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const HOBBIES = [
  { slug: 'gardening', name: 'Gardening', description: 'Learn to grow plants, vegetables, and flowers', icon: '🌱', color: '#10b981' },
  { slug: 'fitness-yoga', name: 'Fitness & Yoga', description: 'Get fit, strong, and flexible through exercise and yoga', icon: '🧘', color: '#f59e0b' },
  { slug: 'cooking-baking', name: 'Cooking & Baking', description: 'Master culinary skills from basic recipes to advanced techniques', icon: '🍳', color: '#ef4444' },
  { slug: 'photography', name: 'Photography', description: 'Learn to capture stunning photos from composition to editing', icon: '📸', color: '#3b82f6' },
  { slug: 'creative-arts', name: 'Creative Arts', description: 'Express yourself through painting, drawing, and digital art', icon: '🎨', color: '#8b5cf6' },
  { slug: 'music', name: 'Music', description: 'Learn an instrument, music theory, and composition', icon: '🎵', color: '#ec4899' },
];

const TAG_NAMES = [
  'soil-care', 'pests', 'indoor-plants', 'vegetables', 'flowers', 'herbs',
  'strength', 'cardio', 'flexibility', 'meditation', 'workout', 'stress-relief', 'mindfulness',
  'baking', 'cooking', 'desserts', 'bread', 'pastry', 'savory', 'creativity',
  'composition', 'lighting', 'editing', 'techniques', 'equipment', 'small-space', 'outdoor',
  'drawing', 'painting', 'digital', 'sculpture', 'color-theory',
  'guitar', 'piano', 'theory', 'recording', 'beginner-friendly', 'community',
];

function generateGardeningResources() {
  return [
    { title: "Complete Beginner's Guide to Gardening", description: 'Start your gardening journey with basics', type: 'article', url: 'https://example.com/gardening-guide', source: 'GardenBlog', level: 'beginner', timeMinutes: 20, freePaid: 'free', popularityScore: 0.90, tags: ['beginner-friendly', 'soil-care', 'herbs'] },
    { title: 'Growing Herbs Indoors (No Garden Needed)', description: 'Grow fresh herbs in your kitchen or windowsill', type: 'video', url: 'https://youtube.com/herbs-indoor', source: 'YouTube', level: 'beginner', timeMinutes: 15, freePaid: 'free', popularityScore: 0.88, tags: ['indoor-plants', 'herbs', 'small-space'] },
    { title: 'Mindful Gardening: Grow for Stress Relief', description: 'Using gardening as a mindfulness practice', type: 'article', url: 'https://example.com/mindful-gardening', source: 'WellnessGarden', level: 'beginner', timeMinutes: 12, freePaid: 'free', popularityScore: 0.85, tags: ['mindfulness', 'stress-relief', 'beginner-friendly'] },
    { title: 'Balcony & Small-Space Gardening Tips', description: 'Garden even in a small apartment', type: 'video', url: 'https://youtube.com/balcony-garden', source: 'YouTube', level: 'beginner', timeMinutes: 18, freePaid: 'free', popularityScore: 0.87, tags: ['small-space', 'indoor-plants', 'vegetables'] },
    { title: 'Organic Pest Control for Gardens', description: 'Natural ways to protect your plants', type: 'article', url: 'https://example.com/pest-control', source: 'EcoGarden', level: 'intermediate', timeMinutes: 25, freePaid: 'free', popularityScore: 0.80, tags: ['pests', 'outdoor'] },
    { title: 'Soil Preparation and Maintenance', description: 'Create perfect soil for thriving plants', type: 'video', url: 'https://youtube.com/soil-prep', source: 'YouTube', level: 'intermediate', timeMinutes: 30, freePaid: 'free', popularityScore: 0.82, tags: ['soil-care'] },
    { title: 'Companion Planting Guide', description: 'Which plants grow best together', type: 'article', url: 'https://example.com/companion-planting', source: 'GardenWise', level: 'intermediate', timeMinutes: 22, freePaid: 'free', popularityScore: 0.78, tags: ['vegetables', 'herbs', 'flowers'] },
    { title: 'Seasonal Vegetable Growing Calendar', description: 'What to plant and when throughout the year', type: 'article', url: 'https://example.com/seasonal-planting', source: 'VegGarden', level: 'intermediate', timeMinutes: 20, freePaid: 'free', popularityScore: 0.81, tags: ['vegetables', 'outdoor'] },
    { title: 'Advanced Vegetable Gardening', description: 'Master crop rotation and succession planting', type: 'course', url: 'https://example.com/veg-course', source: 'MasterClass', level: 'advanced', timeMinutes: 90, freePaid: 'paid', popularityScore: 0.75, tags: ['vegetables', 'outdoor'] },
    { title: 'Building a Raised Bed Garden from Scratch', description: 'DIY raised bed construction and soil mix', type: 'video', url: 'https://youtube.com/raised-bed', source: 'YouTube', level: 'advanced', timeMinutes: 45, freePaid: 'free', popularityScore: 0.77, tags: ['soil-care', 'vegetables', 'outdoor'] },
  ];
}

function generateFitnessResources() {
  return [
    { title: 'Yoga for Complete Beginners', description: 'Start yoga with basic poses and breathing', type: 'video', url: 'https://youtube.com/yoga-beginners', source: 'YouTube', level: 'beginner', timeMinutes: 20, freePaid: 'free', popularityScore: 0.92, tags: ['flexibility', 'meditation', 'beginner-friendly', 'stress-relief'] },
    { title: 'Building Strength Without Equipment', description: 'Bodyweight exercises for strength building', type: 'article', url: 'https://example.com/bodyweight', source: 'FitBlog', level: 'beginner', timeMinutes: 15, freePaid: 'free', popularityScore: 0.88, tags: ['strength', 'workout', 'small-space'] },
    { title: '5-Minute Morning Mindfulness & Stretch', description: 'Start your day calm and focused', type: 'video', url: 'https://youtube.com/morning-stretch', source: 'YouTube', level: 'beginner', timeMinutes: 10, freePaid: 'free', popularityScore: 0.91, tags: ['mindfulness', 'flexibility', 'stress-relief', 'beginner-friendly'] },
    { title: '30-Day Yoga Challenge for Beginners', description: 'A month of daily yoga practice', type: 'community', url: 'https://example.com/yoga-challenge', source: 'YogaJourney', level: 'beginner', timeMinutes: 25, freePaid: 'free', popularityScore: 0.86, tags: ['flexibility', 'community', 'beginner-friendly'] },
    { title: 'HIIT Cardio Workouts', description: 'High-intensity interval training for cardio', type: 'video', url: 'https://youtube.com/hiit-cardio', source: 'YouTube', level: 'intermediate', timeMinutes: 30, freePaid: 'free', popularityScore: 0.86, tags: ['cardio', 'workout', 'strength'] },
    { title: 'Flexibility and Mobility Training', description: 'Improve range of motion with stretching routines', type: 'course', url: 'https://example.com/flexibility', source: 'MindBody', level: 'intermediate', timeMinutes: 45, freePaid: 'freemium', popularityScore: 0.79, tags: ['flexibility', 'meditation'] },
    { title: 'Strength Training for Beginners', description: 'Progressive strength training program', type: 'article', url: 'https://example.com/strength-program', source: 'StrongFirst', level: 'intermediate', timeMinutes: 20, freePaid: 'free', popularityScore: 0.84, tags: ['strength', 'workout', 'cardio'] },
    { title: 'Yoga Nidra for Deep Relaxation', description: 'Guided deep relaxation yoga practice', type: 'video', url: 'https://youtube.com/yoga-nidra', source: 'YouTube', level: 'intermediate', timeMinutes: 40, freePaid: 'free', popularityScore: 0.83, tags: ['meditation', 'stress-relief', 'mindfulness'] },
    { title: 'Advanced Yoga Philosophy and Practice', description: 'Deep dive into yoga philosophy and advanced poses', type: 'video', url: 'https://youtube.com/yoga-advanced', source: 'YouTube', level: 'advanced', timeMinutes: 60, freePaid: 'free', popularityScore: 0.72, tags: ['flexibility', 'meditation'] },
    { title: 'Designing Your Own Workout Program', description: 'Build a personalized fitness plan', type: 'article', url: 'https://example.com/workout-design', source: 'FitScience', level: 'advanced', timeMinutes: 35, freePaid: 'free', popularityScore: 0.76, tags: ['strength', 'cardio', 'workout'] },
  ];
}

function generateCookingResources() {
  return [
    { title: 'Basic Knife Skills for Beginners', description: 'Learn essential knife techniques safely', type: 'video', url: 'https://youtube.com/knife-skills', source: 'YouTube', level: 'beginner', timeMinutes: 20, freePaid: 'free', popularityScore: 0.91, tags: ['cooking', 'techniques', 'beginner-friendly'] },
    { title: 'Easy Weeknight Recipes', description: 'Quick and delicious meals for busy nights', type: 'article', url: 'https://example.com/easy-recipes', source: 'RecipeHub', level: 'beginner', timeMinutes: 10, freePaid: 'free', popularityScore: 0.90, tags: ['cooking', 'savory'] },
    { title: 'Cooking as Self-Care: Mindful Kitchen Habits', description: 'Find joy and calm in cooking', type: 'article', url: 'https://example.com/mindful-cooking', source: 'WellnessKitchen', level: 'beginner', timeMinutes: 12, freePaid: 'free', popularityScore: 0.87, tags: ['mindfulness', 'stress-relief', 'creativity'] },
    { title: 'Budget-Friendly Meal Prep Guide', description: 'Cook healthy meals for the whole week cheaply', type: 'video', url: 'https://youtube.com/meal-prep', source: 'YouTube', level: 'beginner', timeMinutes: 30, freePaid: 'free', popularityScore: 0.89, tags: ['cooking', 'savory', 'beginner-friendly'] },
    { title: 'Bread Baking Fundamentals', description: 'Master the art of baking fresh bread', type: 'course', url: 'https://example.com/bread-course', source: 'BakingSchool', level: 'intermediate', timeMinutes: 120, freePaid: 'paid', popularityScore: 0.87, tags: ['bread', 'baking', 'creativity'] },
    { title: 'Flavor Pairing and Seasoning', description: 'Learn how to balance and combine flavors', type: 'article', url: 'https://example.com/flavor-guide', source: 'CulinaryArts', level: 'intermediate', timeMinutes: 25, freePaid: 'free', popularityScore: 0.80, tags: ['cooking', 'savory', 'techniques'] },
    { title: 'Sourdough Starter and Baking', description: 'Create your own sourdough from scratch', type: 'video', url: 'https://youtube.com/sourdough', source: 'YouTube', level: 'intermediate', timeMinutes: 50, freePaid: 'free', popularityScore: 0.85, tags: ['bread', 'baking'] },
    { title: 'International Cuisine: Asian Basics', description: 'Explore Asian cooking techniques and recipes', type: 'community', url: 'https://example.com/asian-cooking', source: 'CookingCommunity', level: 'intermediate', timeMinutes: 40, freePaid: 'freemium', popularityScore: 0.82, tags: ['cooking', 'savory', 'community'] },
    { title: 'Advanced Pastry Techniques', description: 'Create elegant pastries and desserts', type: 'video', url: 'https://youtube.com/pastry-advanced', source: 'PastryTV', level: 'advanced', timeMinutes: 90, freePaid: 'paid', popularityScore: 0.74, tags: ['pastry', 'desserts', 'baking'] },
    { title: 'Fermentation: Kimchi, Yogurt & More', description: 'Home fermentation for health and flavor', type: 'course', url: 'https://example.com/fermentation', source: 'FoodLab', level: 'advanced', timeMinutes: 60, freePaid: 'freemium', popularityScore: 0.73, tags: ['cooking', 'techniques', 'savory'] },
  ];
}

function generatePhotographyResources() {
  return [
    { title: 'Camera Settings Explained', description: 'Understand aperture, shutter speed, and ISO', type: 'article', url: 'https://example.com/camera-settings', source: 'PhotoBlog', level: 'beginner', timeMinutes: 20, freePaid: 'free', popularityScore: 0.93, tags: ['techniques', 'equipment', 'beginner-friendly'] },
    { title: 'Composition Rules for Better Photos', description: 'Master framing and composition basics', type: 'video', url: 'https://youtube.com/composition', source: 'YouTube', level: 'beginner', timeMinutes: 25, freePaid: 'free', popularityScore: 0.89, tags: ['composition', 'techniques'] },
    { title: 'Smartphone Photography Masterclass', description: 'Take stunning photos with just your phone', type: 'video', url: 'https://youtube.com/phone-photography', source: 'YouTube', level: 'beginner', timeMinutes: 30, freePaid: 'free', popularityScore: 0.91, tags: ['techniques', 'beginner-friendly', 'creativity'] },
    { title: 'Photography Communities & Challenges', description: 'Join weekly photo challenges and get feedback', type: 'community', url: 'https://example.com/photo-community', source: '500px Community', level: 'beginner', timeMinutes: 15, freePaid: 'free', popularityScore: 0.84, tags: ['community', 'creativity'] },
    { title: 'Lighting Fundamentals', description: 'Understand natural and artificial lighting', type: 'course', url: 'https://example.com/lighting', source: 'PhotoMastery', level: 'intermediate', timeMinutes: 60, freePaid: 'freemium', popularityScore: 0.86, tags: ['lighting', 'techniques'] },
    { title: 'Photo Editing in Lightroom', description: 'Post-processing techniques for stunning images', type: 'video', url: 'https://youtube.com/lightroom-editing', source: 'YouTube', level: 'intermediate', timeMinutes: 45, freePaid: 'free', popularityScore: 0.83, tags: ['editing', 'techniques'] },
    { title: 'Street Photography Guide', description: 'Capture candid, authentic street moments', type: 'article', url: 'https://example.com/street-photo', source: 'StreetFrame', level: 'intermediate', timeMinutes: 20, freePaid: 'free', popularityScore: 0.79, tags: ['composition', 'outdoor', 'creativity'] },
    { title: 'Nature & Outdoor Photography', description: 'Photograph landscapes, wildlife, and plants', type: 'video', url: 'https://youtube.com/nature-photography', source: 'YouTube', level: 'intermediate', timeMinutes: 35, freePaid: 'free', popularityScore: 0.81, tags: ['outdoor', 'lighting', 'composition'] },
    { title: 'Advanced Portrait Photography', description: 'Capture beautiful portraits with professional techniques', type: 'course', url: 'https://example.com/portrait-advanced', source: 'ProPhotoSchool', level: 'advanced', timeMinutes: 120, freePaid: 'paid', popularityScore: 0.76, tags: ['lighting', 'techniques'] },
    { title: 'Building Your Photography Portfolio', description: 'Select and present your best work online', type: 'article', url: 'https://example.com/photo-portfolio', source: 'CreativePro', level: 'advanced', timeMinutes: 25, freePaid: 'free', popularityScore: 0.74, tags: ['creativity', 'techniques', 'community'] },
  ];
}

function generateCreativeArtsResources() {
  return [
    { title: 'Drawing Fundamentals for Beginners', description: 'Learn basic shapes and shading techniques', type: 'video', url: 'https://youtube.com/drawing-basics', source: 'YouTube', level: 'beginner', timeMinutes: 30, freePaid: 'free', popularityScore: 0.90, tags: ['drawing', 'beginner-friendly', 'creativity'] },
    { title: 'Color Theory Crash Course', description: 'Understand color relationships and harmony', type: 'article', url: 'https://example.com/color-theory', source: 'ArtBlog', level: 'beginner', timeMinutes: 20, freePaid: 'free', popularityScore: 0.85, tags: ['color-theory', 'painting', 'creativity'] },
    { title: 'Art Therapy: Drawing for Stress Relief', description: 'Use drawing as a mindful, calming practice', type: 'article', url: 'https://example.com/art-therapy', source: 'MindfulArt', level: 'beginner', timeMinutes: 15, freePaid: 'free', popularityScore: 0.88, tags: ['stress-relief', 'mindfulness', 'beginner-friendly'] },
    { title: 'Watercolor Painting for Beginners', description: 'Get started with watercolor techniques', type: 'video', url: 'https://youtube.com/watercolor-basics', source: 'YouTube', level: 'beginner', timeMinutes: 25, freePaid: 'free', popularityScore: 0.87, tags: ['painting', 'creativity', 'beginner-friendly'] },
    { title: 'Digital Painting Techniques', description: 'Get started with digital art and painting', type: 'course', url: 'https://example.com/digital-painting', source: 'DigitalArtSchool', level: 'intermediate', timeMinutes: 90, freePaid: 'paid', popularityScore: 0.84, tags: ['digital', 'painting', 'creativity'] },
    { title: 'Portrait Drawing Step by Step', description: 'Learn to draw realistic faces and expressions', type: 'video', url: 'https://youtube.com/portrait-drawing', source: 'YouTube', level: 'intermediate', timeMinutes: 50, freePaid: 'free', popularityScore: 0.81, tags: ['drawing', 'techniques'] },
    { title: 'Sketchbook Practice: 365 Days of Drawing', description: 'Build a daily drawing habit', type: 'community', url: 'https://example.com/sketchbook-challenge', source: 'ArtCommunity', level: 'intermediate', timeMinutes: 20, freePaid: 'free', popularityScore: 0.79, tags: ['drawing', 'community', 'creativity'] },
    { title: 'Introduction to Screen Printing', description: 'Create prints and wearable art at home', type: 'video', url: 'https://youtube.com/screen-printing', source: 'YouTube', level: 'intermediate', timeMinutes: 40, freePaid: 'free', popularityScore: 0.78, tags: ['creativity', 'techniques'] },
    { title: 'Advanced Digital Illustration', description: 'Professional digital art techniques and workflows', type: 'course', url: 'https://example.com/digital-illustration', source: 'ProArt', level: 'advanced', timeMinutes: 150, freePaid: 'paid', popularityScore: 0.73, tags: ['digital', 'creativity'] },
    { title: 'Selling Your Art Online', description: 'Turn your art into income on Etsy and beyond', type: 'article', url: 'https://example.com/sell-art', source: 'CreativeHustle', level: 'advanced', timeMinutes: 30, freePaid: 'free', popularityScore: 0.72, tags: ['creativity', 'community'] },
  ];
}

function generateMusicResources() {
  return [
    { title: 'Guitar Basics for Complete Beginners', description: 'Start playing guitar from day one', type: 'video', url: 'https://youtube.com/guitar-basics', source: 'YouTube', level: 'beginner', timeMinutes: 25, freePaid: 'free', popularityScore: 0.92, tags: ['guitar', 'beginner-friendly', 'creativity'] },
    { title: 'Music Theory Fundamentals', description: 'Understand notes, scales, and chords', type: 'article', url: 'https://example.com/theory-basics', source: 'MusicBlog', level: 'beginner', timeMinutes: 30, freePaid: 'free', popularityScore: 0.88, tags: ['theory', 'beginner-friendly'] },
    { title: 'Music & Mood: How Sound Reduces Stress', description: 'The science of music for stress relief', type: 'article', url: 'https://example.com/music-stress', source: 'SoundMind', level: 'beginner', timeMinutes: 12, freePaid: 'free', popularityScore: 0.86, tags: ['stress-relief', 'mindfulness', 'beginner-friendly'] },
    { title: 'Online Piano Lessons (Free)', description: 'Learn piano with interactive free lessons', type: 'course', url: 'https://example.com/piano-free', source: 'Pianu', level: 'beginner', timeMinutes: 30, freePaid: 'free', popularityScore: 0.90, tags: ['piano', 'beginner-friendly', 'creativity'] },
    { title: 'Songwriting Essentials', description: 'Write your own songs from scratch', type: 'video', url: 'https://youtube.com/songwriting', source: 'YouTube', level: 'intermediate', timeMinutes: 40, freePaid: 'free', popularityScore: 0.79, tags: ['theory', 'creativity'] },
    { title: 'Music Production with GarageBand (Free)', description: 'Create beats and tracks on your Mac/iPhone', type: 'video', url: 'https://youtube.com/garageband', source: 'YouTube', level: 'intermediate', timeMinutes: 50, freePaid: 'free', popularityScore: 0.85, tags: ['recording', 'creativity', 'techniques'] },
    { title: 'Guitar Community Challenges & Jams', description: 'Join online guitar jams and share your progress', type: 'community', url: 'https://example.com/guitar-community', source: 'Ultimate Guitar', level: 'intermediate', timeMinutes: 20, freePaid: 'free', popularityScore: 0.83, tags: ['guitar', 'community', 'creativity'] },
    { title: 'Understanding Chord Progressions', description: 'How chords work together in popular music', type: 'article', url: 'https://example.com/chord-progressions', source: 'MusicTheory.net', level: 'intermediate', timeMinutes: 25, freePaid: 'free', popularityScore: 0.81, tags: ['theory', 'guitar', 'piano'] },
    { title: 'Home Recording Studio Setup', description: 'Create professional recordings at home', type: 'course', url: 'https://example.com/recording', source: 'ProStudio', level: 'advanced', timeMinutes: 120, freePaid: 'paid', popularityScore: 0.75, tags: ['recording', 'techniques'] },
    { title: 'Advanced Music Composition', description: 'Write complex arrangements and original music', type: 'course', url: 'https://example.com/composition-advanced', source: 'Berklee Online', level: 'advanced', timeMinutes: 180, freePaid: 'paid', popularityScore: 0.71, tags: ['theory', 'creativity', 'recording'] },
  ];
}

async function main() {
  console.log('🌱 Starting HobbySpring database seed...');

  try {
    console.log('🗑️  Clearing existing data...');
    await prisma.moduleResource.deleteMany({});
    await prisma.pathModule.deleteMany({});
    await prisma.learningPath.deleteMany({});
    await prisma.userResource.deleteMany({});
    await prisma.resourceTag.deleteMany({});
    await prisma.resource.deleteMany({});
    await prisma.userHobby.deleteMany({});
    await prisma.userProfile.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.hobby.deleteMany({});
    await prisma.tag.deleteMany({});

    console.log('🏷️  Creating tags...');
    const tags = await Promise.all(
      TAG_NAMES.map(name => prisma.tag.create({ data: { name } }).catch(() => null))
    );
    const tagMap = {};
    for (const tag of tags) {
      if (tag) tagMap[tag.name] = tag.id;
    }

    const RESOURCE_GENERATORS = {
      'gardening': generateGardeningResources,
      'fitness-yoga': generateFitnessResources,
      'cooking-baking': generateCookingResources,
      'photography': generatePhotographyResources,
      'creative-arts': generateCreativeArtsResources,
      'music': generateMusicResources,
    };

    for (const hobbyData of HOBBIES) {
      console.log(`\n🎯 Creating hobby: ${hobbyData.name}`);

      const hobby = await prisma.hobby.create({ data: hobbyData });

      // Create learning paths + modules
      const levels = ['beginner', 'intermediate', 'advanced'];
      for (let i = 0; i < levels.length; i++) {
        const path = await prisma.learningPath.create({
          data: { hobbyId: hobby.id, name: levels[i].charAt(0).toUpperCase() + levels[i].slice(1), level: levels[i], order: i }
        });
        for (let j = 0; j < 3; j++) {
          await prisma.pathModule.create({
            data: { pathId: path.id, name: `Module ${j + 1}`, description: `${levels[i]} level module ${j + 1}`, order: j }
          });
        }
      }

      // Create resources
      const generator = RESOURCE_GENERATORS[hobbyData.slug];
      const resourceData = generator ? generator() : [];

      for (const resource of resourceData) {
        const { tags: tagNames, ...resourceWithoutTags } = resource;
        const createdResource = await prisma.resource.create({ data: { ...resourceWithoutTags, hobbyId: hobby.id } });
        if (tagNames && tagNames.length > 0) {
          for (const tagName of tagNames) {
            const tagId = tagMap[tagName];
            if (tagId) {
              await prisma.resourceTag.create({ data: { resourceId: createdResource.id, tagId } }).catch(() => null);
            }
          }
        }
      }
    }

    console.log('\n✅ Database seed completed successfully!');
    console.log(`   - ${HOBBIES.length} hobbies created`);
    console.log('   - 10 resources per hobby created');
    console.log('   - Learning paths and modules created');
    console.log('   - No demo user (users are created via onboarding)');
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
