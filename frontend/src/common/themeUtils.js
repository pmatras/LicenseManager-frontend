import { THEMES } from '../themes/themes';

const PREFFERED_THEME_KEY = 'preferred_theme';

const getThemePreference = () => {
  const theme = localStorage.getItem(PREFFERED_THEME_KEY);
  if (theme !== null && theme !== '') {
    return theme;
  } else {
    return window.matchMedia('(prefers-color-scheme: light)').matches
      ? THEMES.light
      : THEMES.dark;
  }
};

const changeThemePreference = (theme) => {
  localStorage.setItem(PREFFERED_THEME_KEY, theme);
};

export { getThemePreference, changeThemePreference };
