import { Image, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useApp } from "@/AppContext";
import { assetUrl } from "@/content";
import { Button, Card, Screen, SectionTitle, theme } from "@/components/ui";

export default function SpotScreen() {
  const { id, sceneId } = useLocalSearchParams<{ id: string; sceneId?: string }>();
  const { ready, content } = useApp();
  if (!ready) return null;

  let spot = content.sceneSpots[sceneId ?? ""]?.find((item) => item.id === id);
  if (!spot) {
    for (const spots of Object.values(content.sceneSpots)) {
      const found = spots.find((item) => item.id === id);
      if (found) {
        spot = found;
        break;
      }
    }
  }

  if (!spot) {
    return (
      <Screen>
        <Card>
          <Text style={styles.body}>This detail could not be found.</Text>
        </Card>
        <Button label="Back to tour" onPress={() => router.back()} />
      </Screen>
    );
  }

  const scene = content.scenes.find((item) => item.id === sceneId);

  return (
    <Screen>
      <SectionTitle
        title={spot.title ?? spot.label}
        subtitle={scene?.shortTitle ?? "Tour detail"}
      />
      <Card>
        {spot.photo ? (
          <Image source={{ uri: assetUrl(spot.photo) }} style={styles.photo} resizeMode="cover" />
        ) : null}
        <Text style={styles.body}>{spot.body}</Text>
      </Card>
      <Button label="Continue exploring" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  photo: { width: "100%", height: 190, borderRadius: 12, marginBottom: 12 },
  body: { fontFamily: theme.fontBody, fontSize: 14, color: theme.muted, lineHeight: 21 },
});
