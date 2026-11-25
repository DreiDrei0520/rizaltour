import { Alert, StyleSheet, Text, View } from "react-native";
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
        <Text style={styles.percent}>{overall}%</Text>
        <Text style={styles.percentLabel}>overall completion</Text>
        <View style={styles.bar}>
          <View style={[styles.barFill, { width: `${overall}%` }]} />
        </View>
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
  hero: { alignItems: "center" },
  percent: { fontSize: 42, fontWeight: "800", color: theme.green },
  percentLabel: { fontSize: 12, color: theme.muted, marginBottom: 12 },
  bar: {
    width: "100%",
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.line,
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
  statValue: { fontSize: 14, fontWeight: "700", color: theme.green },
  body: { fontSize: 13, color: theme.muted },
  historyRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  historyScore: { fontSize: 18, fontWeight: "800", color: theme.green },
});
