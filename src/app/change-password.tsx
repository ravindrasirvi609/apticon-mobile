import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { ApiError } from '@/api/client';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { TextField } from '@/components/ui/TextField';
import { useToast } from '@/components/ui/Toast';
import { useChangePassword } from '@/hooks/useAuth';
import { spacing, typography } from '@/theme/tokens';

type FormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const changePassword = useChangePassword();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const newPassword = watch('newPassword');

  const onSubmit = (values: FormValues) => {
    changePassword.mutate(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      {
        onSuccess: () => {
          showToast('Password updated', 'success');
          router.back();
        },
        onError: (error) => {
          showToast((error as ApiError).message ?? 'Unable to update password.', 'error');
        },
      },
    );
  };

  return (
    <ScreenContainer edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <IconButton name="close" accessibilityLabel="Close" onPress={() => router.back()} />
        <Text style={styles.title}>Change Password</Text>
        <View style={styles.spacer} />
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
          <Controller
            control={control}
            name="currentPassword"
            rules={{ required: 'Current password is required', minLength: { value: 6, message: 'Minimum 6 characters' } }}
            render={({ field }) => (
              <TextField
                label="Current Password"
                secureTextEntry={!showCurrent}
                value={field.value}
                onChangeText={field.onChange}
                error={errors.currentPassword?.message}
                rightAccessory={
                  <IconButton
                    name={showCurrent ? 'eye-off-outline' : 'eye-outline'}
                    accessibilityLabel="Toggle current password visibility"
                    onPress={() => setShowCurrent((v) => !v)}
                    size={20}
                    background="transparent"
                  />
                }
              />
            )}
          />

          <Controller
            control={control}
            name="newPassword"
            rules={{ required: 'New password is required', minLength: { value: 8, message: 'Minimum 8 characters' } }}
            render={({ field }) => (
              <TextField
                label="New Password"
                secureTextEntry={!showNew}
                value={field.value}
                onChangeText={field.onChange}
                error={errors.newPassword?.message}
                rightAccessory={
                  <IconButton
                    name={showNew ? 'eye-off-outline' : 'eye-outline'}
                    accessibilityLabel="Toggle new password visibility"
                    onPress={() => setShowNew((v) => !v)}
                    size={20}
                    background="transparent"
                  />
                }
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: 'Please confirm your new password',
              validate: (value) => value === newPassword || 'Passwords do not match',
            }}
            render={({ field }) => (
              <TextField
                label="Confirm New Password"
                secureTextEntry={!showNew}
                value={field.value}
                onChangeText={field.onChange}
                error={errors.confirmPassword?.message}
              />
            )}
          />

          <Button
            title="Update Password"
            onPress={handleSubmit(onSubmit)}
            loading={changePassword.isPending}
            style={styles.submit}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...typography.subheading,
  },
  spacer: {
    width: 44,
  },
  flex: {
    flex: 1,
  },
  form: {
    gap: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  submit: {
    marginTop: spacing.sm,
  },
});
