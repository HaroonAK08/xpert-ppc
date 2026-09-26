export const colors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF3F9',
  border: '#E1E7EF',
  text: '#0B1220',
  textSecondary: '#5B6472',
  textMuted: '#939BA8',
  brand: '#1476FF',
  brandDark: '#001833',
  brandSoft: '#E6F0FF',
  accent: '#06B6D4',
  danger: '#DC2626',
  warning: '#D97706',
  success: '#16A34A',
  white: '#FFFFFF',
  overlay: 'rgba(0, 24, 51, 0.5)',
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
    shadowColor: '#001833',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
};

export const theme = { colors, spacing, radius, typography, shadows };
