// src/utils/theme.js
import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0F2E3D',      // Bleu profond élégant
    accent: '#D4A373',        // Beige chaud
    background: '#F8F9FA',    // Fond gris très clair
    surface: '#FFFFFF',        // Blanc pur
    text: '#2D3E50',          // Texte foncé
    disabled: '#ADB5BD',
    placeholder: '#6C757D',
    backdrop: 'rgba(0,0,0,0.3)',
    success: '#2A9D8F',       // Vert doux
    warning: '#E9C46A',        // Jaune chaud
    error: '#E76F51',          // Terracotta
    card: '#FFFFFF',
    border: '#E9ECEF',
  },
  roundness: 16,
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100',
    },
  },
};

export const USER_ROLES = {
  CLIENT: 'client',
  SUPPLIER: 'supplier',
};