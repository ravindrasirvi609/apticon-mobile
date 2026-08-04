import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { MenuRow } from '@/components/ui/MenuRow';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { useLogout } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { colors, spacing, typography } from '@/theme/tokens';

const ROLE_LABEL: Record<string, string> = {
  checkin_staff: 'Registration Desk Staff',
  super_admin: 'Super Admin',
};

const Divider = () => <View style={styles.divider} />;

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Avatar name={user?.name ?? ''} size={88} />
          <Text style={styles.name}>{user?.name}</Text>
          <Badge label={user ? ROLE_LABEL[user.role] ?? user.role : ''} />
        </View>

        <Card style={styles.card} padded={false}>
          <View style={styles.cardInner}>
            <MenuRow icon="mail-outline" label="Email" value={user?.email} showChevron={false} />
            <Divider />
            <MenuRow icon="shield-checkmark-outline" label="Role" value={user ? ROLE_LABEL[user.role] ?? user.role : ''} showChevron={false} />
          </View>
        </Card>

        <Card style={styles.card} padded={false}>
          <View style={styles.cardInner}>
            <MenuRow icon="key-outline" label="Change Password" onPress={() => router.push('/change-password')} />
            <Divider />
            <MenuRow
              icon="information-circle-outline"
              label="About"
              value={aboutOpen ? undefined : `v${version}`}
              onPress={() => setAboutOpen((v) => !v)}
              showChevron={!aboutOpen}
            />
            {aboutOpen && (
              <View style={styles.about}>
                <Text style={styles.aboutText}>APTICON Staff App</Text>
                <Text style={styles.aboutMeta}>Version {version}</Text>
                <Text style={styles.aboutMeta}>© 2026 APTICON Conference</Text>
              </View>
            )}
          </View>
        </Card>

        <Card style={styles.card} padded={false}>
          <View style={styles.cardInner}>
            <MenuRow
              icon="log-out-outline"
              label="Logout"
              destructive
              showChevron={false}
              onPress={() => setConfirmLogout(true)}
            />
          </View>
        </Card>
      </ScrollView>

      <ConfirmDialog
        visible={confirmLogout}
        title="Log out?"
        message="You'll need to sign in again to continue using the app."
        confirmLabel="Log Out"
        destructive
        loading={logout.isPending}
        onConfirm={() => logout.mutate()}
        onCancel={() => setConfirmLogout(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  header: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  name: {
    ...typography.headingLarge,
    marginTop: spacing.sm,
  },
  card: {
    overflow: 'hidden',
  },
  cardInner: {
    paddingHorizontal: spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  about: {
    paddingBottom: spacing.lg,
    gap: 2,
  },
  aboutText: {
    ...typography.bodyBold,
  },
  aboutMeta: {
    ...typography.caption,
  },
});
