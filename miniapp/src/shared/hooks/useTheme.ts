import { useEffect } from 'react';
import { areColorsTooClose, lightnessHex } from '../util/theme.util';
import { useSignal, themeParams } from '@telegram-apps/sdk-react';
import { THEME_MODE } from '../constants';

const STATIC_THEME = {
  background: '#000000',
  secondary: '#1E1E1F',
  secondaryForeground: '#BABABA',
  foreground: '#FFFFFF',
  accentForeground: '#335FFF',
  primary: '#FFFFFF'
};

export const useTheme = () => {
  // const isDark = useSignal(themeParams.isDark);
  const isDark = true;
  const isMounted = useSignal(themeParams.isMounted);

  const background = themeParams.backgroundColor() ?? STATIC_THEME.background;

  const secondaryCandidate =
    themeParams.bottomBarBgColor() ??
    lightnessHex(background, isDark ? 10 : -10) ??
    STATIC_THEME.secondary;

  const useAdjustedSecondary = areColorsTooClose(
    background,
    secondaryCandidate,
    1
  );

  const secondary = useAdjustedSecondary
    ? lightnessHex(background, isDark ? 10 : -10)
    : secondaryCandidate;

  const secondaryForeground =
    lightnessHex(secondary ?? '', isDark ? 5 : -5) ??
    STATIC_THEME.secondaryForeground;

  useEffect(() => {
    if (THEME_MODE === 'telegram') {
      document.documentElement.style.setProperty('--background', background);
      document.documentElement.style.setProperty(
        '--secondary',
        secondary ?? STATIC_THEME.secondary
      );
      document.documentElement.style.setProperty(
        '--secondary-foreground',
        secondaryForeground
      );
      document.documentElement.style.setProperty(
        '--foreground',
        themeParams.textColor() ?? STATIC_THEME.foreground
      );
      document.documentElement.style.setProperty(
        '--accent-foreground',
        themeParams.buttonTextColor() ?? STATIC_THEME.accentForeground
      );
      document.documentElement.style.setProperty(
        '--primary',
        themeParams.buttonColor() ?? STATIC_THEME.primary
      );
    } else {
      document.documentElement.style.setProperty(
        '--background',
        STATIC_THEME.background
      );
      document.documentElement.style.setProperty(
        '--secondary',
        STATIC_THEME.secondary
      );
      document.documentElement.style.setProperty(
        '--secondary-foreground',
        STATIC_THEME.secondaryForeground
      );
      document.documentElement.style.setProperty(
        '--foreground',
        STATIC_THEME.foreground
      );
      document.documentElement.style.setProperty(
        '--accent-foreground',
        STATIC_THEME.accentForeground
      );
      document.documentElement.style.setProperty(
        '--primary',
        STATIC_THEME.primary
      );
    }
  }, [isDark, isMounted]);

  return {
    secondary: THEME_MODE === 'telegram' ? secondary : STATIC_THEME.secondary,
    secondaryForeground:
      THEME_MODE === 'telegram'
        ? secondaryForeground
        : STATIC_THEME.secondaryForeground,
    background:
      THEME_MODE === 'telegram' ? background : STATIC_THEME.background,
    textColor:
      THEME_MODE === 'telegram'
        ? themeParams.textColor()
        : STATIC_THEME.foreground,
    buttonTextColor:
      THEME_MODE === 'telegram'
        ? themeParams.buttonTextColor()
        : STATIC_THEME.accentForeground,
    buttonColor:
      THEME_MODE === 'telegram'
        ? themeParams.buttonColor()
        : STATIC_THEME.primary,
    darkMode: isDark
  };
};
