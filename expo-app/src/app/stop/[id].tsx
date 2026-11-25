import { Image, Linking, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useApp } from "@/AppContext";
import { assetUrl } from "@/content";
import { Button, Card, Screen, SectionTitle, theme } from "@/components/ui";

export default function StopScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { ready, content } = useApp();
  if (!ready) return null;

  const scene = content.scenes.find((item) => item.id === id);
  if (!scene) {
    return (
      <Screen>
        <Card>
          <Text style={styles.body}>This stop could not be found.</Text>
        </Card>
        <Button label="Back to tour" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Image source={{ uri: assetUrl(scene.coverUrl) }} style={styles.cover} resizeMode="cover" />
      <SectionTitle title={scene.title} subtitle={scene.shortTitle} />
      <Card>
        <Text style={styles.body}>{scene.description}</Text>
        <Text style={styles.label}>Why it matters</Text>
        <Text style={styles.body}>{scene.significance}</Text>
      </Card>

      <SectionTitle title={scene.hotspotLabel} />
      <Card>
        {scene.details.map((detail, index) => (
          <View key={index} style={styles.detail}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.body}>{detail}</Text>
          </View>
        ))}
      </Card>

      <SectionTitle title="Photos" subtitle={`${scene.photos.length} images`} />
      {scene.photos.map((photo, index) => (
        <Card key={index}>
          <Image source={{ uri: assetUrl(photo.src) }} style={styles.photo} resizeMode="cover" />
          <Text style={styles.caption}>{photo.caption}</Text>
          <Text style={styles.credit}>{photo.credit}</Text>
        </Card>
      ))}

      {scene.pano ? (
        <Button
          label="Open original 360° view"
          variant="ghost"
          onPress={() => void Linking.openURL(scene.pano!.sourceUrl)}
        />
      ) : null}
      <Button label="Back to tour" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  cover: { width: "100%", height: 190, borderRadius: 18, marginTop: 16 },
  body: { fontSize: 13, color: theme.muted, lineHeight: 19 },
  label: { fontSize: 12, fontWeight: "700", color: theme.green, marginTop: 12, marginBottom: 4 },
  detail: { flexDirection: "row", gap: 8, marginBottom: 8 },
  bullet: { color: theme.gold, fontSize: 16 },
  photo: { width: "100%", height: 180, borderRadius: 12 },
  caption: { fontSize: 12, color: theme.ink, marginTop: 8 },
  credit: { fontSize: 10, color: theme.muted, marginTop: 3 },
});
