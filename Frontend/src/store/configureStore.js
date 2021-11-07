import { combineReducers, configureStore } from '@reduxjs/toolkit';
import ui from './ui';
import user from './user';

const reducer = combineReducers({ ui, user });
const store = configureStore({ reducer });

export default store;
