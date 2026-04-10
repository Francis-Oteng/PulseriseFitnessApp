/**
 * Pulserise Fitness App color palette.
 * Primary brand color: Dark blue (#060F8A) with white accents.
 */

const tintColorLight = '#060F8A';
const tintColorDark = '#ffffff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#ffffff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#0A0A1A',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
  brand: {
    primary: '#060F8A',
    primaryLight: '#1A24A8',
    primaryDark: '#030A5E',
    accent: '#4A90D9',
    white: '#ffffff',
    black: '#000000',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    grey: '#9E9E9E',
    lightGrey: '#F5F5F5',
    darkGrey: '#424242',
    cardBackground: '#0E1875',
    overlay: 'rgba(6, 15, 138, 0.85)',
  },
};
