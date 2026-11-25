import { useEffect } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useApp } from "@/AppContext";
import { assetUrl } from "@/content";
import { hasOnboarded, markOnboarded } from "@/progress";
import { Button, Card, Screen, SectionTitle, theme } from "@/components/ui";

export default function HomeScreen() {
  const { ready, content, panoScenes, progress } = useApp();
  const { settings } = content;

  useEffect(() => {
    let active = true;
    hasOnboarded().then((done) => {
      if (!active || done) return;
      Alert.alert(
        "Welcome to Rizal Shrine",
        "Drag the images to look around, tap the markers to learn more, and finish the tour to unlock the quiz.",
        [{ text: "Got it, let's explore", onPress: () => void markOnboarded() }],
      );
    });
    return () => {
      active = false;
    };
  }, []);

  if (!ready) return null;

  const exploredCount = progress.explored.filter((id) =>
    panoScenes.some((scene) => scene.id === id),
  ).length;
  const percent = panoScenes.length ? Math.round((exploredCount / panoScenes.length) * 100) : 0;

  return (
    <Screen>
      <View style={styles.topRow}>
        <View style={styles.brand}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{settings.initials}</Text>
          </View>
          <View>
            <Text style={styles.kicker}>{settings.kicker}</Text>
            <Text style={styles.brandName}>{settings.appName}</Text>
          </View>
        </View>
        <Pressable onPress={() => router.push("/editor")} style={styles.editButton}>
          <FontAwesome name="sliders" size={16} color={theme.primary} />
          <Text style={styles.editText}>Edit</Text>
        </Pressable>
      </View>

      <View style={styles.hero}>
        <Image
          source={{ uri: assetUrl("/assets/tour/exterior-front-2023.jpg") }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["rgba(0,0,0,0.04)", "rgba(38,17,9,0.91)"]}
          locations={[0.25, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.heroShade}
        />
        <View style={styles.heroContent}>
          <View style={styles.locationPill}>
            <FontAwesome name="map-marker" size={12} color="#fff" />
            <Text style={styles.locationText}>{settings.location}</Text>
          </View>
          <Text style={styles.heroTitle}>{settings.heroTitle}</Text>
          <Text style={styles.heroText}>{settings.heroText}</Text>
          <Button label="Start 360° Tour" onPress={() => router.push("/tour")} />
        </View>
      </View>

      <SectionTitle title={settings.introTitle} subtitle={settings.introSubtitle} />

      <Card style={styles.introRow}>
        <View style={styles.ring}>
          <Text style={styles.ringNumber}>{percent}%</Text>
          <Text style={styles.ringLabel}>explored</Text>
        </View>
        <View style={styles.introCopy}>
          <Text style={styles.cardTitle}>Your visit</Text>
          <Text style={styles.body}>
            {exploredCount} of {panoScenes.length} panorama stops seen. Finish all stops to unlock
            the quiz.
          </Text>
        </View>
      </Card>

      <SectionTitle title="Destinations" subtitle="Cultural mapping • Laguna" />
      {content.destinations.map((destination) => (
        <Pressable
          key={`${destination.province}-${destination.place}`}
          onPress={() =>
            destination.status === "unlocked"
              ? router.push("/map")
              : Alert.alert("Coming soon", `${destination.place} is not open yet.`)
          }
          style={styles.destination}
        >
          <View style={styles.destinationCode}>
            <Text style={styles.destinationCodeText}>{destination.code}</Text>
          </View>
          <View style={styles.destinationCopy}>
            <Text style={styles.destinationLabel}>{destination.province}</Text>
            <Text style={styles.cardTitle}>{destination.place}</Text>
            <Text style={styles.body}>{destination.status}</Text>
          </View>
          <FontAwesome name="chevron-right" size={16} color={theme.primary} />
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontFamily: theme.fontDisplay, color: "#fff", fontWeight: "700", fontSize: 16 },
  kicker: {
    fontFamily: theme.fontBody,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: theme.primary,
  },
  brandName: {
    fontFamily: theme.fontDisplay,
    fontSize: 20,
    fontWeight: "700",
    color: theme.ink,
  },
  editButton: { flexDirection: "row", alignItems: "center", gap: 6, padding: 8 },
  editText: { fontFamily: theme.fontBody, color: theme.primary, fontWeight: "700", fontSize: 12 },
  hero: {
    borderRadius: 26,
    overflow: "hidden",
    backgroundColor: theme.primary,
    marginBottom: 22,
    shadowColor: "#4c2d20",
    shadowOpacity: 0.19,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 9 },
    elevation: 5,
  },
  heroImage: { width: "100%", height: 470 },
  heroShade: { ...StyleSheet.absoluteFill },
  heroContent: { position: "absolute", left: 22, right: 22, bottom: 24 },
  locationPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 7,
    marginBottom: 13,
  },
  locationText: {
    fontFamily: theme.fontBody,
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  heroTitle: {
    fontFamily: theme.fontDisplay,
    color: "#fff",
    fontSize: 34,
    lineHeight: 36,
    fontWeight: "700",
    marginBottom: 8,
  },
  heroText: {
    fontFamily: theme.fontBody,
    color: "rgba(255,249,235,0.85)",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 17,
  },
  ring: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 6,
    borderColor: theme.gold,
    backgroundColor: theme.cream,
    alignItems: "center",
    justifyContent: "center",
  },
  ringNumber: {
    fontFamily: theme.fontDisplay,
    fontSize: 19,
    fontWeight: "700",
    color: theme.primary,
  },
  ringLabel: { fontFamily: theme.fontBody, fontSize: 10, color: theme.muted },
  introRow: { flexDirection: "row", gap: 16, alignItems: "center" },
  introCopy: { flex: 1 },
  cardTitle: {
    fontFamily: theme.fontDisplay,
    fontSize: 15,
    fontWeight: "700",
    color: theme.ink,
    marginBottom: 3,
  },
  destinationLabel: {
    fontFamily: theme.fontBody,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: theme.primary,
    marginBottom: 3,
  },
  body: { fontFamily: theme.fontBody, fontSize: 13, color: theme.muted, lineHeight: 19 },
  destination: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fffaf2",
    borderWidth: 1,
    borderColor: theme.line,
    borderRadius: 18,
    padding: 9,
    marginBottom: 10,
    minHeight: 85,
  },
  destinationCode: {
    width: 68,
    height: 66,
    borderRadius: 12,
    backgroundColor: "#988469",
    alignItems: "center",
    justifyContent: "center",
  },
  destinationCodeText: {
    fontFamily: theme.fontDisplay,
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  destinationCopy: { flex: 1 },
});
