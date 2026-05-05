import '../src/index.css';
import type { Preview } from '@storybook/react';
import React from 'react';

const STATIC_THEME = {
  background: '#000000',
  secondary: '#1E1E1F',
  secondaryForeground: '#BABABA',
  foreground: '#FFFFFF',
  accentForeground: '#335FFF',
  primary: '#FFFFFF'
};

const applyStaticTheme = () => {
  if (typeof document === 'undefined') return;

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
  document.documentElement.style.setProperty('--primary', STATIC_THEME.primary);
};

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      disableSaveFromUI: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    }
  },
  decorators: [
    (Story) => {
      applyStaticTheme();
      return <Story />;
    }
  ]
};

export default preview;
