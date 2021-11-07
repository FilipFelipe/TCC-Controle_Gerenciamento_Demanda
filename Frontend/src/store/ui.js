import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'ui',
  initialState: {
    toggleMenu: false,
    mainHeaderTitle: 'Dashboard',
  },
  reducers: {
    toggleMenu(state) {
      state.toggleMenu = !state.toggleMenu;
    },
    changeMainHeaderTitle(state, action) {
      state.mainHeaderTitle = action.payload;
    },
  },
});

export const { toggleMenu, changeMainHeaderTitle } = slice.actions;

export default slice.reducer;
