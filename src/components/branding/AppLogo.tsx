import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme/tokens';

type AppLogoProps = {
  size?: number;
  tone?: 'onPrimary' | 'onLight';
};

export function AppLogo({ size = 72, tone = 'onPrimary' }: AppLogoProps) {
  const isOnPrimary = tone === 'onPrimary';
  const markBackground = isOnPrimary ? 'rgba(255, 255, 255, 0.16)' : colors.primaryMuted;
  const iconColor = isOnPrimary ? colors.white : colors.primary;

  return (
    <View
      style={[
        styles.mark,
        { width: size, height: size, borderRadius: size * 0.28, backgroundColor: markBackground },
      ]}
    >
      <Ionicons name="qr-code" size={size * 0.5} color={iconColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
