export const colors = {
  background: '#F4F6FB',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF2F9',
  border: '#E7EBF2',
  borderSubtle: '#F0F3F8',
  text: '#0B1220',
  textSecondary: '#5B6472',
  textMuted: '#939BA8',
  brand: '#1476FF',
  brandDark: '#001833',
  brandDeep: '#06142B',
  brandSoft: '#E6F0FF',
  accent: '#06B6D4',
  danger: '#DC2626',
  dangerSoft: '#FDE8E8',
  warning: '#D97706',
  warningSoft: '#FDF1DD',
  success: '#16A34A',
  successSoft: '#E4F7EA',
  white: '#FFFFFF',
  overlay: 'rgba(3, 12, 27, 0.55)',
  status: {
    new: '#1476FF',
    contacted: '#6366F1',
    replied: '#06B6D4',
    interested: '#16A34A',
    follow_up: '#D97706',
    converted: '#15803D',
    not_interested: '#64748B',
    closed: '#475569',
  },
} as const;

export const gradients = {
  hero: ['#001833', '#062A52', '#0E4D9C'] as const,
  brandButton: ['#2E8CFF', '#1476FF', '#0C5FDB'] as const,
  sheen: ['rgba(255,255,255,0.14)', 'rgba(255,255,255,0)'] as const,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  pill: 999,
} as const;

export const typography = {
  display: {
    fontSize: 30,
    fontWeight: '800' as const,
    letterSpacing: 0.2,
  },
  brand: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: 0.4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700' as const,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  small: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
};

export const shadows = {
  xs: {
    shadowColor: '#001833',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  card: {
    shadowColor: '#001833',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  raised: {
    shadowColor: '#001833',
    shadowOpacity: 0.12,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  floating: {
    shadowColor: '#001833',
    shadowOpacity: 0.18,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 14 },
    elevation: 12,
  },
};

export const motion = {
  press: { damping: 16, stiffness: 320 },
  release: { damping: 12, stiffness: 220 },
  fast: 160,
  base: 240,
  slow: 420,
};

export const layout = {
  tabBarHeight: 60,
  tabBarSideMargin: 16,
  tabBarBottomMargin: 14,
};

export const theme = { colors, gradients, spacing, radius, typography, shadows, motion, layout };
