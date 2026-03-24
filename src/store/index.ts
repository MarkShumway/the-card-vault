import { configureStore } from '@reduxjs/toolkit'
import collectionReducer from '../features/collection/collectionSlice'
import authReducer from '../features/auth/authSlice'
import { cardsApi } from '../features/cards/cardsApi'

/* Assemble and configure the Redux store */

export const store = configureStore({
    reducer: {
        collection: collectionReducer,
        auth: authReducer,
        [cardsApi.reducerPath]: cardsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(cardsApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
