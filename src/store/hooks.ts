/**
 * hooks.ts
 *
 * Typed wrappers around React-Redux's useDispatch and useSelector hooks.
 * Import these instead of the plain Redux hooks throughout the app to ensure
 * full TypeScript inference on dispatch calls and state selections.
 *
 * Exports:
 *   - useAppDispatch   Returns a dispatch function typed as AppDispatch,
 *                      enabling TypeScript awareness of all known action creators
 *   - useAppSelector   Accepts a selector function typed against RootState,
 *                      providing accurate return type inference on selected values
 *
 * Usage:
 *   import { useAppDispatch, useAppSelector } from '../store/hooks'
 */

import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './index'

// ─── Wrap hooks with RootState ──────────────────────────────
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
    useSelector(selector)
