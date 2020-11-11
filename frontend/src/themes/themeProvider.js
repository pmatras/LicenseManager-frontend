import React, { lazy, Suspense } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { THEMES } from './themes';
import LoadingPage from '../views/loadingPage';

const LightTheme = lazy(() => import('./lightTheme'));
const DarkTheme = lazy(() => import('./darkTheme'));
const AmsterdamLightTheme = lazy(() => import('./amsterdamLightTheme'));
const AmsterdamDarkTheme = lazy(() => import('./amsterdamDarkTheme'));

const ThemeProvider = ({ selectedTheme, children }) => {
  let Theme;
  switch (selectedTheme) {
    case THEMES.light:
      Theme = LightTheme;
      break;
    case THEMES.dark:
      Theme = DarkTheme;
      break;
    case THEMES.amsterdamLight:
      Theme = AmsterdamLightTheme;
      break;
    case THEMES.amsterdamDark:
      Theme = AmsterdamDarkTheme;
      break;
  }

  return (
    <Suspense fallback={<LoadingPage />}>
      <Theme />
      {children}
    </Suspense>
  );
};

ThemeProvider.propTypes = {
  selectedTheme: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const mapStateToProps = ({ navigation }) => ({
  selectedTheme: navigation.selectedTheme,
});

export default connect(mapStateToProps)(ThemeProvider);
