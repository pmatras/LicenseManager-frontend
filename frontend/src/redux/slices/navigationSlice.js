import { createSlice } from '@reduxjs/toolkit';

import {
  getThemePreference,
  changeThemePreference,
} from '../../common/themeUtils';

const initialState = {
  isMenuDocked: false,
  isMenuOpened: false,
  areSettingsOpened: false,
  selectedTheme: getThemePreference(),
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    closeMenu: (state) => {
      return {
        ...state,
        isMenuOpened: false,
      };
    },
    toggleMenu: (state) => {
      return {
        ...state,
        isMenuOpened: !state.isMenuOpened,
      };
    },
    toggleMenuDock: (state) => {
      return {
        ...state,
        isMenuDocked: !state.isMenuDocked,
      };
    },
    closeSettings: (state) => {
      return {
        ...state,
        areSettingsOpened: false,
      };
    },
    toggleSettings: (state) => {
      return {
        ...state,
        areSettingsOpened: !state.areSettingsOpened,
      };
    },
    selectTheme: (state, { payload }) => {
      changeThemePreference(payload);
      return {
        ...state,
        selectedTheme: payload,
      };
    },
  },
});

const {
  reducer: navigationReducer,
  actions: {
    closeMenu,
    toggleMenu,
    toggleMenuDock,
    closeSettings,
    toggleSettings,
    selectTheme,
  },
} = navigationSlice;

export {
  navigationReducer,
  closeMenu,
  toggleMenu,
  toggleMenuDock,
  closeSettings,
  toggleSettings,
  selectTheme,
};
