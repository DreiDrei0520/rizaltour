import { Alert, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useApp } from "@/AppContext";
import { Button, Card, Screen, SectionTitle, theme } from "@/components/ui";

export default function ProgressScreen() {
  const { ready, content, progress, resetUserProgress } = useApp();
  if (!ready) return null;

  const panoIds = content.scenes.filter((scene) => scene.pano).map((scene) => scene.id);
  const seen = progress.explored.filter((id) => panoIds.includes(id)).length;
  const best = progress.quizHistory.length
    ? Math.max(...progress.quizHistory.map((item) => Math.round((item.score / item.total) * 100)))
    : 0;
  const overall = Math.round((seen / Math.max(1, panoIds.length)) * 70) + (best > 0 ? 30 : 0);
  const badge =
    best >= 90
      ? "Gold"
      : best >= content.settings.passingPercent
        ? "Silver"
        : best > 0
          ? "Bronze"
          : "Not earned";

  return (
    <Screen>
      <SectionTitle title="Your progress" subtitle="Stops explored and quiz results" />

      <Card style={styles.hero}>
        <LinearGradient
          colors={["#7a1f2b", "#56121d"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroFill}
        >
          <View style={styles.ring}>
            <Text style={styles.percent}>{overall}%</Text>
          </View>
          <Text style={styles.percentLabel}>overall completion</Text>
          <View style={styles.bar}>
            <View style={[styles.barFill, { width: `${overall}%` }]} />
          </View>
        </LinearGradient>
      </Card>

      <Card>
        <Stat label="360° stops" value={`${seen}/${panoIds.length}`} />
        <Stat label="Best quiz score" value={best ? `${best}%` : "—"} />
        <Stat label="Quiz attempts" value={String(progress.quizHistory.length)} />
        <Stat label="Badge" value={badge} />
      </Card>

      <SectionTitle title="Quiz history" subtitle="Most recent first" />
      {progress.quizHistory.length === 0 ? (
        <Card>
          <Text style={styles.body}>No quiz attempts yet.</Text>
        </Card>
      ) : (
        [...progress.quizHistory].reverse().map((item, index) => (
          <Card key={`${item.date}-${index}`}>
            <View style={styles.historyRow}>
              <Text style={styles.historyScore}>
                {Math.round((item.score / item.total) * 100)}%
              </Text>
              <Text style={styles.body}>
                {item.score}/{item.total} · {new Date(item.date).toLocaleDateString("en-PH")}
              </Text>
            </View>
          </Card>
        ))
      )}

      <Button
        label="Reset my progress"
        variant="danger"
        onPress={() =>
          Alert.alert(
            "Reset progress?",
            "This clears explored stops and quiz history on this device.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Reset", style: "destructive", onPress: () => void resetUserProgress() },
            ],
          )
        }
      />
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.body}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    padding: 0,
    overflow: "hidden",
    borderColor: theme.primary,
    backgroundColor: theme.primary,
  },
  heroFill: { alignItems: "center", padding: 20 },
  ring: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 10,
    borderColor: theme.gold,
    backgroundColor: "rgba(255,250,240,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  percent: {
    fontFamily: theme.fontDisplay,
    fontSize: 40,
    fontWeight: "700",
    color: "#fff",
  },
  percentLabel: {
    fontFamily: theme.fontBody,
    fontSize: 12,
    color: theme.cream,
    marginBottom: 12,
  },
  bar: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,250,240,0.25)",
    overflow: "hidden",
  },
  barFill: { height: "100%", backgroundColor: theme.gold },
  stat: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
  },
  statValue: {
    fontFamily: theme.fontDisplay,
    fontSize: 18,
    fontWeight: "700",
    color: theme.primary,
  },
  body: { fontFamily: theme.fontBody, fontSize: 13, color: theme.muted },
  historyRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  historyScore: {
    fontFamily: theme.fontDisplay,
    fontSize: 24,
    fontWeight: "700",
    color: theme.primary,
  },
});
