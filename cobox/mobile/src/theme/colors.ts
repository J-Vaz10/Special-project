/**
 * Paleta visual inspirada en los mockups de DISEÑO COBOX.pdf:
 * fondo claro, tarjetas blancas, acentos en teal/verde agua y
 * cabeceras en azul marino oscuro.
 */
export const colors = {
  background: '#F4F6F9',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF2F6',

  navy: '#0B1F3A',
  navySoft: '#16305A',

  primary: '#0E9C8E',
  primarySoft: '#DFF4F1',
  primaryDark: '#0A7A6F',

  accentGold: '#D9A441',

  success: '#1F9D55',
  successSoft: '#E3F6E9',

  warning: '#C2790A',
  warningSoft: '#FBEBD3',

  danger: '#D6432D',
  dangerSoft: '#FBE4DF',

  text: '#101828',
  textMuted: '#4B5768',
  textSubtle: '#7C8798',
  border: '#E1E6EC',

  white: '#FFFFFF',
  overlay: 'rgba(11, 31, 58, 0.55)',
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
  lg: 18,
  pill: 999,
} as const;
