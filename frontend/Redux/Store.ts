import { configureStore,combineReducers } from '@reduxjs/toolkit';
import userReducer from './Slices/UserSlice';
import {persistReducer,persistStore} from "redux-persist"
import storage from "redux-persist/lib/storage"
import themeReducer from './Slices/ThemeSlice';



const rootReducer = combineReducers({
    user: userReducer,
    theme: themeReducer
})

const persistConfig = {
    key: 'root',
    storage,
    version:1,
}

const persistedReducer = persistReducer(persistConfig,rootReducer)


export const store = configureStore({
    reducer:persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store)