/**
 * Scoring algorithm for resource recommendations
 * Uses hobby, skill level, user feedback, and popularity
 */

export interface ScoringFactors {
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  userFeedback?: 'up' | 'down' | null;
  resourceLevel: 'beginner' | 'intermediate' | 'advanced';
  popularityScore: number;
  tagMatch?: number;
}

export function calculateResourceScore(factors: ScoringFactors): number {
  let score = 0;

  // Base score from popularity (0-30 points)
  score += factors.popularityScore * 30;

  // Level match (0-40 points)
  if (factors.resourceLevel === factors.skillLevel) {
    score += 40;
  } else if (
    (factors.skillLevel === 'intermediate' && factors.resourceLevel === 'beginner') ||
    (factors.skillLevel === 'advanced' && factors.resourceLevel === 'intermediate')
  ) {
    score += 20; // Review material at a lower level
  } else if (
    (factors.skillLevel === 'intermediate' && factors.resourceLevel === 'advanced') ||
    (factors.skillLevel === 'beginner' && factors.resourceLevel === 'intermediate')
  ) {
    score += 10; // Stretch goal - slight bonus
  } else {
    score += 0; // Too advanced or too basic
  }

  // User feedback (0-30 points)
  if (factors.userFeedback === 'up') {
    score += 30;
  } else if (factors.userFeedback === 'down') {
    score -= 20;
  }

  // Tag match bonus (0-20 points)
  if (factors.tagMatch && factors.tagMatch > 0) {
    score += Math.min(20, factors.tagMatch * 5);
  }

  return Math.max(0, score); // Never negative
}

/**
 * Rank resources by score (highest first)
 */
export function rankResources<T extends { score: number }>(resources: T[]): T[] {
  return [...resources].sort((a, b) => b.score - a.score);
}
