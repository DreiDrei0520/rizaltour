import { useEffect, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useApp } from "@/AppContext";
import { assetUrl } from "@/content";
import { Button, Screen, theme } from "@/components/ui";
import { PanoView } from "@/components/PanoView";

export default function TourScreen() {
  const { ready, content, panoScenes, progress, markExplored, finishTour } = useApp();
  const [index, setIndex] = useState(0);
  const [viewIndex, setViewIndex] = useState(0);
  const [use360, setUse360] = useState(true);

  const scene = content.scenes[index];
  const views = useMemo(() => {
    if (!scene) return [];
    if (scene.pano)
      return scene.pano.faces.map((face) => ({
        uri: assetUrl(face),
        label: face.split("/").pop()?.replace(".jpg", "") ?? "",
      }));
    return scene.photos.map((photo) => ({ uri: assetUrl(photo.src), label: photo.caption }));
  }, [scene]);

  useEffect(() => {
    if (!scene) return;
    void markExplored(scene.id);
  }, [scene, markExplored]);

  useEffect(() => {
    setViewIndex(0);
  }, [index]);

  if (!ready || !scene) return null;

  const spots = content.sceneSpots[scene.id] ?? [];
  const allPanoSeen = panoScenes.every((item) => progress.explored.includes(item.id));

  const goToScene = (id: string) => {
    const target = content.scenes.findIndex((item) => item.id === id);
    if (target >= 0) setIndex(target);
  };

  const openSpot = (spot: (typeof spots)[number]) => {
    if (spot.kind === "move" && spot.target) {
      goToScene(spot.target);
      return;
    }
    router.push({
      pathname: "/spot/[id]",
      params: { id: spot.id, sceneId: scene.id },
    });
  };

  const moveView = (direction: number) => {
    setViewIndex((current) => (current + direction + views.length) % views.length);
  };

  return (
    <Screen scroll={false} padded={false} tone="dark">
      <StatusBar style="light" />
      <View style={styles.topBar}>
        <Pressable onPress={() => router.push("/")} style={styles.iconButton}>
          <FontAwesome name="arrow-left" size={18} color="#fff" />
        </Pressable>
        <View style={styles.topCopy}>
          <Text style={styles.topKicker}>
            Stop {index + 1} of {content.scenes.length}
          </Text>
          <Text style={styles.topTitle} numberOfLines={1}>
            {scene.shortTitle}
          </Text>
        </View>
        <Pressable onPress={() => router.push(`/stop/${scene.id}`)} style={styles.iconButton}>
          <FontAwesome name="info" size={18} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.stage}>
        {scene.pano && use360 ? (
          <PanoView
            key={scene.id}
            faces={scene.pano.faces}
            preview={scene.coverUrl}
            spots={spots}
            onSpot={openSpot}
          />
        ) : (
          <>
            <Image
              source={{ uri: views[viewIndex]?.uri }}
              style={styles.image}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["rgba(22,13,8,0)", "rgba(22,13,8,0.91)"]}
              start={{ x: 0.5, y: 0.35 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.stageShade}
            />

            {spots.map((spot) => (
              <Pressable
                key={spot.id}
                onPress={() => openSpot(spot)}
                style={[styles.hotspot, { left: `${spot.x}%`, top: `${spot.y}%` }]}
              >
                <View style={styles.hotspotDot}>
                  <FontAwesome
                    name={spot.kind === "move" ? "arrows" : "plus"}
                    size={13}
                    color="#fff"
                  />
                </View>
                <Text style={styles.hotspotLabel}>{spot.label}</Text>
              </Pressable>
            ))}

            <Pressable onPress={() => moveView(-1)} style={[styles.arrow, styles.arrowLeft]}>
              <FontAwesome name="chevron-left" size={22} color="#fff" />
            </Pressable>
            <Pressable onPress={() => moveView(1)} style={[styles.arrow, styles.arrowRight]}>
              <FontAwesome name="chevron-right" size={22} color="#fff" />
            </Pressable>

            <View style={styles.viewLabel}>
              <Text style={styles.viewText}>
                {scene.pano
                  ? `Direction ${viewIndex + 1}/${views.length}`
                  : `Photo ${viewIndex + 1}/${views.length}`}
              </Text>
              <Text style={styles.viewCaption} numberOfLines={1}>
                {views[viewIndex]?.label}
              </Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.controls}>
        <View style={styles.navRow}>
          <Button
            label="Previous"
            variant="glass"
            onPress={() =>
              setIndex((current) => (current - 1 + content.scenes.length) % content.scenes.length)
            }
          />
          <Button
            label="Next"
            onPress={() => setIndex((current) => (current + 1) % content.scenes.length)}
          />
        </View>

        {scene.pano && (
          <View style={styles.toggleRow}>
            <Button
              label={use360 ? "Use classic view" : "Use 360° view"}
              variant="glass"
              onPress={() => setUse360((current) => !current)}
            />
          </View>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
          {content.scenes.map((item, itemIndex) => (
            <Pressable
              key={item.id}
              onPress={() => setIndex(itemIndex)}
              style={[styles.chip, itemIndex === index && styles.chipActive]}
            >
              <Text style={[styles.chipText, itemIndex === index && styles.chipTextActive]}>
                {item.shortTitle}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.hint}>
          {scene.pano && use360
            ? "Drag to look around. Tap a marker to move or learn more."
            : "Tap the arrows to look around. Tap a marker to move or learn more."}
        </Text>

        {allPanoSeen ? (
          <Button
            label="Finish Tour & Take Quiz"
            onPress={() => {
              void finishTour();
              router.push("/quiz");
            }}
          />
        ) : (
          <Text style={styles.remaining}>
            {panoScenes.filter((item) => !progress.explored.includes(item.id)).length} panorama
            stops left before the quiz unlocks.
          </Text>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  topCopy: { flex: 1 },
  topKicker: {
    fontFamily: theme.fontBody,
    color: theme.gold,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  topTitle: {
    fontFamily: theme.fontDisplay,
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 2,
  },
  stage: {
    height: 330,
    marginHorizontal: 12,
    borderRadius: 26,
    overflow: "hidden",
    backgroundColor: theme.primary,
  },
  image: { width: "100%", height: "100%" },
  stageShade: { ...StyleSheet.absoluteFill },
  hotspot: { position: "absolute", alignItems: "center" },
  hotspotDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.gold,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  hotspotLabel: {
    fontFamily: theme.fontBody,
    marginTop: 3,
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    backgroundColor: "rgba(22,13,8,0.78)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: "hidden",
  },
  arrow: {
    position: "absolute",
    top: "50%",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(22,13,8,0.72)",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowLeft: { left: 10 },
  arrowRight: { right: 10 },
  viewLabel: {
    position: "absolute",
    left: 12,
    bottom: 12,
    backgroundColor: "rgba(22,13,8,0.78)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  viewText: { fontFamily: theme.fontBody, color: "#fff", fontSize: 12, fontWeight: "700" },
  viewCaption: {
    fontFamily: theme.fontBody,
    color: "rgba(255,249,235,0.85)",
    fontSize: 10,
    maxWidth: 260,
  },
  controls: { paddingHorizontal: 18, paddingTop: 12 },
  navRow: { flexDirection: "row", gap: 10 },
  toggleRow: { marginTop: 2 },
  chips: { marginTop: 4 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    marginRight: 8,
  },
  chipActive: { backgroundColor: theme.primary, borderColor: theme.primary },
  chipText: { fontFamily: theme.fontBody, color: "#fff", fontSize: 10, fontWeight: "700" },
  chipTextActive: { color: theme.gold },
  hint: {
    fontFamily: theme.fontBody,
    color: "rgba(255,249,235,0.75)",
    fontSize: 12,
    textAlign: "center",
    marginVertical: 10,
  },
  remaining: {
    fontFamily: theme.fontBody,
    color: "rgba(255,249,235,0.75)",
    fontSize: 12,
    textAlign: "center",
  },
});
