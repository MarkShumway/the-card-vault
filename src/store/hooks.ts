import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './index'

/*
Redux useDispatch and useSelector hooks are generic
By wrapping them here with your RootState and AppDispatch types,
every component that uses these hooks gets full autocomplete and type safety.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
    useSelector(selector)
