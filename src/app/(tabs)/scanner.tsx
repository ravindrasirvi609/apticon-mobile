import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Linking, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fetchAttendeeByCode } from '@/api/endpoints/attendees';
import type { ApiError } from '@/api/client';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { useToast } from '@/components/ui/Toast';
import { colors, radii, spacing, typography } from '@/theme/tokens';

const FRAME_SIZE = 250;
const OVERLAY_TINT = 'rgba(15, 23, 42, 0.55)';

export default function ScannerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [torchOn, setTorchOn] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const locked = useRef(false);

  useFocusEffect(
    useCallback(() => {
      locked.current = false;
      setIsResolving(false);
      return () => {
        locked.current = true;
      };
    }, []),
  );

  const handleScan = useCallback(
    async ({ data }: BarcodeScanningResult) => {
      if (locked.current || !data) return;
      locked.current = true;
      setIsResolving(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      try {
        const result = await fetchAttendeeByCode(data);
        router.push(`/attendee/${result.registration._id}`);
      } catch (error) {
        const message =
          (error as ApiError).status === 404
            ? 'No attendee found for this QR code.'
            : (error as ApiError).message ?? 'Unable to look up this code.';
        showToast(message, 'error');
        locked.current = false;
        setIsResolving(false);
      }
    },
    [router, showToast],
  );

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <ScreenContainer>
        <EmptyState
          icon="camera-outline"
          title="Camera access needed"
          message="APTICON Staff needs camera access to scan attendee QR badges."
        />
        <Button
          title={permission.canAskAgain ? 'Grant Camera Access' : 'Open Settings'}
          onPress={() => (permission.canAskAgain ? requestPermission() : Linking.openSettings())}
        />
      </ScreenContainer>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing={facing}
        enableTorch={torchOn}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={isResolving ? undefined : handleScan}
      />

      <View style={styles.overlay}>
        <View style={[styles.dim, styles.dimBand]} />
        <View style={styles.middleRow}>
          <View style={[styles.dim, styles.dimSide]} />
          <View style={styles.frame} />
          <View style={[styles.dim, styles.dimSide]} />
        </View>
        <View style={[styles.dim, styles.dimBand, styles.bottomBand]}>
          <Text style={styles.instruction}>Place QR inside the frame</Text>
        </View>
      </View>

      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <IconButton
          name="close"
          accessibilityLabel="Cancel scanning"
          color={colors.white}
          background="rgba(0, 0, 0, 0.35)"
          onPress={() => router.replace('/(tabs)/dashboard')}
        />
        <Text style={styles.topTitle}>Scan QR</Text>
        <View style={styles.topActions}>
          <IconButton
            name={torchOn ? 'flash' : 'flash-outline'}
            accessibilityLabel="Toggle flashlight"
            color={colors.white}
            background="rgba(0, 0, 0, 0.35)"
            onPress={() => setTorchOn((v) => !v)}
          />
          <IconButton
            name="camera-reverse-outline"
            accessibilityLabel="Switch camera"
            color={colors.white}
            background="rgba(0, 0, 0, 0.35)"
            onPress={() => setFacing((v) => (v === 'back' ? 'front' : 'back'))}
          />
        </View>
      </View>

      {isResolving && (
        <View style={styles.resolvingOverlay}>
          <ActivityIndicator color={colors.white} size="large" />
          <Text style={styles.resolvingText}>Looking up attendee…</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  dim: {
    backgroundColor: OVERLAY_TINT,
  },
  dimBand: {
    flex: 1,
  },
  bottomBand: {
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  middleRow: {
    flexDirection: 'row',
    height: FRAME_SIZE,
  },
  dimSide: {
    flex: 1,
  },
  frame: {
    width: FRAME_SIZE,
    borderWidth: 3,
    borderColor: colors.white,
    borderRadius: radii.lg,
  },
  instruction: {
    ...typography.bodyBold,
    color: colors.white,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  topTitle: {
    ...typography.subheading,
    color: colors.white,
  },
  topActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  resolvingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  resolvingText: {
    ...typography.bodyBold,
    color: colors.white,
  },
});
