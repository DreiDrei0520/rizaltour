import { useEffect } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
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
          <FontAwesome name="sliders" size={16} color={theme.green} />
          <Text style={styles.editText}>Edit</Text>
        </Pressable>
      </View>

      <View style={styles.hero}>
        <Image
          source={{ uri: assetUrl("/assets/tour/exterior-front-2023.jpg") }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroShade} />
        <View style={styles.heroContent}>
          <View style={styles.locationPill}>
            <FontAwesome name="map-marker" size={12} color={theme.green} />
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
            <Text style={styles.cardTitle}>{destination.place}</Text>
            <Text style={styles.body}>{destination.province}</Text>
          </View>
          <FontAwesome name="chevron-right" size={16} color={theme.green} />
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
    marginBottom: 16,
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.green,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "700" },
  kicker: { fontSize: 10, color: theme.muted, letterSpacing: 1 },
  brandName: { fontSize: 16, fontWeight: "700", color: theme.green },
  editButton: { flexDirection: "row", alignItems: "center", gap: 6, padding: 8 },
  editText: { color: theme.green, fontWeight: "600" },
  hero: { borderRadius: 22, overflow: "hidden", backgroundColor: theme.green, marginBottom: 22 },
  heroImage: { width: "100%", height: 270 },
  heroShade: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(9,35,26,0.62)" },
  heroContent: { position: "absolute", left: 18, right: 18, bottom: 18 },
  locationPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: theme.paper,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  locationText: { color: theme.green, fontSize: 11, fontWeight: "600" },
  heroTitle: { color: "#fff", fontSize: 26, lineHeight: 31, fontWeight: "800", marginBottom: 8 },
  heroText: { color: "#e8efe9", fontSize: 13, lineHeight: 19, marginBottom: 12 },
  ring: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 6,
    borderColor: theme.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  ringNumber: { fontSize: 19, fontWeight: "800", color: theme.green },
  ringLabel: { fontSize: 10, color: theme.muted },
  introRow: { flexDirection: "row", gap: 16, alignItems: "center" },
  introCopy: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: theme.ink, marginBottom: 4 },
  body: { fontSize: 13, color: theme.muted, lineHeight: 19 },
  destination: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: theme.paper,
    borderWidth: 1,
    borderColor: theme.line,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  destinationCode: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: theme.green,
    alignItems: "center",
    justifyContent: "center",
  },
  destinationCodeText: { color: "#fff", fontWeight: "700" },
  destinationCopy: { flex: 1 },
});
