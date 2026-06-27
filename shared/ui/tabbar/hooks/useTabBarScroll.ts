import { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { useAnimatedScrollHandler, useSharedValue, withTiming } from 'react-native-reanimated';
import { showTabBar, tabBarProgress } from '../tabBarVisibility';

/**
 * Makes the floating tab bar react to a screen's scroll: hides on scroll-down,
 * shows on scroll-up / at the top. Attach the returned handler to an
 * `Animated.ScrollView`/`Animated.FlatList`:
 *
 * ```tsx
 * const scrollHandler = useTabBarScroll();
 * <Animated.FlatList onScroll={scrollHandler} scrollEventThrottle={16} ... />
 * ```
 *
 * A small threshold avoids jitter; the bar is revealed on focus/blur so other
 * tabs never inherit a hidden bar.
 */
export function useTabBarScroll() {
  const lastY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y;
      const delta = y - lastY.value;
      if (y <= 0) {
        tabBarProgress.value = withTiming(0, { duration: 150 });
      } else if (delta > 6) {
        tabBarProgress.value = withTiming(1, { duration: 220 });
      } else if (delta < -6) {
        tabBarProgress.value = withTiming(0, { duration: 220 });
      }
      lastY.value = y;
    },
  });

  useFocusEffect(
    useCallback(() => {
      showTabBar();
      lastY.value = 0;
      return () => showTabBar();
    }, [lastY])
  );

  return scrollHandler;
}
