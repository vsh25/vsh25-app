type Shadow = {
  elevation?: number;
  shadowColor?: string;
  shadowOpacity?: number;
  shadowRadius?: number;
  shadowOffset?: { width: number; height: number };
};

export const theme = {
  color: {
    // Бренд
    primary: '#2B7EEB',   // наш синий (CTA/акцент)
    primaryAlt: '#3B82F6',

    // Базовые
    bg: '#FFFFFF',        // фон страницы
    surface: '#F8FAFC',   // светлая плашка/виджет
    text: '#0F172A',      // основной текст
    muted: '#64748B',     // вторичный текст/подписи
    border: '#E2E8F0',    // обводки/разделители

    // Состояния
    success: '#16A34A',
    warning: '#F59E0B',
    danger:  '#EF4444',
  },

  // Градиенты (на будущее: hero/CTA в стиле Luma)
  grad: {
    hero: ['#1E3A8A', '#0EA5E9'],
    cta:  ['#2563EB', '#60A5FA'],
  },

  // Радиусы Luma
  radius: {
    xs: 6,
    s: 8,
    m: 12,
    l: 16,   // карточки
    xl: 24,  // крупные плашки/герои
    full: 999,
  },

  // Отступы
  space: {
    xs: 6,
    s: 10,
    m: 14,
    l: 20,
    xl: 28,
  },

  // Типографика — Rubik (Luma)
  font: {
    family: {
      regular: 'Rubik-Regular',
      medium: 'Rubik-Medium',
      semibold: 'Rubik-SemiBold',
      bold: 'Rubik-Bold',
    },
    size: {
      xs: 12,
      s: 14,
      m: 16,
      l: 20,
      xl: 24,
      xxl: 32,
    },
    line: {
      tight: 1.2,
      normal: 1.35,
      loose: 1.5,
    },
  },

  // Тени карточек (RN + Android elevation)
  shadow: {
    card: {
      elevation: 2,
      shadowColor: '#00000022',
      shadowOpacity: 0.25,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
    } as Shadow,
  },
};