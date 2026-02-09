import { Text, View } from 'react-native';
import { Screen } from '@shared/ui/screen';
import { useAuthStore } from '@modules/auth/store';

export function HomeScreen() {
  const user = useAuthStore((s) => s.user);

  return (
    <Screen>
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-[28px] font-bold text-[#1C1C1E] mb-2">
          Hello, {user?.name ?? 'there'}
        </Text>
        <Text className="text-base text-[#8E8E93]">Welcome to Expo Stack</Text>
      </View>
    </Screen>
  );
}
