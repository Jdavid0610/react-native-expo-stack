import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { BAR_BOTTOM_GAP } from './tabBarVisibility';
import { useFloatingTabBar } from './hooks/useFloatingTabBar';

export function FloatingTabBar() {
  const { insets, animatedStyle, activeColor, inactiveColor, items, onPressItem, isFocused } =
    useFloatingTabBar();

  return (
    <Animated.View
      pointerEvents="box-none"
      className="absolute left-0 right-0 items-center"
      // bottom (safe-area inset) + animated transform must stay inline.
      style={[{ bottom: insets.bottom + BAR_BOTTOM_GAP }, animatedStyle]}
    >
      {/* Shadow wrapper — RN shadow/elevation props don't map cleanly to NativeWind. */}
      <View className="mx-4 rounded-[32px]" style={shadow}>
        <View className="h-16 flex-row overflow-hidden rounded-[32px]">
          {Platform.OS === 'ios' ? (
            <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFill} />
          ) : (
            <View className="absolute inset-0" style={{ backgroundColor: 'rgba(255,255,255,0.92)' }} />
          )}

          {items.map((item) => {
            const focused = isFocused(item.name);
            return (
              <Pressable
                key={item.name}
                onPress={() => onPressItem(item.name)}
                accessibilityRole="tab"
                accessibilityState={{ selected: focused }}
                accessibilityLabel={item.label}
                className="min-h-[44px] min-w-[64px] items-center justify-center px-[18px]"
              >
                <Ionicons name={item.icon} size={26} color={focused ? activeColor : inactiveColor} />
              </Pressable>
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
}

// h-16 / rounded-[32px] above mirror BAR_HEIGHT (64) and its radius (height / 2).
const shadow = {
  shadowColor: '#000',
  shadowOpacity: 0.15,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  elevation: 8,
} as const;
