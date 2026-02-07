import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

/**
 * Hook that calls a callback when the app transitions
 * from background/inactive to active state.
 */
export function useAppState(onChange: (status: AppStateStatus) => void) {
  const savedCallback = useRef(onChange);
  savedCallback.current = onChange;

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status) => {
      savedCallback.current(status);
    });
    return () => subscription.remove();
  }, []);
}
