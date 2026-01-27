/**
 * Theme system for Punitto
 * Defines visual themes with different animals, colors, and styles
 */

export interface ThemeAnimal {
  tier: number;
  name: string;
  spritePath: string;
}

export interface ThemeColors {
  containerBg: string;
  containerBorder: string;
  uiPrimary: string;
  uiSecondary: string;
  textColor: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  animals: ThemeAnimal[];
  colors: ThemeColors;
  unlockRequirement: number; // Stars required to unlock (0 = default unlocked)
}

// Pastel Paws theme (default, always unlocked)
export const PASTEL_PAWS_THEME: Theme = {
  id: 'pastel-paws',
  name: 'Pastel Paws',
  description: 'Cute kawaii animals in soft pastel colors',
  unlockRequirement: 0,
  animals: [
    { tier: 0, name: 'Hamster', spritePath: '/assets/images/pastelPaws/hamster.png' },
    { tier: 1, name: 'Cat', spritePath: '/assets/images/pastelPaws/cat.png' },
    { tier: 2, name: 'Shiba', spritePath: '/assets/images/pastelPaws/shiba.png' },
    { tier: 3, name: 'Westie', spritePath: '/assets/images/pastelPaws/westie.png' },
    { tier: 4, name: 'Husky', spritePath: '/assets/images/pastelPaws/husky.png' },
    { tier: 5, name: 'Samoyed', spritePath: '/assets/images/pastelPaws/samoyed.png' },
    { tier: 6, name: 'Big Floof', spritePath: '/assets/images/pastelPaws/bigFloof.png' }
  ],
  colors: {
    containerBg: 'linear-gradient(180deg, #FFF8F0 0%, #FFE4E1 100%)',
    containerBorder: '#FFB6C1',
    uiPrimary: '#FF9EAA',
    uiSecondary: '#FFD4A3',
    textColor: '#5A4A42'
  }
};

// Ocean Dreams theme (unlocks at 10 stars)
export const OCEAN_DREAMS_THEME: Theme = {
  id: 'ocean-dreams',
  name: 'Ocean Dreams',
  description: 'Magical underwater creatures in ocean blues',
  unlockRequirement: 10,
  animals: [
    { tier: 0, name: 'Seahorse', spritePath: '/assets/images/oceanDreams/seahorse.png' },
    { tier: 1, name: 'Jellyfish', spritePath: '/assets/images/oceanDreams/jellyfish.png' },
    { tier: 2, name: 'Clownfish', spritePath: '/assets/images/oceanDreams/clownfish.png' },
    { tier: 3, name: 'Pufferfish', spritePath: '/assets/images/oceanDreams/pufferfish.png' },
    { tier: 4, name: 'Dolphin', spritePath: '/assets/images/oceanDreams/dolphin.png' },
    { tier: 5, name: 'Orca', spritePath: '/assets/images/oceanDreams/orca.png' },
    { tier: 6, name: 'Ocean Spirit', spritePath: '/assets/images/oceanDreams/oceanSpirit.png' }
  ],
  colors: {
    containerBg: 'linear-gradient(180deg, #B4E7FF 0%, #6BB6D6 100%)',
    containerBorder: '#4A9FBD',
    uiPrimary: '#4A9FBD',
    uiSecondary: '#B4E7FF',
    textColor: '#2C5F7C'
  }
};

// All available themes
export const ALL_THEMES: Theme[] = [
  PASTEL_PAWS_THEME,
  OCEAN_DREAMS_THEME
];

/**
 * Get theme by ID
 */
export function getThemeById(id: string): Theme | undefined {
  return ALL_THEMES.find(theme => theme.id === id);
}

/**
 * Get default theme
 */
export function getDefaultTheme(): Theme {
  return PASTEL_PAWS_THEME;
}

/**
 * Check if a theme is unlocked based on star count
 */
export function isThemeUnlocked(theme: Theme, totalStars: number): boolean {
  return totalStars >= theme.unlockRequirement;
}
