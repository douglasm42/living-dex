export interface PokemonGame {
  gen: number
  name: string
  color: string
  backgroundColor: string
}

export const GAMES: Record<string, PokemonGame> = {
  red: {
    gen: 1,
    name: 'Red',
    color: 'var(--cp-red)',
    backgroundColor: 'color-mix(in srgb, var(--cp-red) 20%, transparent)',
  },
  green: {
    gen: 1,
    name: 'Green',
    color: 'var(--cp-green)',
    backgroundColor: 'color-mix(in srgb, var(--cp-green) 20%, transparent)',
  },
  blue: {
    gen: 1,
    name: 'Blue',
    color: 'var(--cp-blue)',
    backgroundColor: 'color-mix(in srgb, var(--cp-blue) 20%, transparent)',
  },
  yellow: {
    gen: 1,
    name: 'Yellow',
    color: 'var(--cp-yellow)',
    backgroundColor: 'color-mix(in srgb, var(--cp-yellow) 20%, transparent)',
  },
  fireRed: {
    gen: 1,
    name: 'FireRed',
    color: 'var(--cp-red)',
    backgroundColor: 'color-mix(in srgb, var(--cp-red) 20%, transparent)',
  },
  leafGreen: {
    gen: 1,
    name: 'LeafGreen',
    color: 'var(--cp-green)',
    backgroundColor: 'color-mix(in srgb, var(--cp-green) 20%, transparent)',
  },
  pikachu: {
    gen: 1,
    name: "Let's Go, Pikachu!",
    color: 'var(--cp-yellow)',
    backgroundColor: 'color-mix(in srgb, var(--cp-yellow) 20%, transparent)',
  },
  eevee: {
    gen: 1,
    name: "Let's Go, Eevee!",
    color: 'var(--cp-rosewater)',
    backgroundColor: 'color-mix(in srgb, var(--cp-rosewater) 20%, transparent)',
  },
  gold: {
    gen: 2,
    name: 'Gold',
    color: 'var(--cp-yellow)',
    backgroundColor: 'color-mix(in srgb, var(--cp-yellow) 20%, transparent)',
  },
  silver: {
    gen: 2,
    name: 'Silver',
    color: '#4c4f69',
    backgroundColor: '#dce0e8',
  },
  crystal: {
    gen: 2,
    name: 'Crystal',
    color: 'var(--cp-teal)',
    backgroundColor: 'color-mix(in srgb, var(--cp-teal) 20%, transparent)',
  },
  heartGold: {
    gen: 2,
    name: 'HeartGold',
    color: 'var(--cp-yellow)',
    backgroundColor: 'color-mix(in srgb, var(--cp-yellow) 20%, transparent)',
  },
  soulSilver: {
    gen: 2,
    name: 'SoulSilver',
    color: '#4c4f69',
    backgroundColor: '#dce0e8',
  },
  ruby: {
    gen: 3,
    name: 'Ruby',
    color: 'var(--cp-red)',
    backgroundColor: 'color-mix(in srgb, var(--cp-red) 20%, transparent)',
  },
  sapphire: {
    gen: 3,
    name: 'Sapphire',
    color: 'var(--cp-sapphire)',
    backgroundColor: 'color-mix(in srgb, var(--cp-sapphire) 20%, transparent)',
  },
  emerald: {
    gen: 3,
    name: 'Emerald',
    color: 'var(--cp-green)',
    backgroundColor: 'color-mix(in srgb, var(--cp-green) 20%, transparent)',
  },
  omegaRuby: {
    gen: 3,
    name: 'Omega Ruby',
    color: 'var(--cp-red)',
    backgroundColor: 'color-mix(in srgb, var(--cp-red) 20%, transparent)',
  },
  alphaSapphire: {
    gen: 3,
    name: 'Alpha Sapphire',
    color: 'var(--cp-sapphire)',
    backgroundColor: 'color-mix(in srgb, var(--cp-sapphire) 20%, transparent)',
  },
  diamond: {
    gen: 4,
    name: 'Diamond',
    color: 'var(--cp-lavender)',
    backgroundColor: 'color-mix(in srgb, var(--cp-lavender) 20%, transparent)',
  },
  pearl: {
    gen: 4,
    name: 'Pearl',
    color: 'var(--cp-flamingo)',
    backgroundColor: 'color-mix(in srgb, var(--cp-flamingo) 20%, transparent)',
  },
  platinum: {
    gen: 4,
    name: 'Platinum',
    color: 'var(--cp-rosewater)',
    backgroundColor: 'color-mix(in srgb, var(--cp-rosewater) 20%, transparent)',
  },
  brilliantDiamond: {
    gen: 4,
    name: 'Brilliant Diamond',
    color: 'var(--cp-lavender)',
    backgroundColor: 'color-mix(in srgb, var(--cp-lavender) 20%, transparent)',
  },
  shiningPearl: {
    gen: 4,
    name: 'Shining Pearl',
    color: 'var(--cp-flamingo)',
    backgroundColor: 'color-mix(in srgb, var(--cp-flamingo) 20%, transparent)',
  },
  black: {
    gen: 5,
    name: 'Black',
    color: '#dce0e8',
    backgroundColor: '#232323',
  },
  white: {
    gen: 5,
    name: 'White',
    color: '#232323',
    backgroundColor: '#dce0e8',
  },
  black2: {
    gen: 5,
    name: 'Black 2',
    color: '#dce0e8',
    backgroundColor: '#232323',
  },
  white2: {
    gen: 5,
    name: 'White 2',
    color: '#232323',
    backgroundColor: '#dce0e8',
  },
  x: {
    gen: 6,
    name: 'X',
    color: 'var(--cp-blue)',
    backgroundColor: 'color-mix(in srgb, var(--cp-blue) 20%, transparent)',
  },
  y: {
    gen: 6,
    name: 'Y',
    color: 'var(--cp-red)',
    backgroundColor: 'color-mix(in srgb, var(--cp-red) 20%, transparent)',
  },
  sun: {
    gen: 7,
    name: 'Sun',
    color: 'var(--cp-yellow)',
    backgroundColor: 'color-mix(in srgb, var(--cp-yellow) 20%, transparent)',
  },
  moon: {
    gen: 7,
    name: 'Moon',
    color: 'var(--cp-sky)',
    backgroundColor: 'color-mix(in srgb, var(--cp-sky) 20%, transparent)',
  },
  ultraSun: {
    gen: 7,
    name: 'Ultra Sun',
    color: 'var(--cp-yellow)',
    backgroundColor: 'color-mix(in srgb, var(--cp-yellow) 20%, transparent)',
  },
  ultraMoon: {
    gen: 7,
    name: 'Ultra Moon',
    color: 'var(--cp-sky)',
    backgroundColor: 'color-mix(in srgb, var(--cp-sky) 20%, transparent)',
  },
  sword: {
    gen: 8,
    name: 'Sword',
    color: 'var(--cp-red)',
    backgroundColor: 'color-mix(in srgb, var(--cp-red) 20%, transparent)',
  },
  shield: {
    gen: 8,
    name: 'Shield',
    color: 'var(--cp-blue)',
    backgroundColor: 'color-mix(in srgb, var(--cp-blue) 20%, transparent)',
  },
  arceus: {
    gen: 8,
    name: 'Legends: Arceus',
    color: 'var(--cp-teal)',
    backgroundColor: 'color-mix(in srgb, var(--cp-teal) 20%, transparent)',
  },
  scarlet: {
    gen: 9,
    name: 'Scarlet',
    color: 'var(--cp-red)',
    backgroundColor: 'color-mix(in srgb, var(--cp-red) 20%, transparent)',
  },
  violet: {
    gen: 9,
    name: 'Violet',
    color: 'var(--cp-mauve)',
    backgroundColor: 'color-mix(in srgb, var(--cp-mauve) 20%, transparent)',
  },
  za: {
    gen: 9,
    name: 'Legends: Z-A',
    color: 'var(--cp-teal)',
    backgroundColor: 'color-mix(in srgb, var(--cp-teal) 20%, transparent)',
  },
}
