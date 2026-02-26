const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const HOBBIES = [
  {
    slug: 'gardening',
    name: 'Gardening',
    description: 'Learn to grow plants, vegetables, and flowers',
    icon: '🌱',
    color: '#10b981'
  },
  {
    slug: 'fitness-yoga',
    name: 'Fitness & Yoga',
    description: 'Get fit, strong, and flexible through exercise and yoga',
    icon: '🧘', 
    color: '#f59e0b'
  },
  {
    slug: 'cooking-baking',
    name: 'Cooking & Baking',
    description: 'Master culinary skills from basic recipes to advanced techniques',
    icon: '🍳',
    color: '#ef4444'
  },
  {
    slug: 'photography',
    name: 'Photography',
    description: 'Learn to capture stunning photos from composition to editing',
    icon: '📸',
    color: '#3b82f6'
  },
  {
    slug: 'creative-arts',
    name: 'Creative Arts',
    description: 'Express yourself through painting, drawing, and digital art',
    icon: '🎨',
    color: '#8b5cf6'
  },
  {
    slug: 'music',
    name: 'Music',
    description: 'Learn an instrument, music theory, and composition',
    icon: '🎵',
    color: '#ec4899'
  }
];

const TAG_NAMES = [
  'soil-care', 'pests', 'indoor-plants', 'vegetables', 'flowers', 'herbs',
  'strength', 'cardio', 'flexibility', 'meditation', 'workout',
  'baking', 'cooking', 'desserts', 'bread', 'pastry', 'savory',
  'composition', 'lighting', 'editing', 'techniques', 'equipment',
  'drawing', 'painting', 'digital', 'sculpture', 'color-theory',
  'guitar', 'piano', 'theory', 'composition', 'recording', 'beginner-friendly'
];

function generateGardeningResources() {
  return [
    {
      title: 'Complete Beginner\'s Guide to Gardening',
      description: 'Start your gardening journey with basics',
      type: 'article',
      url: 'https://example.com/gardening-guide',
      source: 'GardenBlog',
      level: 'beginner',
      timeMinutes: 20,
      freePaid: 'free',
      popularityScore: 0.9,
      tags: ['beginner-friendly', 'soil-care', 'herbs']
    },
    {
      title: 'Growing Herbs Indoors',
      description: 'Learn to grow fresh herbs in your kitchen',
      type: 'video',
      url: 'https://youtube.com/herbs-indoor',
      source: 'YouTube',
      level: 'beginner',
      timeMinutes: 15,
      freePaid: 'free',
      popularityScore: 0.85,
      tags: ['indoor-plants', 'herbs']
    },
    {
      title: 'Organic Pest Control for Gardens',
      description: 'Natural ways to protect your plants',
      type: 'article',
      url: 'https://example.com/pest-control',
      source: 'EcoGarden',
      level: 'intermediate',
      timeMinutes: 25,
      freePaid: 'free',
      popularityScore: 0.8,
      tags: ['pests', 'organic']
    },
    {
      title: 'Soil Preparation and Maintenance',
      description: 'Create perfect soil for thriving plants',
      type: 'video',
      url: 'https://youtube.com/soil-prep',
      source: 'YouTube',
      level: 'intermediate',
      timeMinutes: 30,
      freePaid: 'free',
      popularityScore: 0.82,
      tags: ['soil-care']
    },
    {
      title: 'Advanced Vegetable Gardening',
      description: 'Master crop rotation and succession planting',
      type: 'course',
      url: 'https://example.com/veg-course',
      source: 'MasterClass',
      level: 'advanced',
      timeMinutes: 90,
      freePaid: 'paid',
      popularityScore: 0.75,
      tags: ['vegetables', 'rotation']
    }
  ];
}

