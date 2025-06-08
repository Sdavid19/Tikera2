import { configureStore } from '@reduxjs/toolkit';
import movieReducer from './movieSlice';
import authReducer from './authSlice';
import { movieApi } from '../services/movieApi';

export const store = configureStore({
  reducer: {
    movieScreening: movieReducer,
    auth: authReducer,
    [movieApi.reducerPath]: movieApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(movieApi.middleware),
});
