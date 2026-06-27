import { useCallback, useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import type { Ionicons } from '@expo/vector-icons';
import { useTabTrigger } from 'expo-router/ui';
import { BAR_BOTTOM_GAP, BAR_HEIGHT, tabBarProgress } from '../tabBarVisibility';

export type IoniconName = React.ComponentProps<typeof Ionicons>['name'];
export type TabBarItem = { name: string; label: string; icon: IoniconName };

/**
 * FloatingTabBar logic: tab navigation, reduce-motion handling, and the
 * hide/show animated style. Keeps the component purely presentational.
 *
 * This is the template's baseline (light pill, no auth gating). Apps can extend
 * `items`/colors per route — e.g. a dark treatment over a full-screen feed.
 */
export function useFloatingTabBar() {
  const insets = useSafeAreaInsets();
  // name is required by the hook but switchTab/getTrigger are name-agnostic.
  const { switchTab, getTrigger } = useTabTrigger({ name: 'home' });

  // Accessibility: honor "Reduce Motion" by keeping the bar static-but-floating.
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => mounted && setReduceMotion(v));
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  const activeColor = '#007AFF';
  const inactiveColor = '#8E8E93';

  const hiddenOffset = BAR_HEIGHT + BAR_BOTTOM_GAP + insets.bottom + 24;
  const animatedStyle = useAnimatedStyle(() => {
    const p = reduceMotion ? 0 : tabBarProgress.value;
    return {
      transform: [{ translateY: p * hiddenOffset }],
      opacity: interpolate(p, [0, 1], [1, 0], Extrapolation.CLAMP),
    };
  });

  const onPressItem = useCallback(
    (name: string) => switchTab(name, { resetOnFocus: false }),
    [switchTab]
  );

  const items: TabBarItem[] = [
    { name: 'home', label: 'Home', icon: 'home-outline' },
    { name: 'profile', label: 'Profile', icon: 'person-outline' },
  ];

  const isFocused = useCallback(
    (name: string) => getTrigger(name)?.isFocused ?? false,
    [getTrigger]
  );

  return { insets, animatedStyle, activeColor, inactiveColor, items, onPressItem, isFocused };
}
