import { Image, StyleSheet } from 'react-native';

import { radii } from '@/theme/tokens';

const LOGO_ASPECT_RATIO = 1536 / 1024;

type AppLogoProps = {
  width?: number;
};

export function AppLogo({ width = 220 }: AppLogoProps) {
  return (
    <Image
      source={require('../../../assets/images/APTICON_LOGO.png')}
      accessibilityLabel="APTICON 2026"
      resizeMode="contain"
      style={[styles.logo, { width, height: width / LOGO_ASPECT_RATIO }]}
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    borderRadius: radii.md,
  },
});
