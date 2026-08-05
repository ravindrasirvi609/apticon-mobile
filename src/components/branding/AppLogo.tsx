import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/tokens';

type AppLogoProps = {
  size?: number;
  tone?: 'onPrimary' | 'onLight';
};

export function AppLogo({ size = 72, tone = 'onPrimary' }: AppLogoProps) {
  const isOnPrimary = tone === 'onPrimary';
  const aptiColor = isOnPrimary ? colors.white : colors.primary;
  const fontSize = size * 0.42;

  return (
    <View style={styles.row}>
      <Text style={[styles.word, { fontSize, color: aptiColor }]}>APTI</Text>
      <Text style={[styles.word, { fontSize, color: colors.accent }]}>CON</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  word: {
    fontFamily: 'PlayfairDisplay_900Black',
    letterSpacing: 0.5,
  },
});
