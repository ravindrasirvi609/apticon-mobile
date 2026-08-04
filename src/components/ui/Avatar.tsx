import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radii } from '@/theme/tokens';

type AvatarProps = {
  uri?: string;
  name: string;
  size?: number;
};

export function Avatar({ uri, name, size = 56 }: AvatarProps) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  const dimension = { width: size, height: size, borderRadius: size };

  if (uri) {
    return <Image source={{ uri }} style={[styles.image, dimension]} contentFit="cover" />;
  }

  return (
    <View style={[styles.fallback, dimension]}>
      <Text style={[styles.initials, { fontSize: size * 0.36 }]}>{initials || '?'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.border,
  },
  fallback: {
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.full,
  },
  initials: {
    color: colors.primary,
    fontWeight: '700',
  },
});
