import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '@shared/ui/screen';
import { useAuthStore } from '@modules/auth/store';

export function HomeScreen() {
  const user = useAuthStore((s) => s.user);

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.greeting}>
          Hello, {user?.name ?? 'there'}
        </Text>
        <Text style={styles.subtitle}>Welcome to Expo Stack</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
});
