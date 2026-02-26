/**
 * Unit tests for the hobby scoring engine.
 * Run with: npx ts-node lib/recommendation/score.test.ts
 */
import assert from 'assert';
import { scoreHobby, rankHobbies } from './score';
import { HOBBY_META } from './hobbyMeta';
import type { UserProfileData } from '../types';

const gardeningMeta = HOBBY_META.find((h) => h.slug === 'gardening')!;
const photographyMeta = HOBBY_META.find((h) => h.slug === 'photography')!;

const beginnerGardenProfile: UserProfileData = {
  motivations: ['stress-relief', 'mindfulness'],
  timeAvailabilityMinutes: 180,
  schedulePreference: 'weekend',
  skillLevel: 'beginner',
  learningStyle: 'projects',
  budget: 'low',
  environment: 'house',
  socialPreference: 'solo',
  intensity: 'gentle',
  commitmentHorizon: 'ongoing',
};

// Test 1: Beginner gardening profile should score high on gardening
const { score: gardenScore, reasons: gardenReasons } = scoreHobby(beginnerGardenProfile, gardeningMeta);
assert(gardenScore >= 60, `Expected garden score >= 60, got ${gardenScore}`);
assert(gardenReasons.length >= 2, `Expected >= 2 reasons, got ${gardenReasons.length}`);
console.log(`✓ Test 1 passed: Gardening score = ${gardenScore}/100, reasons: ${gardenReasons.join('; ')}`);

// Test 2: Score should not exceed 100
const maxProfile: UserProfileData = {
  motivations: ['stress-relief', 'mindfulness', 'creativity', 'skill-building', 'fun'],
  timeAvailabilityMinutes: 600,
  schedulePreference: 'flexible',
  skillLevel: 'beginner',
  learningStyle: 'projects',
  budget: 'low',
  environment: 'both' as UserProfileData['environment'],
  socialPreference: 'solo',
  intensity: 'gentle',
  commitmentHorizon: 'ongoing',
};
// Use 'house' as a valid environment value instead
const safeMaxProfile: UserProfileData = { ...maxProfile, environment: 'house' };
const { score: maxScore } = scoreHobby(safeMaxProfile, gardeningMeta);
assert(maxScore <= 100, `Score ${maxScore} exceeds max 100`);
console.log(`✓ Test 2 passed: Score capped at 100 (got ${maxScore})`);

// Test 3: Time fit — not enough time should reduce score
const lowTimeProfile: UserProfileData = {
  ...beginnerGardenProfile,
  timeAvailabilityMinutes: 20, // well below minTime of 60
};
const { score: lowTimeScore } = scoreHobby(lowTimeProfile, gardeningMeta);
assert(lowTimeScore < gardenScore, `Expected lower score with less time: ${lowTimeScore} vs ${gardenScore}`);
console.log(`✓ Test 3 passed: Low time reduces score (${lowTimeScore} < ${gardenScore})`);

// Test 4: Budget mismatch — free-only profile on high-cost hobby
const frugalProfile: UserProfileData = { ...beginnerGardenProfile, budget: 'free' };
const { score: photographyScore } = scoreHobby(frugalProfile, photographyMeta);
const { score: gardenScore2 } = scoreHobby(frugalProfile, gardeningMeta);
assert(gardenScore2 >= photographyScore, `Free-budget profile should prefer gardening over photography`);
console.log(`✓ Test 4 passed: Budget match favors gardening (${gardenScore2}) over photography (${photographyScore}) for free budget`);

// Test 5: rankHobbies returns sorted array of correct length
const ranked = rankHobbies(beginnerGardenProfile);
assert(ranked.length === 6, `Expected 6 ranked hobbies, got ${ranked.length}`);
for (let i = 0; i < ranked.length - 1; i++) {
  assert(ranked[i].score >= ranked[i + 1].score, `Hobbies not sorted at index ${i}`);
}
console.log(`✓ Test 5 passed: rankHobbies returns ${ranked.length} hobbies sorted by score`);
console.log(`  Top pick: ${ranked[0].icon} ${ranked[0].name} (${ranked[0].score}/100)`);

console.log('\n✅ All tests passed!');
