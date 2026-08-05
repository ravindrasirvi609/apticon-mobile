export const colors = {
  primary: '#8B1A1A',
  primaryDark: '#6B0F0F',
  primaryMuted: '#F5E6E6',
  accent: '#D4AF37',
  accentMuted: '#FFF0A0',
  success: '#059669',
  successMuted: '#D1FAE5',
  warning: '#92400E',
  warningMuted: '#FEF3C7',
  danger: '#DC2626',
  dangerMuted: '#FEE2E2',
  background: '#FFFDE7',
  card: '#FFFFFF',
  border: '#FFECB3',
  text: '#1A1A2E',
  textSecondary: '#5D4037',
  textMuted: '#8D7B6F',
  white: '#FFFFFF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const;

export const typography = {
  heading: { fontSize: 20, fontWeight: '700' as const, color: colors.text },
  headingLarge: { fontSize: 22, fontWeight: '700' as const, color: colors.text },
  subheading: { fontSize: 16, fontWeight: '600' as const, color: colors.text },
  body: { fontSize: 14, fontWeight: '400' as const, color: colors.text },
  bodyBold: { fontSize: 14, fontWeight: '600' as const, color: colors.text },
  caption: { fontSize: 12, fontWeight: '400' as const, color: colors.textSecondary },
  button: { fontSize: 15, fontWeight: '700' as const },
} as const;

export const shadow = {
  soft: {
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
} as const;

export const touchTarget = {
  minHeight: 48,
} as const;
