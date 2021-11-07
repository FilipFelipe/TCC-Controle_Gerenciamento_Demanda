import { createSlice } from '@reduxjs/toolkit';

const user = window.localStorage.getItem('user')
  ? JSON.parse(window.localStorage.getItem('user'))
  : null;

const slice = createSlice({
  name: 'user',
  initialState: {
    user,
  },
  reducers: {
    login(state, action) {
      state.user = action.payload;
    },
    logoff(state) {
      state.user = null;
    },
  },
});

export const { login, logoff } = slice.actions;

export default slice.reducer;
