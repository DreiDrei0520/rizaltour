import { Image, Linking, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useApp } from "@/AppContext";
import { assetUrl } from "@/content";
import { Button, Card, Screen, SectionTitle, theme } from "@/components/ui";

export default function MapScreen() {
  const { ready, content } = useApp();
  if (!ready) return null;

  const { visitorInfo, destinations } = content;
  const main = destinations[0];

  return (
    <Screen>
      <SectionTitle title="Cultural map" subtitle="Find the shrine and plan your visit" />

      <Card>
        <View style={styles.mapMock}>
          <Image
            source={{ uri: assetUrl("/assets/tour/exterior-front-2023.jpg") }}
            style={styles.mapImage}
            resizeMode="cover"
          />
          <View style={styles.pin}>
            <FontAwesome name="map-marker" size={26} color={theme.gold} />
            <Text style={styles.pinText}>
              {visitorInfo.lat.toFixed(4)}, {visitorInfo.lng.toFixed(4)}
            </Text>
          </View>
        </View>
        <Text style={styles.place}>{main?.place ?? "Rizal Shrine, Calamba"}</Text>
        <Text style={styles.body}>{visitorInfo.address}</Text>
        <Button
          label="Get directions"
          onPress={() => void Linking.openURL(visitorInfo.directionsUrl)}
        />
      </Card>

      <SectionTitle title="Visit info" subtitle="Before you go" />
      <Card>
        <InfoRow icon="clock-o" label="Hours" value={visitorInfo.hours} />
        <InfoRow icon="phone" label="Contact" value={visitorInfo.contact} />
        <InfoRow icon="info-circle" label="Good to know" value={visitorInfo.note} />
        <InfoRow icon="book" label="Source" value={visitorInfo.source} />
      </Card>

      <Button label="Enter 360° Tour" onPress={() => router.push("/tour")} />
      <Button label="Take Quiz" variant="secondary" onPress={() => router.push("/quiz")} />
    </Screen>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <FontAwesome name={icon as never} size={16} color={theme.primary} />
      <View style={styles.infoCopy}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.body}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapMock: {
    height: 420,
    borderRadius: 26,
    overflow: "hidden",
    marginBottom: 12,
    backgroundColor: "#e8ddc6",
  },
  mapImage: { width: "100%", height: "100%" },
  pin: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: theme.paper,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pinText: {
    fontFamily: theme.fontBody,
    color: theme.primary,
    fontSize: 11,
    fontWeight: "700",
  },
  place: {
    fontFamily: theme.fontDisplay,
    fontSize: 27,
    fontWeight: "700",
    color: theme.primary,
    marginBottom: 4,
  },
  body: { fontFamily: theme.fontBody, fontSize: 13, color: theme.muted, lineHeight: 19 },
  infoRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  infoCopy: { flex: 1 },
  infoLabel: {
    fontFamily: theme.fontBody,
    fontSize: 12,
    fontWeight: "700",
    color: theme.ink,
    marginBottom: 2,
  },
});
