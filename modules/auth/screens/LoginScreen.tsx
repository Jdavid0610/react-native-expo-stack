import { Alert, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { Screen } from '@shared/ui/screen';
import { Input } from '@shared/ui/input';
import { Button } from '@shared/ui/button';
import { loginSchema, type LoginFormData } from '../schemas/login.schema';
import { useLogin } from '../hooks/useLogin';
import { getErrorMessage } from '@shared/utils';

export function LoginScreen() {
  const login = useLogin();

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit((data) => {
    login.mutate(data, {
      onError: (error) => Alert.alert('Login Failed', getErrorMessage(error)),
    });
  });

  return (
    <Screen>
      <KeyboardAvoidingView
        className="flex-1 justify-center px-6"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="mb-8">
          <Text className="text-[32px] font-bold text-[#1C1C1E] mb-2">
            Welcome back
          </Text>
          <Text className="text-base text-[#8E8E93]">
            Sign in to your account
          </Text>
        </View>

        <View className="gap-4">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <Input
                label="Email"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <Input
                label="Password"
                placeholder="Enter your password"
                secureTextEntry
                autoComplete="password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={error?.message}
              />
            )}
          />

          <Button
            title="Sign In"
            onPress={onSubmit}
            loading={login.isPending}
          />
        </View>

        <View className="mt-6 items-center">
          <Text className="text-sm text-[#8E8E93]">
            Don't have an account?{' '}
            <Link href="/register" className="text-[#007AFF] font-semibold">
              Sign Up
            </Link>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
