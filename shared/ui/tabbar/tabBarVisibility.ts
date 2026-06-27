import { makeMutable, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Geometry of the floating tab bar pill. Shared so screens can pad content
 * out from under the bar and so the hide animation knows how far to travel.
 */
export const BAR_HEIGHT = 64;
export const BAR_BOTTOM_GAP = 12;
export const BAR_H_MARGIN = 16;

/**
 * Hide/show progress driven on the UI thread by a screen's scroll handler.
 * 0 = fully shown, 1 = fully hidden. Lives at module scope (via `makeMutable`)
 * so any scrollable screen (writer) and the floating bar (reader) share one
 * value without prop drilling. Drive it with `useTabBarScroll`.
 */
export const tabBarProgress = makeMutable(0);

/** Reveal the bar (e.g. when leaving a scrollable screen or reaching the top). Safe from JS. */
export function showTabBar() {
  tabBarProgress.value = withTiming(0, { duration: 180 });
}

/** Total vertical space the floating bar occupies, including the safe-area inset. */
export function useFloatingTabBarHeight() {
  const insets = useSafeAreaInsets();
  return insets.bottom + BAR_HEIGHT + BAR_BOTTOM_GAP;
}
