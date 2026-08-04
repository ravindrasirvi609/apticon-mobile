import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppLogo } from '@/components/branding/AppLogo';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { IconButton } from '@/components/ui/IconButton';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { TextField } from '@/components/ui/TextField';
import { useToast } from '@/components/ui/Toast';
import type { ApiError } from '@/api/client';
import { useLogin } from '@/hooks/useAuth';
import { useSettingsStore } from '@/store/settingsStore';
import { colors, spacing, typography } from '@/theme/tokens';

type LoginFormValues = {
  email: string;
  password: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const { showToast } = useToast();
  const login = useLogin();
  const rememberedEmail = useSettingsStore((s) => s.rememberedEmail);
  const setRememberedEmail = useSettingsStore((s) => s.setRememberedEmail);

  const [rememberMeOverride, setRememberMeOverride] = useState<boolean | null>(null);
  const rememberMe = rememberMeOverride ?? !!rememberedEmail;
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (rememberedEmail) setValue('email', rememberedEmail);
  }, [rememberedEmail, setValue]);

  const onSubmit = (values: LoginFormValues) => {
    login.mutate(
      { email: values.email.trim(), password: values.password },
      {
        onSuccess: () => {
          setRememberedEmail(rememberMe ? values.email.trim() : null);
        },
        onError: (error) => {
          const message = (error as ApiError).message ?? 'Unable to log in. Please try again.';
          showToast(message, 'error');
        },
      },
    );
  };

  return (
    <ScreenContainer edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <AppLogo size={64} tone="onLight" />
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to the APTICON staff console</Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email is required',
                pattern: { value: EMAIL_PATTERN, message: 'Enter a valid email address' },
              }}
              render={({ field }) => (
                <TextField
                  label="Email"
                  placeholder="staff@apticon.org"
                  keyboardType="email-address"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.email?.message}
                  returnKeyType="next"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              rules={{
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              }}
              render={({ field }) => (
                <TextField
                  label="Password"
                  placeholder="••••••••"
                  secureTextEntry={!showPassword}
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.password?.message}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  rightAccessory={
                    <IconButton
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      onPress={() => setShowPassword((prev) => !prev)}
                      accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                      size={20}
                      background="transparent"
                    />
                  }
                />
              )}
            />

            <View style={styles.row}>
              <Checkbox label="Remember me" checked={rememberMe} onToggle={() => setRememberMeOverride(!rememberMe)} />
              <Text
                style={styles.link}
                accessibilityRole="link"
                onPress={() =>
                  showToast('Ask your event coordinator to reset your password.', 'info')
                }
              >
                Forgot password?
              </Text>
            </View>

            <Button
              title="Log In"
              onPress={handleSubmit(onSubmit)}
              loading={login.isPending}
              style={styles.submit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typography.headingLarge,
    marginTop: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    gap: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  link: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  submit: {
    marginTop: spacing.sm,
  },
});
