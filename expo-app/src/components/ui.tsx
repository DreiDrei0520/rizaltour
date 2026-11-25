import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ReactNode } from "react";

export const theme = {
  fontBody: "Inter",
  fontDisplay: "Playfair Display",
  primary: "#7a1f2b",
  primaryDark: "#56121d",
  cream: "#faf3e3",
  paper: "#fffaf0",
  gold: "#c9a227",
  ink: "#2b1b12",
  muted: "#786b62",
  line: "#e7d9c3",
  danger: "#9d2a2a",
  success: "#578c62",
  successBg: "#edf7ee",
  dangerBg: "#faeeee",
  dark: "#120b07",
};

export function Screen({
  children,
  scroll = true,
  padded = true,
  tone = "default",
}: {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  tone?: "default" | "dark";
}) {
  const content = <View style={padded ? styles.padded : undefined}>{children}</View>;
  return (
    <SafeAreaView
      style={[styles.safe, tone === "dark" && styles.safeDark]}
      edges={["top", "left", "right"]}
    >
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
  variant?: "primary" | "secondary" | "ghost" | "glass" | "danger";
  disabled?: boolean;
}) {
  const altText = variant === "secondary" || variant === "ghost";
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
      <Text
        style={[
          styles.buttonText,
          altText && styles.buttonTextAlt,
          variant === "glass" && styles.buttonTextGlass,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.sectionHead}>
      {subtitle ? <Text style={styles.sectionKicker}>{subtitle}</Text> : null}
      <Text style={styles.sectionTitle}>{title}</Text>
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
  safeDark: { backgroundColor: theme.dark },
  fill: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 110 },
  padded: { paddingHorizontal: 20, paddingTop: 24 },
  sectionHead: { marginBottom: 14 },
  sectionKicker: {
    fontFamily: theme.fontBody,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: theme.primary,
    marginBottom: 4,
  },
  sectionTitle: {
    fontFamily: theme.fontDisplay,
    fontSize: 25,
    fontWeight: "700",
    color: theme.ink,
  },
  sectionSubtitle: {
    fontFamily: theme.fontBody,
    fontSize: 13,
    color: theme.muted,
    marginTop: 4,
  },
  card: {
    backgroundColor: theme.paper,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.line,
  },
  button: {
    minHeight: 50,
    borderRadius: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  primary: {
    backgroundColor: theme.primary,
    shadowColor: theme.primary,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.primary,
  },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.line,
  },
  glass: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
  },
  danger: { backgroundColor: theme.danger },
  pressed: { opacity: 0.82 },
  disabled: { opacity: 0.45 },
  buttonText: { fontFamily: theme.fontBody, color: "#fff", fontSize: 13, fontWeight: "700" },
  buttonTextAlt: { color: theme.primary },
  buttonTextGlass: { color: "#fff" },
});
