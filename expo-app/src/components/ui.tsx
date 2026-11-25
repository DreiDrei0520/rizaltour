import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ReactNode } from "react";

export const theme = {
  green: "#123b2c",
  greenLight: "#1d5b43",
  cream: "#f7f1e3",
  paper: "#fffaf0",
  gold: "#c8a24a",
  ink: "#1d2b25",
  muted: "#6c7a72",
  line: "#e4ddcc",
  danger: "#9b3b32",
};

export function Screen({
  children,
  scroll = true,
  padded = true,
}: {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
}) {
  const content = <View style={padded ? styles.padded : undefined}>{children}</View>;
  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {scroll ? (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {content}
        </ScrollView>
      ) : (
        <View style={styles.fill}>{content}</View>
      )}
    </SafeAreaView>
  );
}

export function Button({
  label,
  onPress,
  variant = "primary",
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.buttonText, variant !== "primary" && styles.buttonTextAlt]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.sectionHead}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: object }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Row({ children, gap = 10 }: { children: ReactNode; gap?: number }) {
  return <View style={{ flexDirection: "row", flexWrap: "wrap", gap }}>{children}</View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.cream },
  fill: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  padded: { paddingHorizontal: 18, paddingTop: 16 },
  sectionHead: { marginBottom: 12 },
  sectionTitle: { fontSize: 21, fontWeight: "700", color: theme.green },
  sectionSubtitle: { fontSize: 13, color: theme.muted, marginTop: 4 },
  card: {
    backgroundColor: theme.paper,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: theme.line,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  primary: { backgroundColor: theme.green },
  secondary: { backgroundColor: theme.greenLight },
  ghost: { backgroundColor: "transparent", borderWidth: 1, borderColor: theme.green },
  danger: { backgroundColor: theme.danger },
  pressed: { opacity: 0.82 },
  disabled: { opacity: 0.45 },
  buttonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  buttonTextAlt: { color: theme.green },
});
