// app/theme.ts
// Единые токены для стилей: цвета, радиусы, отступы, шрифты

export const theme = {
  color: {
    primary: '#2B7EEB',     // фирменный синий
    bg: '#FFFFFF',          // фон
    text: '#0F172A',        // основной текст
    muted: '#64748B',       // вторичный текст
    border: '#E2E8F0',      // границы/линии
    danger: '#EF4444',      // ошибки
    success: '#16A34A'      // успешные статусы
  },
  radius: { xs: 6, s: 8, m: 12, l: 16, xl: 24 },
  space:  { xs: 6, s: 10, m: 14,  l: 20, xl: 28 },
  font: {
    family: { regular: 'System', bold: 'System' }, // позже подменим на шрифты из UI8
    size:   { xs: 12, s: 14, m: 16, l: 20, xl: 24 },
    line:   { tight: 1.2, normal: 1.35, loose: 1.5 }
  },
  shadow: {
    card: { // базовая тень для карточек
      elevation: 2, // Android
      shadowColor: '#00000022', shadowOpacity: 0.25, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } // iOS
    }
  }
};

export type Theme = typeof theme;