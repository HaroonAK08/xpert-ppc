export const colors = {
  background: '#F4F7F5',
  surface: '#FFFFFF',
  surfaceMuted: '#E8F0EB',
  border: '#D5E0D9',
  text: '#0F1C16',
  textSecondary: '#5A6B62',
  textMuted: '#8A9A91',
  brand: '#1F7A4D',
  brandDark: '#0B1F17',
  brandSoft: '#D9F0E4',
  accent: '#2E9B63',
  danger: '#C0392B',
  warning: '#C47F17',
  success: '#1F7A4D',
  white: '#FFFFFF',
  overlay: 'rgba(11, 31, 23, 0.45)',
  status: {
    new: '#3B82F6',
    contacted: '#6366F1',
    replied: '#0D9488',
    interested: '#16A34A',
    follow_up: '#D97706',
    converted: '#15803D',
    not_interested: '#64748B',
    closed: '#475569',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const typography = {
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
  card: {
    shadowColor: '#0B1F17',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
};

export const theme = { colors, spacing, radius, typography, shadows };