function generateFitnessResources() {
  return [
    {
      title: 'Yoga for Complete Beginners',
      description: 'Get started with basic yoga poses and breathing',
      type: 'video',
      url: 'https://youtube.com/yoga-beginners',
      source: 'YouTube',
      level: 'beginner',
      timeMinutes: 20,
      freePaid: 'free',
      popularityScore: 0.92,
      tags: ['flexibility', 'meditation', 'beginner-friendly']
    },
    {
      title: 'Building Strength Without Equipment',
      description: 'Bodyweight exercises for strength building',
      type: 'article',
      url: 'https://example.com/bodyweight',
      source: 'FitBlog',
      level: 'beginner',
      timeMinutes: 15,
      freePaid: 'free',
      popularityScore: 0.88,
      tags: ['strength', 'workout']
    },
    {
      title: 'HIIT Cardio Workouts',
      description: 'High-intensity interval training for cardio',
      type: 'video',
      url: 'https://youtube.com/hiit-cardio',
      source: 'YouTube',
      level: 'intermediate',
      timeMinutes: 30,
      freePaid: 'free',
      popularityScore: 0.86,
      tags: ['cardio', 'workout']
    },
    {
      title: 'Flexibility and Mobility Training',
      description: 'Improve range of motion with stretching routines',
      type: 'course',
      url: 'https://example.com/flexibility',
      source: 'MindBody',
      level: 'intermediate',
      timeMinutes: 45,
      freePaid: 'freemium',
      popularityScore: 0.79,
      tags: ['flexibility', 'meditation']
    },
    {
      title: 'Advanced Yoga Philosophy and Practice',
      description: 'Deep dive into yoga philosophy and advanced poses',
      type: 'video',
      url: 'https://youtube.com/yoga-advanced',
      source: 'YouTube',
      level: 'advanced',
      timeMinutes: 60,
      freePaid: 'free',
      popularityScore: 0.72,
      tags: ['flexibility', 'meditation']
    }
  ];
}

function generateCookingResources() {
  return [
    {
      title: 'Basic Knife Skills for Beginners',
      description: 'Learn essential knife techniques safely',
      type: 'video',
      url: 'https://youtube.com/knife-skills',
      source: 'YouTube',
      level: 'beginner',
      timeMinutes: 20,
      freePaid: 'free',
      popularityScore: 0.91,
      tags: ['cooking', 'techniques', 'beginner-friendly']
    },
    {
      title: 'Easy Weeknight Recipes',
      description: 'Quick and delicious meals for busy nights',
      type: 'article',
      url: 'https://example.com/easy-recipes',
      source: 'RecipeHub',
      level: 'beginner',
      timeMinutes: 10,
      freePaid: 'free',
      popularityScore: 0.9,
      tags: ['cooking', 'savory']
    },
    {
      title: 'Bread Baking Fundamentals',
      description: 'Master the art of baking fresh bread',
      type: 'course',
      url: 'https://example.com/bread-course',
      source: 'BakingSchool',
      level: 'intermediate',
      timeMinutes: 120,
      freePaid: 'paid',
      popularityScore: 0.87,
      tags: ['bread', 'baking']
    },
    {
      title: 'Flavor Pairing and Seasoning',
      description: 'Learn how to balance and combine flavors',
      type: 'article',
      url: 'https://example.com/flavor-guide',
      source: 'CulinaryArts',
      level: 'intermediate',
      timeMinutes: 25,
      freePaid: 'free',
      popularityScore: 0.8,
      tags: ['cooking', 'savory']
    },
    {
      title: 'Advanced Pastry Techniques',
      description: 'Create elegant pastries and desserts',
      type: 'video',
      url: 'https://youtube.com/pastry-advanced',
      source: 'PastryTV',
      level: 'advanced',
      timeMinutes: 90,
      freePaid: 'paid',
      popularityScore: 0.74,
      tags: ['pastry', 'desserts']
    }
  ];
}

