import { Tabs, TabList, TabSlot, TabTrigger } from 'expo-router/ui';
import { FloatingTabBar } from '@shared/ui/tabbar/FloatingTabBar';

export default function TabsLayout() {
  return (
    <Tabs>
      <TabSlot />

      {/* Hidden config: declares the routes for the headless tab navigator.
          The visible, scroll-reactive floating bar lives in FloatingTabBar.
          Drive hide/show from a screen with `useTabBarScroll`. */}
      <TabList style={{ display: 'none' }}>
        <TabTrigger name="home" href="/home" />
        <TabTrigger name="profile" href="/profile" />
      </TabList>

      <FloatingTabBar />
    </Tabs>
  );
}
