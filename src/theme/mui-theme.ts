'use client';
import { createTheme } from '@mui/material/styles';
import { tokens } from './tokens';

export const muiTheme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: tokens.colors.blue,
      dark: tokens.colors.blueDark,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: tokens.colors.green,
      contrastText: '#FFFFFF',
    },
    text: {
      primary: tokens.colors.text,
      secondary: tokens.colors.muted,
    },
    background: {
      default: '#FFFFFF',
      paper: tokens.colors.surface,
    },
  },
  typography: {
    fontFamily: tokens.font.sans,
    h1: {
      fontFamily: tokens.font.display,
      fontWeight: 900,
      letterSpacing: '-0.045em',
      lineHeight: 1.05,
    },
    h2: {
      fontFamily: tokens.font.display,
      fontWeight: 900,
      letterSpacing: '-0.035em',
      lineHeight: 1.12,
    },
    h3: {
      fontWeight: 800,
      letterSpacing: '-0.025em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 800,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.md,
          minHeight: 42,
          padding: '0 24px',
          boxShadow: 'none',
          fontSize: '14px',
          lineHeight: 1.2,
          // Touch devices need a ~44px minimum hit area; pointer media queries
          // keep desktop at the designed 42px.
          '@media (hover: none) and (pointer: coarse)': {
            minHeight: 46,
          },
        },
        sizeLarge: {
          minHeight: 48,
          padding: '0 28px',
          fontSize: '15px',
        },
        sizeSmall: {
          minHeight: 36,
          padding: '0 18px',
          fontSize: '13px',
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            color: tokens.colors.surface,
            backgroundColor: tokens.colors.blue,
            boxShadow: '0 1px 1px 0 rgba(0, 0, 0, 0.2)',
            '&:hover, &:focus-visible': {
              color: tokens.colors.surface,
              backgroundColor: tokens.colors.blueDark,
              boxShadow: '0 1px 1px 0 rgba(0, 0, 0, 0.2)',
            },
            '&:active': {
              color: tokens.colors.surface,
              backgroundColor: tokens.colors.blueDarker,
              boxShadow: '0 1px 1px 0 rgba(0, 0, 0, 0.2)',
            },
          },
        },
        {
          props: { variant: 'outlined', color: 'primary' },
          style: {
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
            },
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.lg,
          boxShadow: tokens.shadow.defaultShadow,
          border: `1px solid ${tokens.colors.borderSoft}`,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: tokens.radius.sm,
            backgroundColor: '#FFFFFF',
          },
          // iOS Safari zooms the whole page in when a focused field's text is
          // under 16px, and never zooms back out. Below the `sm` breakpoint the
          // inputs are therefore 16px; desktop keeps the designed 14px.
          '@media (max-width: 599.98px)': {
            '& .MuiOutlinedInput-input, & .MuiOutlinedInput-inputMultiline': {
              fontSize: '16px',
            },
            '& .MuiInputLabel-root': {
              fontSize: '16px',
            },
          },
        },
      },
    },
  },
});
