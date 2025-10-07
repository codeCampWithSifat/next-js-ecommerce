import { combineReducers, configureStore } from "@reduxjs/toolkit";
import localStorage from "redux-persist/es/storage";
import { persistStore, persistReducer } from "redux-persist";
import authReducer from "./reducer/authReducer";

const rootReducer = combineReducers({
  authStore: authReducer,
});

const persistConfig = {
  key: "root",
  storage: localStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
