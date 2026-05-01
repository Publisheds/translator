import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import listReducer from "./listReducer";
import items_reducer from "./items_reducer";
import ExtendScript from "./extendScript_reducer";
import { save, load } from "redux-localstorage-simple";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem("state");
    return JSON.parse(serializedState);
  } catch (e) {
    throw new Error(e);
  }
};
const state = loadFromLocalStorage();

const saveToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (e) {
    throw new Error(e);
  }
};

export default configureStore({
  reducer: {
    list: listReducer,
    item: items_reducer,
    jsx: ExtendScript,
  },
  preloadedState: load(),
  middleware: [
    save(),
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  ],
});
