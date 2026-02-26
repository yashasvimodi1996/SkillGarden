import type { UserProfileData, HobbyMeta, RankedHobby } from '../types';
import { HOBBY_META } from './hobbyMeta';

const MAX_SCORE = 100;

// Motivation match: 0–40
function scoreMotivations(profile: UserProfileData, meta: HobbyMeta): { points: number; reason: string | null } {
  if (profile.motivations.length === 0) return { points: 0, reason: null };
  const matches = profile.motivations.filter((m) => meta.supportedMotivations.includes(m));
  const points = Math.round((matches.length / profile.motivations.length) * 40);
  const reason = matches.length > 0
    ? `Matches your interest in ${matches.slice(0, 2).join(' & ')}`
    : null;
  return { points, reason };
}

// Time fit: 0–15
function scoreTime(profile: UserProfileData, meta: HobbyMeta): { points: number; reason: string | null } {
  const available = profile.timeAvailabilityMinutes;
  if (available >= meta.minTimeMinutes) {
    return { points: 15, reason: `Your ${Math.round(available / 60 * 10) / 10} hrs/week is ideal for this hobby` };
  }
  if (available >= meta.minTimeMinutes * 0.6) {
    return { points: 8, reason: null };
  }
  return { points: 0, reason: null };
}

// Learning style fit: 0–10
function scoreLearningStyle(profile: UserProfileData, meta: HobbyMeta): { points: number; reason: string | null } {
  if (meta.learningStyles.includes(profile.learningStyle)) {
    const styleLabel: Record<string, string> = {
      video: '📺 video tutorials',
      reading: '📖 reading guides',
      projects: '🔨 hands-on projects',
      community: '👥 community learning',
    };
    return {
      points: 10,
      reason: `Great for ${styleLabel[profile.learningStyle] ?? profile.learningStyle} learners`,
    };
  }
  return { points: 0, reason: null };
}

// Budget fit: 0–10
function scoreBudget(profile: UserProfileData, meta: HobbyMeta): { points: number; reason: string | null } {
  const budgetRank: Record<string, number> = { free: 0, low: 1, medium: 2, 'no-limit': 3 };
  const costRank: Record<string, number> = { free: 0, low: 1, medium: 2, high: 3 };
  const userRank = budgetRank[profile.budget] ?? 3;
  const hobbyRank = costRank[meta.costLevel] ?? 0;
  if (hobbyRank <= userRank) {
    const label = meta.costLevel === 'free' ? 'completely free' : `${meta.costLevel}-cost`;
    return { points: 10, reason: `Fits your budget — mostly ${label}` };
  }
  if (hobbyRank === userRank + 1) {
    return { points: 4, reason: null };
  }
  return { points: 0, reason: null };
}

// Environment fit: 0–10
function scoreEnvironment(profile: UserProfileData, meta: HobbyMeta): { points: number; reason: string | null } {
  const envMap: Record<string, 'indoor' | 'outdoor' | 'both'> = {
    'small-apartment': 'indoor',
    house: 'both',
    'outdoor-access': 'both',
  };
  const userEnv = envMap[profile.environment] ?? 'both';
  if (meta.environmentNeeds === 'both' || userEnv === 'both' || meta.environmentNeeds === userEnv) {
    return { points: 10, reason: `Works well in your ${profile.environment.replace('-', ' ')} setup` };
  }
  return { points: 0, reason: null };
}

// Social fit: 0–5
function scoreSocial(profile: UserProfileData, meta: HobbyMeta): { points: number; reason: string | null } {
  if (meta.socialNature === 'both' || profile.socialPreference === 'both' || meta.socialNature === profile.socialPreference) {
    return { points: 5, reason: null };
  }
  return { points: 0, reason: null };
}

// Skill appropriateness: 0–10
function scoreSkill(profile: UserProfileData, meta: HobbyMeta): { points: number; reason: string | null } {
  if (profile.skillLevel === 'beginner' || profile.skillLevel === 'some') {
    if (meta.beginnerFriendly) {
      return { points: 10, reason: 'Very beginner-friendly — no experience needed' };
    }
    return { points: 3, reason: null };
  }
  // intermediate/advanced users can do any hobby
  return { points: 7, reason: null };
}

export function scoreHobby(
  profile: UserProfileData,
  meta: HobbyMeta
): { score: number; reasons: string[] } {
  const factors = [
    scoreMotivations(profile, meta),
    scoreTime(profile, meta),
    scoreLearningStyle(profile, meta),
    scoreBudget(profile, meta),
    scoreEnvironment(profile, meta),
    scoreSocial(profile, meta),
    scoreSkill(profile, meta),
  ];

  const score = factors.reduce((sum, f) => sum + f.points, 0);
  const reasons = factors
    .map((f) => f.reason)
    .filter((r): r is string => r !== null)
    .slice(0, 5);

  return { score: Math.min(score, MAX_SCORE), reasons };
}

export function rankHobbies(profile: UserProfileData): RankedHobby[] {
  return HOBBY_META
    .map((meta) => {
      const { score, reasons } = scoreHobby(profile, meta);
      return { slug: meta.slug, name: meta.name, icon: meta.icon, score, maxScore: MAX_SCORE, reasons };
    })
    .sort((a, b) => b.score - a.score);
}
