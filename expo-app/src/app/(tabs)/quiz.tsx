import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useApp } from "@/AppContext";
import { buildQuiz } from "@/content";
import { Button, Card, Screen, SectionTitle, theme } from "@/components/ui";

export default function QuizScreen() {
  const { ready, content, progress, recordQuiz } = useApp();
  const items = useMemo(() => buildQuiz(content), [content]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [attempt, setAttempt] = useState(0);

  if (!ready) return null;

  const { settings } = content;
  const locked = settings.requireTour && !progress.tourFinished && progress.explored.length === 0;

  if (items.length === 0) {
    return (
      <Screen>
        <SectionTitle title={settings.quizTitle} subtitle="No questions yet" />
        <Card>
          <Text style={styles.body}>Add questions in the Content studio to start the quiz.</Text>
          <Button label="Open Content studio" onPress={() => router.push("/editor")} />
        </Card>
      </Screen>
    );
  }

  if (locked) {
    return (
      <Screen>
        <SectionTitle title={settings.quizTitle} subtitle="Locked" />
        <Card>
          <Text style={styles.body}>
            Explore the 360° tour first. The quiz unlocks after you visit at least one pano stop.
          </Text>
          <Button label="Start 360° Tour" onPress={() => router.push("/tour")} />
        </Card>
      </Screen>
    );
  }

  if (finished) {
    const percent = Math.round((score / items.length) * 100);
    const best = progress.quizHistory.length
      ? Math.max(...progress.quizHistory.map((item) => Math.round((item.score / item.total) * 100)))
      : percent;
    const medal = percent >= 90 ? "Gold" : percent >= settings.passingPercent ? "Silver" : "Bronze";

    return (
      <Screen>
        <SectionTitle title="Quiz complete" subtitle={`Attempt ${attempt || 1}`} />
        <Card style={styles.resultCard}>
          <Text style={styles.medal}>{medal}</Text>
          <Text style={styles.score}>
            {score}/{items.length}
          </Text>
          <Text style={styles.body}>
            That's {percent}% correct. Your best is {best}%.
          </Text>
          <Button label="View Progress" onPress={() => router.push("/progress")} />
          <Button
            label="Retake Quiz"
            variant="secondary"
            onPress={() => {
              setIndex(0);
              setSelected(null);
              setScore(0);
              setFinished(false);
              setAttempt((value) => value + 1);
            }}
          />
          <Button label="Back to Tour" variant="ghost" onPress={() => router.push("/tour")} />
        </Card>
      </Screen>
    );
  }

  const item = items[index];
  const isCorrect = selected === item.answer;

  return (
    <Screen>
      <SectionTitle
        title={settings.quizTitle}
        subtitle={`Question ${index + 1} of ${items.length} · ${item.source.stop}`}
      />

      <Card>
        <Text style={styles.question}>{item.source.question}</Text>

        {item.choices.map((choice, choiceIndex) => {
          const correct = choiceIndex === item.answer;
          return (
            <Button
              key={`${choice}-${choiceIndex}`}
              label={choice}
              variant="ghost"
              onPress={() => {
                if (selected !== null) return;
                setSelected(choiceIndex);
                if (correct) setScore((value) => value + 1);
              }}
            />
          );
        })}

        {selected !== null ? (
          <View style={styles.feedback}>
            <Text style={[styles.feedbackTitle, isCorrect ? styles.good : styles.bad]}>
              {isCorrect ? "Correct!" : "Not quite"}
            </Text>
            <Text style={styles.body}>{item.source.explanation}</Text>
          </View>
        ) : null}

        {selected !== null ? (
          <Button
            label={index === items.length - 1 ? "See my results" : "Next question"}
            onPress={() => {
              if (index === items.length - 1) {
                void recordQuiz(score, items.length);
                setFinished(true);
              } else {
                setIndex((value) => value + 1);
                setSelected(null);
              }
            }}
          />
        ) : null}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { fontSize: 13, color: theme.muted, lineHeight: 19 },
  question: { fontSize: 17, fontWeight: "700", color: theme.ink, lineHeight: 24, marginBottom: 16 },
  choice: { marginBottom: 2 },
  choiceSelected: { borderColor: theme.green },
  choiceCorrect: { backgroundColor: "#e2f2e8", borderColor: theme.greenLight },
  choiceWrong: { backgroundColor: "#f7e4e1", borderColor: theme.danger },
  feedback: { marginTop: 12, marginBottom: 12 },
  feedbackTitle: { fontSize: 15, fontWeight: "700", marginBottom: 4 },
  good: { color: theme.green },
  bad: { color: theme.danger },
  resultCard: { alignItems: "center" },
  medal: { fontSize: 30, fontWeight: "800", color: theme.gold, marginBottom: 4 },
  score: { fontSize: 22, fontWeight: "700", color: theme.green, marginBottom: 8 },
});
