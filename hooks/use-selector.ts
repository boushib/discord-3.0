import { useDispatch, useSelector as _useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../store'

export const useSelector = _useSelector.withTypes<RootState>()
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
