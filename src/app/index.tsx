import Constants from 'expo-constants';
import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppLogo } from '@/components/branding/AppLogo';
import { useAuthStore } from '@/store/authStore';
import { colors, spacing, typography } from '@/theme/tokens';

export default function Splash() {
  const status = useAuthStore((s) => s.status);
  const insets = useSafeAreaInsets();
  const version = Constants.expoConfig?.version ?? '1.0.0';

  if (status !== 'hydrating') {
    return status === 'authenticated' ? (
      <Redirect href="/(tabs)/dashboard" />
    ) : (
      <Redirect href="/(auth)/login" />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <AppLogo size={88} tone="onPrimary" />
        <Text style={styles.subtitle}>2026 Conference · Staff App</Text>
        <ActivityIndicator color={colors.white} size="large" style={styles.loader} />
      </View>
      <Text style={[styles.version, { bottom: insets.bottom + spacing.xxl }]}>Version {version}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: spacing.sm,
  },
  loader: {
    marginTop: spacing.lg,
  },
  version: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.6)',
    position: 'absolute',
  },
});
