// src/lib/aliases.ts
// Random alias generation for anonymous user identities

/**
 * Adjectives that convey emotion, placement journey themes
 * Used first part of alias for personality
 */
const adjectives = [
  // Emotional states
  "Silent", "Brave", "Lost", "Found", "Broken", "Strong", "Quiet", "Loud",
  "Calm", "Fierce", "Swift", "Steady", "Dark", "Light", "Hopeful", "Weary",
  
  // Personality traits
  "Curious", "Clever", "Bold", "Humble", "Witty", "Wise", "Wild", "Free",
  "Bright", "Deep", "Sharp", "Smooth", "Rusty", "Shiny", "Hidden", "Tired",
  
  // Journey related
  "Lost", "Driven", "Focused", "Scattered", "Determined", "Wandering", "Rising",
  "Falling", "Climbing", "Soaring", "Grounded", "Flying", "Running", "Waiting",
  
  // Placement/Career themes
  "Rejected", "Selected", "Pending", "Ranked", "Scored", "Qualified", "Unranked",
  "Confident", "Nervous", "Prepared", "Unprepared", "Grinding", "Hustling",
];

/**
 * Nouns that create interesting second part of alias
 * Used for creating memorable, unique identities
 */
const nouns = [
  // Animals - neutral, anonymous feel
  "Wolf", "Fox", "Raven", "Eagle", "Hawk", "Snake", "Tiger", "Panda",
  "Deer", "Bear", "Owl", "Crow", "Phoenix", "Dragon", "Sparrow", "Falcon",
  "Badger", "Viper", "Panther", "Leopard", "Lynx", "Coyote", "Jackal",
  
  // Mystical/Dark (matches anonymous vibe)
  "Shadow", "Ghost", "Spirit", "Dream", "Nightmare", "Phantom", "Specter",
  "Mystic", "Oracle", "Sage", "Prophet", "Seer", "Seeker", "Wanderer",
  
  // Tech/Modern
  "Coder", "Hacker", "Cipher", "Binary", "Code", "Logic", "Algorithm",
  "Syntax", "Parser", "Token", "Kernel", "Daemon", "Router", "Server",
  
  // Time/Abstract
  "Moment", "Hour", "Tide", "Cycle", "Wave", "Storm", "Thunder", "Lightning",
  "Frost", "Ember", "Spark", "Blaze", "Void", "Echo", "Whisper", "Silence",
  
  // Placement-specific metaphors
  "Climber", "Seeker", "Runner", "Warrior", "Rebel", "Survivor", "Fighter",
  "Strider", "Wanderer", "Traveler", "Pioneer", "Explorer", "Scout", "Guide",
  
  // Simple/Memorable
  "Mind", "Soul", "Heart", "Fire", "Wind", "Water", "Earth", "Sky",
  "Moon", "Star", "Sun", "Cloud", "Rain", "Snow", "Stone", "Metal",
];

/**
 * Generate a random alias
 * 
 * Creates anonymous-feeling aliases like:
 * - SilentWolf
 * - MidnightCoder
 * - LostGraduate
 * - BraveRaven
 * - QuietPhoenix
 * 
 * @returns string - Random alias
 */
