import { Tabs } from 'expo-router';
import { Text } from 'react-native';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  return (
    <Text
      className={`text-lg font-bold ${focused ? 'text-[#007AFF]' : 'text-[#8E8E93]'}`}
    >
      {name}
    </Text>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: { borderTopColor: '#E5E5EA' },
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="H" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="P" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
