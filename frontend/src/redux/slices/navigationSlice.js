import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isMenuDocked: true,
  isMenuOpened: true,
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
  },
});

const {
  reducer: navigationReducer,
  actions: { closeMenu, toggleMenu, toggleMenuDock },
} = navigationSlice;

export { navigationReducer, closeMenu, toggleMenu, toggleMenuDock };
