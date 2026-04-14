/**
 * index.ts
 *
 * Configures and exports the Redux store for the application. Combines
 * all slice reducers and wires in the RTK Query middleware required for
 * caching, invalidation, and lifecycle management.
 *
 * Reducer map:
 *   - collection        UI filter, sort, and pagination state (collectionSlice)
 *   - auth              Authenticated user and session state (authSlice)
 *   - [cardsApi]        RTK Query cache for all card data operations (cardsApi)
 *
 * Middleware:
 *   - cardsApi.middleware  Must be included alongside the cardsApi reducer to
 *                          enable cache expiration, polling, and invalidation
 *
 * Exported types:
 *   - RootState    Inferred shape of the full store state tree; used by useAppSelector
 *   - AppDispatch  Inferred dispatch type; used by useAppDispatch
 */

import { configureStore } from '@reduxjs/toolkit'
import collectionReducer from '../features/collection/collectionSlice'
import authReducer from '../features/auth/authSlice'
import { cardsApi } from '../features/cards/cardsApi'

// ─── Assemble and configure the Redux store ──────────────────────────────
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
