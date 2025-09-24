export const theme = {
  color: {
    primary: '#2B7EEB',
    bg: '#FFFFFF',
    text: '#0F172A',
    muted: '#64748B',
    border: '#E2E8F0',
    danger: '#EF4444',
    success: '#16A34A',
  },
  radius: { xs: 6, s: 8, m: 12, l: 16, xl: 24 },
  space:  { xs: 6, s: 10, m: 14, l: 20, xl: 28 },

  // ← ставим имена, которые загрузили в App.tsx (useFonts)
  font: {
    family: {
      regular: 'Rubik-Regular',
      medium:  'Rubik-Medium',
      semibold:'Rubik-SemiBold',
      bold:    'Rubik-Bold',
    },
    size: { xs: 12, s: 14, m: 16, l: 20, xl: 24 },
    line: { tight: 1.2, normal: 1.35, loose: 1.5 },
  },

  shadow: {
    card: {
      elevation: 2,
      shadowColor: '#00000022',
      shadowOpacity: 0.25,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
    },
  },
};
export type Theme = typeof theme;