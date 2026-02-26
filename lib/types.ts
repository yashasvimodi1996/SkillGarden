export interface UserProfileData {
  motivations: string[];
  timeAvailabilityMinutes: number;
  schedulePreference: 'weekday' | 'weekend' | 'flexible';
  skillLevel: 'beginner' | 'some' | 'intermediate' | 'advanced';
  learningStyle: 'video' | 'reading' | 'projects' | 'community';
  budget: 'free' | 'low' | 'medium' | 'no-limit';
  environment: 'small-apartment' | 'house' | 'outdoor-access';
  location?: string;
  socialPreference: 'solo' | 'community' | 'both';
  intensity: 'gentle' | 'moderate' | 'intense';
  commitmentHorizon: 'exploring' | '30-days' | 'ongoing';
}

export interface HobbyMeta {
  slug: string;
  name: string;
  icon: string;
  supportedMotivations: string[];
  minTimeMinutes: number;
  learningStyles: Array<'video' | 'reading' | 'projects' | 'community'>;
  costLevel: 'free' | 'low' | 'medium' | 'high';
  environmentNeeds: 'indoor' | 'outdoor' | 'both';
  socialNature: 'solo' | 'community' | 'both';
  intensityLevel: 'gentle' | 'moderate' | 'intense';
  beginnerFriendly: boolean;
}

export interface RankedHobby {
  slug: string;
  name: string;
  icon: string;
  score: number;
  maxScore: number;
  reasons: string[];
}
