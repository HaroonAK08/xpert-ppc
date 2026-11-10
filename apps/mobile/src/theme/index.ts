export const colors = {
  background: '#F7F8FA',
  surface: '#FFFFFF',
  surfaceMuted: '#F2F4F7',
  border: '#E2E6EC',
  borderSubtle: '#EDF0F3',
  text: '#182230',
  textSecondary: '#526071',
  textMuted: '#667085',
  brand: '#2563EB',
  brandDark: '#182230',
  brandDeep: '#182230',
  brandSoft: '#EFF4FF',
  accent: '#0891B2',
  danger: '#B42318',
  dangerSoft: '#FEF3F2',
  warning: '#A15C07',
  warningSoft: '#FFFAEB',
  success: '#23764B',
  successSoft: '#EDF8F1',
  white: '#FFFFFF',
  overlay: 'rgba(16, 24, 40, 0.32)',
  status: {
    new: '#2563EB',
    contacted: '#635BB5',
    replied: '#087E91',
    interested: '#23764B',
    follow_up: '#A15C07',
    converted: '#23764B',
    not_interested: '#667085',
    closed: '#526071',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  screen: 20,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 12,
  xl: 16,
  xxl: 20,
  pill: 999,
} as const;

export const typography = {
  display: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.6,
  },
  brand: {
    fontSize: 22,
    fontWeight: '700' as const,
    letterSpacing: -0.4,
  },
  title: {
    fontSize: 22,
    fontWeight: '600' as const,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500' as const,
  },
  small: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '500' as const,
  },
};

export const shadows = {
  xs: {
    shadowColor: '#182230',
    shadowOpacity: 0.025,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 0,
  },
  card: {
    shadowColor: '#182230',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 0,
  },
  raised: {
    shadowColor: '#182230',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  floating: {
    shadowColor: '#182230',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
};

export const layout = {
  tabBarHeight: 68,
};

export const theme = { colors, spacing, radius, typography, shadows, layout };