function generatePhotographyResources() {
  return [
    {
      title: 'Camera Settings Explained',
      description: 'Understand aperture, shutter speed, and ISO',
      type: 'article',
      url: 'https://example.com/camera-settings',
      source: 'PhotoBlog',
      level: 'beginner',
      timeMinutes: 20,
      freePaid: 'free',
      popularityScore: 0.93,
      tags: ['techniques', 'equipment', 'beginner-friendly']
    },
    {
      title: 'Composition Rules for Better Photos',
      description: 'Master framing and composition basics',
      type: 'video',
      url: 'https://youtube.com/composition',
      source: 'YouTube',
      level: 'beginner',
      timeMinutes: 25,
      freePaid: 'free',
      popularityScore: 0.89,
      tags: ['composition', 'techniques']
    },
    {
      title: 'Lighting Fundamentals',
      description: 'Understand natural and artificial lighting',
      type: 'course',
      url: 'https://example.com/lighting',
      source: 'PhotoMastery',
      level: 'intermediate',
      timeMinutes: 60,
      freePaid: 'freemium',
      popularityScore: 0.86,
      tags: ['lighting', 'techniques']
    },
    {
      title: 'Photo Editing in Lightroom',
      description: 'Post-processing techniques for stunning images',
      type: 'video',
      url: 'https://youtube.com/lightroom-editing',
      source: 'YouTube',
      level: 'intermediate',
      timeMinutes: 45,
      freePaid: 'free',
      popularityScore: 0.83,
      tags: ['editing', 'techniques']
    },
    {
      title: 'Advanced Portrait Photography',
      description: 'Capture beautiful portraits with professional techniques',
      type: 'course',
      url: 'https://example.com/portrait-advanced',
      source: 'ProPhotoSchool',
      level: 'advanced',
      timeMinutes: 120,
      freePaid: 'paid',
      popularityScore: 0.76,
      tags: ['portrait', 'lighting']
    }
  ];
}

function generateCreativeArtsResources() {
  return [
    {
      title: 'Drawing Fundamentals for Beginners',
      description: 'Learn basic shapes and shading techniques',
      type: 'video',
      url: 'https://youtube.com/drawing-basics',
      source: 'YouTube',
      level: 'beginner',
      timeMinutes: 30,
      freePaid: 'free',
      popularityScore: 0.9,
      tags: ['drawing', 'beginner-friendly']
    },
    {
      title: 'Color Theory Crash Course',
      description: 'Understand color relationships and harmony',
      type: 'article',
      url: 'https://example.com/color-theory',
      source: 'ArtBlog',
      level: 'beginner',
      timeMinutes: 20,
      freePaid: 'free',
      popularityScore: 0.85,
      tags: ['color-theory', 'painting']
    },
    {
      title: 'Digital Painting Techniques',
      description: 'Get started with digital art and painting',
      type: 'course',
      url: 'https://example.com/digital-painting',
      source: 'DigitalArtSchool',
      level: 'intermediate',
      timeMinutes: 90,
      freePaid: 'paid',
      popularityScore: 0.84,
      tags: ['digital', 'painting']
    },
    {
      title: 'Portrait Drawing Step by Step',
      description: 'Learn to draw realistic faces and expressions',
      type: 'video',
      url: 'https://youtube.com/portrait-drawing',
      source: 'YouTube',
      level: 'intermediate',
      timeMinutes: 50,
      freePaid: 'free',
      popularityScore: 0.81,
      tags: ['drawing', 'techniques']
    },
    {
      title: 'Advanced Digital Illustration',
      description: 'Professional digital art techniques and workflows',
      type: 'course',
      url: 'https://example.com/digital-illustration',
      source: 'ProArt',
      level: 'advanced',
      timeMinutes: 150,
      freePaid: 'paid',
      popularityScore: 0.73,
      tags: ['digital', 'sculpture']
    }
  ];
}

function generateMusicResources() {
  return [
    {
      title: 'Guitar Basics for Complete Beginners',
      description: 'Start playing guitar from day one',
      type: 'video',
      url: 'https://youtube.com/guitar-basics',
      source: 'YouTube',
      level: 'beginner',
      timeMinutes: 25,
      freePaid: 'free',
      popularityScore: 0.92,
      tags: ['guitar', 'beginner-friendly']
    },
    {
      title: 'Music Theory Fundamentals',
      description: 'Understand notes, scales, and chords',
      type: 'article',
      url: 'https://example.com/theory-basics',
      source: 'MusicBlog',
      level: 'beginner',
      timeMinutes: 30,
      freePaid: 'free',
      popularityScore: 0.88,
      tags: ['theory', 'composition']
    },
    {
      title: 'Piano Beginner Course',
      description: 'Learn piano with interactive lessons',
      type: 'course',
      url: 'https://example.com/piano-course',
      source: 'MusicAcademy',
      level: 'beginner',
      timeMinutes: 60,
      freePaid: 'freemium',
      popularityScore: 0.87,
      tags: ['piano', 'beginner-friendly']
    },
    {
      title: 'Songwriting Essentials',
      description: 'Write your own songs from scratch',
      type: 'video',
      url: 'https://youtube.com/songwriting',
      source: 'YouTube',
      level: 'intermediate',
      timeMinutes: 40,
      freePaid: 'free',
      popularityScore: 0.79,
      tags: ['composition', 'theory']
    },
    {
      title: 'Home Recording Studio Setup',
      description: 'Create professional recordings at home',
      type: 'course',
      url: 'https://example.com/recording',
      source: 'ProStudio',
      level: 'advanced',
      timeMinutes: 120,
      freePaid: 'paid',
      popularityScore: 0.75,
      tags: ['recording', 'techniques']
    }
  ];
}

