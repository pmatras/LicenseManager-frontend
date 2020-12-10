import { createSlice } from '@reduxjs/toolkit';

import {
  getThemePreference,
  changeThemePreference,
} from '../../common/themeUtils';

const initialState = {
  isMenuDocked: false,
  isMenuOpened: false,
  areSettingsOpened: false,
  isUserMenuOpened: false,
  selectedTheme: getThemePreference(),
  toastsList: [],
  pageTitle: 'Home page',
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    changePageTitle: (state, { payload }) => {
      return {
        ...state,
        pageTitle: payload,
      };
    },
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
    closeUserMenu: (state) => {
      return {
        ...state,
        isUserMenuOpened: false,
      };
    },
    toggleUserMenu: (state) => {
      return {
        ...state,
        isUserMenuOpened: !state.isUserMenuOpened,
      };
    },
    selectTheme: (state, { payload }) => {
      changeThemePreference(payload);
      return {
        ...state,
        selectedTheme: payload,
      };
    },
    addToast: (state, { payload }) => {
      return {
        ...state,
        toastsList: [...state.toastsList, payload],
      };
    },
    removeToast: (state, { payload }) => {
      return {
        ...state,
        toastsList: state.toastsList.filter(({ id }) => id !== payload),
      };
    },
  },
});

const {
  reducer: navigationReducer,
  actions: {
    changePageTitle,
    closeMenu,
    toggleMenu,
    toggleMenuDock,
    closeSettings,
    toggleSettings,
    closeUserMenu,
    toggleUserMenu,
    selectTheme,
    addToast,
    removeToast,
  },
} = navigationSlice;

export {
  navigationReducer,
  changePageTitle,
  closeMenu,
  toggleMenu,
  toggleMenuDock,
  closeSettings,
  toggleSettings,
  closeUserMenu,
  toggleUserMenu,
  selectTheme,
  addToast,
  removeToast,
};
