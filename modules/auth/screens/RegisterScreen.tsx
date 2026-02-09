import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { Screen } from '@shared/ui/screen';
import { Input } from '@shared/ui/input';
import { Button } from '@shared/ui/button';
import { registerSchema, type RegisterFormData } from '../schemas/register.schema';
import { useRegister } from '../hooks/useRegister';
import { getErrorMessage } from '@shared/utils';

export function RegisterScreen() {
  const register = useRegister();

  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit((data) => {
    register.mutate(data, {
      onError: (error) =>
        Alert.alert('Registration Failed', getErrorMessage(error)),
    });
  });

  return (
    <Screen>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-6 py-8"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-8">
            <Text className="text-[32px] font-bold text-[#1C1C1E] mb-2">
              Create account
            </Text>
            <Text className="text-base text-[#8E8E93]">
              Sign up to get started
            </Text>
          </View>

          <View className="gap-4">
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <Input
                  label="Name"
                  placeholder="Your full name"
                  autoComplete="name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={error?.message}
                />
              )}
            />

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
                  placeholder="At least 8 characters"
                  secureTextEntry
                  autoComplete="new-password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <Input
                  label="Confirm Password"
                  placeholder="Re-enter your password"
                  secureTextEntry
                  autoComplete="new-password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={error?.message}
                />
              )}
            />

            <Button
              title="Create Account"
              onPress={onSubmit}
              loading={register.isPending}
            />
          </View>

          <View className="mt-6 items-center">
            <Text className="text-sm text-[#8E8E93]">
              Already have an account?{' '}
              <Link href="/login" className="text-[#007AFF] font-semibold">
                Sign In
              </Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
