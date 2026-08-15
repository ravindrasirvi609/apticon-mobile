import { StyleSheet, Text, View } from "react-native";

import type { ReportItem } from "@/api/types";
import { Card } from "@/components/ui/Card";
import { colors, spacing, typography } from "@/theme/tokens";
import { formatDateTime } from "@/utils/formatDate";

type ReportRowProps = {
  item: ReportItem;
};

export function ReportRow({ item }: ReportRowProps) {
  const registration = item.registration ?? {
    registrationCode: "Unknown",
    fullName: "Unknown attendee",
    email: "",
    phone: "",
    institution: undefined,
  };

  return (
    <Card style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {registration.fullName}
        </Text>
        <Text style={styles.code} numberOfLines={1}>
          {registration.registrationCode}
          {registration.institution ? ` · ${registration.institution}` : ""}
        </Text>
      </View>
      <View style={styles.meta}>
        <Text style={styles.time}>
          {item.at ? formatDateTime(item.at) : "—"}
        </Text>
        <Text style={styles.by} numberOfLines={1}>
          {item.by ?? "Unknown"}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.bodyBold,
  },
  code: {
    ...typography.caption,
  },
  meta: {
    alignItems: "flex-end",
    gap: 2,
  },
  time: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  by: {
    ...typography.caption,
    fontWeight: "700",
  },
});
