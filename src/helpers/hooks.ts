import { useEffect, useRef } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

type IntervalFunction = () => unknown | void;

/**
 * Custom hook which sets up an interval and clears it after unmounting
 * @param callback {IntervalFunction} - Callback to call on each iteration
 * @param delay {number | null} - Delay in miliseconds
 */
export const useInterval = (
  callback: IntervalFunction,
  delay: number | null
) => {
  const savedCallback = useRef<IntervalFunction | null>(null);

  useEffect(() => {
    if (delay === null) return;
    savedCallback.current = callback;
  });

  useEffect(() => {
    if (delay === null) return;
    function tick() {
      if (savedCallback.current !== null) {
        savedCallback.current();
      }
    }
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
};

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
