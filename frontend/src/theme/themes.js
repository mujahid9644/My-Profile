export const THEME_STORAGE_KEY = 'portfolio-theme';

export const themes = [
  {
    id: 'cyber-blue',
    name: 'Lightning Orange',
    description: 'Sharp cyan energy ',
    tokens: {
      '--bg-primary': '#5f0a0a',
      '--bg-secondary': '#5f0a0a',
      '--text-primary': '#f47676',
      '--text-muted': '#fababa',
      '--accent-primary': '#f8a3a3',
      '--accent-secondary': '#8e1010',
      '--card-bg': 'rgba(8, 17, 30, 0.72)',
      '--card-border': 'rgba(96, 214, 255, 0.24)',
      '--glow-color': '77, 220, 255',
      '--success-color': '72, 201, 176',
      '--danger-color': '255, 117, 117',
    },
  },
  {
    id: 'purple-luxury',
    name: 'Purple Luxury',
    description: 'violet glow with premium vibes.',
    tokens: {
      '--bg-primary': '#090712',
      '--bg-secondary': '#171126',
      '--text-primary': '#e595e8',
      '--text-muted': '#c0b8d7',
      '--accent-primary': '#c69bff',
      '--accent-secondary': '#ff7adf',
      '--card-bg': 'rgba(20, 14, 32, 0.76)',
      '--card-border': 'rgba(198, 155, 255, 0.26)',
      '--glow-color': '198, 155, 255',
      '--success-color': '96, 224, 180',
      '--danger-color': '255, 130, 164',
    },
  },
  {
    id: 'emerald-tech',
    name: 'Emerald Tech',
    description: 'Fresh green for AI-product feel.',
    tokens: {
      '--bg-primary': '#246274',
      '--bg-secondary': '#1e5261',
      '--text-primary': '#95e8e4',
      '--text-muted': '#a7c8b7',
      '--accent-primary': '#59f0b5',
      '--accent-secondary': '#1e5261',
      '--card-bg': 'rgba(8, 25, 18, 0.75)',
      '--card-border': 'rgba(89, 240, 181, 0.24)',
      '--glow-color': '89, 240, 181',
      '--success-color': '89, 240, 181',
      '--danger-color': '255, 126, 126',
    },
  },
];

export const themeById = themes.reduce((accumulator, theme) => {
  accumulator[theme.id] = theme;
  return accumulator;
}, {});