async function main() {
  console.log('🌱 Starting HobbySpring database seed...');

  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.moduleResource.deleteMany({});
    await prisma.pathModule.deleteMany({});
    await prisma.learningPath.deleteMany({});
    await prisma.userResource.deleteMany({});
    await prisma.resourceTag.deleteMany({});
    await prisma.resource.deleteMany({});
    await prisma.userHobby.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.hobby.deleteMany({});
    await prisma.tag.deleteMany({});

    // Create tags
    console.log('🏷️  Creating tags...');
    const tags = await Promise.all(
      TAG_NAMES.map(name =>
        prisma.tag.create({ data: { name } }).catch(() => null)
      )
    );
    const tagMap = {};
    for (const tag of tags) {
      if (tag) tagMap[tag.name] = tag.id;
    }

    // Create hobbies with resources
    const RESOURCE_GENERATORS = {
      'gardening': generateGardeningResources,
      'fitness-yoga': generateFitnessResources,
      'cooking-baking': generateCookingResources,
      'photography': generatePhotographyResources,
      'creative-arts': generateCreativeArtsResources,
      'music': generateMusicResources
    };

    for (const hobbyData of HOBBIES) {
      console.log(`\n🎯 Creating hobby: ${hobbyData.name}`);
      
      const hobby = await prisma.hobby.create({
        data: hobbyData
      });

      // Create learning paths
      console.log(`  📚 Creating learning paths...`);
      const paths = ['beginner', 'intermediate', 'advanced'];
      const pathMap = {};
      for (let i = 0; i < paths.length; i++) {
        const path = await prisma.learningPath.create({
          data: {
            hobbyId: hobby.id,
            name: paths[i].charAt(0).toUpperCase() + paths[i].slice(1),
            level: paths[i],
            order: i
          }
        });
        pathMap[paths[i]] = path.id;

        // Create modules for each path
        for (let j = 0; j < 3; j++) {
          const module = await prisma.pathModule.create({
            data: {
              pathId: path.id,
              name: `Module ${j + 1}`,
              description: `${paths[i].charAt(0).toUpperCase() + paths[i].slice(1)} level module ${j + 1}`,
              order: j
            }
          });
        }
      }

      // Create resources
      console.log(`  📖 Creating resources...`);
      const generator = RESOURCE_GENERATORS[hobbyData.slug];
      const resourceData = generator ? generator() : [];

      for (const resource of resourceData) {
        const { tags: tagNames, ...resourceWithoutTags } = resource;
        const createdResource = await prisma.resource.create({
          data: {
            ...resourceWithoutTags,
            hobbyId: hobby.id
          }
        });

        // Link tags
        if (tagNames && tagNames.length > 0) {
          for (const tagName of tagNames) {
            const tagId = tagMap[tagName];
            if (tagId) {
              await prisma.resourceTag.create({
                data: {
                  resourceId: createdResource.id,
                  tagId
                }
              }).catch(() => null);
            }
          }
        }
      }
    }

    // Create demo user
    console.log('\n👤 Creating demo user...');
    const user = await prisma.user.create({
      data: {
        email: 'user@example.com',
        name: 'Demo User'
      }
    });

    // Add some hobbies to user
    const hobbies = await prisma.hobby.findMany({ take: 3 });
    for (const hobby of hobbies) {
      await prisma.userHobby.create({
        data: {
          userId: user.id,
          hobbyId: hobby.id,
          level: 'beginner',
          goals: 'Learn the fundamentals'
        }
      });
    }

    console.log('\n✅ Database seed completed successfully!');
    console.log(`   - ${HOBBIES.length} hobbies created`);
    console.log(`   - 5 resources per hobby created`);
    console.log(`   - Learning paths and modules created`);
    console.log(`   - Demo user created with 3 hobbies`);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