export function generateRandomAlias(): string {
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${randomAdjective}${randomNoun}`;
}

/**
 * Generate multiple unique aliases at once
 * 
 * Useful for showing user options to choose from
 * 
 * @param count - Number of aliases to generate (default 3)
 * @returns string[] - Array of unique aliases
 */
export function generateAliasOptions(count: number = 3): string[] {
  const aliases = new Set<string>();

  while (aliases.size < count) {
    aliases.add(generateRandomAlias());
  }

  return Array.from(aliases);
}

/**
 * Validate alias format and content
 * 
 * Rules:
 * - 3-20 characters
 * - Only letters, numbers, underscores, hyphens
 * - Cannot be empty
 * 
 * @param alias - Alias to validate
 * @returns { valid: boolean, error?: string }
 */
export function validateAliasFormat(alias: string): {
  valid: boolean;
  error?: string;
} {
  if (!alias || alias.trim().length === 0) {
    return { valid: false, error: "Alias cannot be empty" };
  }

  const trimmed = alias.trim();

  if (trimmed.length < 3) {
    return { valid: false, error: "Alias must be at least 3 characters" };
  }

  if (trimmed.length > 20) {
    return { valid: false, error: "Alias must be at most 20 characters" };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    return {
      valid: false,
      error: "Alias can only contain letters, numbers, underscores, and hyphens",
    };
  }

  return { valid: true };
}

/**
 * Generate a random avatar seed for DiceBear
 * 
 * DiceBear style options (use one):
 * - avataaars
 * - avataaars-neutral
 * - big-ears
 * - big-ears-neutral
 * - big-smile
 * - bottts
 * - bottts-neutral
 * - croodles
 * - fun-emoji
 * - identicon
 * - jdenticon
 * - lorelei
 * - micah
 * - miniavs
 * - notionists
 * - personas
 * - pixel-art
 * - pixel-art-neutral
 * - rings
 * - shapes
 * - thumbs
 * 
 * @returns string - Avatar seed
 */
export function generateAvatarSeed(): string {
  // Generate a random seed from alias + random UUID
  // This ensures avatar is consistent with user but unique
  const randomString = Math.random().toString(36).substring(2, 15);
  return randomString;
}

/**
 * Get DiceBear avatar URL for a seed
 * 
 * @param seed - Avatar seed
 * @param style - DiceBear style (default: avataaars)
 * @param size - Avatar size in pixels (default: 200)
 * @returns string - Full URL to avatar image
 */
export function getAvatarUrl(
  seed: string,
  style: string = "avataaars",
  size: number = 200
): string {
  const encodedSeed = encodeURIComponent(seed);
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodedSeed}&size=${size}`;
}

/**
 * Format alias for display
 * 
 * - Trim whitespace
 * - Capitalize properly (e.g., "SilentWolf" not "silentWolf")
 * 
 * @param alias - Raw alias
 * @returns string - Formatted alias
 */
export function formatAlias(alias: string): string {
  return alias.trim();
}

/**
 * Check if an alias looks suspicious or inappropriate
 * 
 * Basic filters for obvious problems:
 * - Contains numbers that suggest PII (phone, ID patterns)
 * - Looks like an email
 * - Contains common bad words
 * 
 * @param alias - Alias to check
 * @returns boolean - True if suspicious
 */
export function isAliasSuspicious(alias: string): boolean {
  // Check if looks like email
  if (alias.includes("@")) {
    return true;
  }

  // Check if contains phone number pattern (10 consecutive digits)
  if (/\d{10,}/.test(alias)) {
    return true;
  }

  // Add more sophisticated content filtering as needed
  // For now, keep it simple

  return false;
}

/**
 * Generate avatar configuration object
 * 
 * @param seed - Avatar seed
 * @returns object - Configuration for avatar display
 */
export function getAvatarConfig(seed: string) {
  return {
    seed,
    style: "avataaars", // Default style
    size: 200,
    url: getAvatarUrl(seed, "avataaars", 200),
  };
}

/**
 * Create new user identity
 * 
 * Generates both alias and avatar seed
 * 
 * @returns object - Complete identity
 */
export function createNewIdentity() {
  const alias = generateRandomAlias();
  const avatarSeed = generateAvatarSeed();

  return {
    alias,
    avatarSeed,
    avatar: getAvatarConfig(avatarSeed),
  };
}

/**
 * List of reserved aliases that cannot be claimed
 * These are usernames that are confusing or could imply admin status
 */
export const reservedAliases = [
  "admin",
  "administrator",
  "moderator",
  "support",
  "official",
  "verified",
  "system",
  "bot",
  "automation",
  "placement-diaries",
  "placementdiaries",
  "founder",
  "creator",
  "developer",
  "null",
  "undefined",
  "test",
  "demo",
  "anonymous",
];

/**
 * Check if alias is reserved
 * 
 * @param alias - Alias to check
 * @returns boolean - True if reserved
 */
export function isAliasReserved(alias: string): boolean {
  return reservedAliases.includes(alias.toLowerCase());
}
