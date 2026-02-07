import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
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
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile?.name?.charAt(0)?.toUpperCase() ?? '?'}
          </Text>
        </View>

        <Text style={styles.email}>{profile?.email}</Text>

        <View style={styles.form}>
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
                style={styles.bioInput}
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

        <View style={styles.logoutSection}>
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

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  email: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 32,
  },
  form: {
    width: '100%',
    gap: 16,
  },
  bioInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  logoutSection: {
    width: '100%',
    marginTop: 40,
  },
});
