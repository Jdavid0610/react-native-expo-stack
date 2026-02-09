import { Alert, ScrollView, Text, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Screen } from '@shared/ui/screen';
import { Input } from '@shared/ui/input';
import { Button } from '@shared/ui/button';
import { useProfile } from '../hooks/useProfile';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { updateProfileSchema, type UpdateProfileFormData } from '../schemas/profile.schema';
import { useLogout } from '@modules/auth/hooks/useLogout';
import { getErrorMessage } from '@shared/utils';
import { useEffect } from 'react';

export function ProfileScreen() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const logout = useLogout();

  const { control, handleSubmit, reset } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: '', bio: '' },
  });

  useEffect(() => {
    if (profile) {
      reset({ name: profile.name, bio: profile.bio ?? '' });
    }
  }, [profile, reset]);

  const onSubmit = handleSubmit((data) => {
    updateProfile.mutate(data, {
      onSuccess: () => Alert.alert('Success', 'Profile updated'),
      onError: (error) =>
        Alert.alert('Update Failed', getErrorMessage(error)),
    });
  });

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => logout.mutate(),
      },
    ]);
  };

  if (isLoading) {
    return (
      <Screen>
        <View className="flex-1 justify-center items-center">
          <Text className="text-base text-[#8E8E93]">Loading profile...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        contentContainerClassName="px-6 py-8 items-center"
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-20 h-20 rounded-full bg-[#007AFF] justify-center items-center mb-3">
          <Text className="text-[32px] font-bold text-white">
            {profile?.name?.charAt(0)?.toUpperCase() ?? '?'}
          </Text>
        </View>

        <Text className="text-sm text-[#8E8E93] mb-8">{profile?.email}</Text>

        <View className="w-full gap-4">
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <Input
                label="Name"
                placeholder="Your name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="bio"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <Input
                label="Bio"
                placeholder="Tell us about yourself"
                multiline
                numberOfLines={3}
                className="min-h-[80px]"
                style={{ textAlignVertical: 'top' }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={error?.message}
              />
            )}
          />

          <Button
            title="Save Changes"
            onPress={onSubmit}
            loading={updateProfile.isPending}
          />
        </View>

        <View className="w-full mt-10">
          <Button
            title="Sign Out"
            variant="outline"
            onPress={handleLogout}
            loading={logout.isPending}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
