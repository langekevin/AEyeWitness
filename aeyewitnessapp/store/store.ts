import {
    combineReducers,
    configureStore,
} from '@reduxjs/toolkit';
import { api } from './services/api';
import QueryErrorHandler from '@/utils/QueryErrorHandler';

const rootReducer = combineReducers({
    [api.reducerPath]: api.reducer
})

export const setupStore = () => configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    })
        .concat(QueryErrorHandler, api.middleware),
})

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
