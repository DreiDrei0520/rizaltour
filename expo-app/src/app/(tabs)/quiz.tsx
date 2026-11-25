import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
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

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${((index + (selected === null ? 0 : 1)) / items.length) * 100}%` },
          ]}
        />
      </View>

      <Card>
        <Text style={styles.question}>{item.source.question}</Text>

        {item.choices.map((choice, choiceIndex) => {
          const correct = choiceIndex === item.answer;
          const chosen = selected === choiceIndex;
          const answerState =
            selected === null
              ? styles.choice
              : correct
                ? styles.choiceCorrect
                : chosen
                  ? styles.choiceWrong
                  : styles.choiceDim;
          return (
            <Pressable
              key={`${choice}-${choiceIndex}`}
              onPress={() => {
                if (selected !== null) return;
                setSelected(choiceIndex);
                if (correct) setScore((value) => value + 1);
              }}
              style={({ pressed }) => [styles.choiceBase, answerState, pressed && styles.pressed]}
            >
              <Text
                style={[
                  styles.choiceLetter,
                  correct && selected !== null && styles.choiceLetterGood,
                  chosen && !correct && styles.choiceLetterBad,
                ]}
              >
                {String.fromCharCode(65 + choiceIndex)}
              </Text>
              <Text style={styles.choiceText}>{choice}</Text>
            </Pressable>
          );
        })}

        {selected !== null ? (
          <View style={[styles.feedback, isCorrect ? styles.feedbackGood : styles.feedbackBad]}>
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
  body: { fontFamily: theme.fontBody, fontSize: 13, color: theme.muted, lineHeight: 19 },
  progressTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: theme.line,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: { height: "100%", backgroundColor: theme.gold },
  question: {
    fontFamily: theme.fontDisplay,
    fontSize: 28,
    fontWeight: "700",
    color: theme.ink,
    lineHeight: 34,
    marginBottom: 16,
  },
  choiceBase: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 60,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: "#fffdf8",
  },
  choice: { borderColor: theme.line },
  choiceCorrect: { borderColor: theme.success, backgroundColor: theme.successBg },
  choiceWrong: { borderColor: "#a33c3c", backgroundColor: theme.dangerBg },
  choiceDim: { borderColor: theme.line, backgroundColor: "#fffaf2", opacity: 0.6 },
  pressed: { opacity: 0.82 },
  choiceLetter: {
    fontFamily: theme.fontBody,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#f1e7d4",
    color: theme.primary,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 34,
  },
  choiceLetterGood: { backgroundColor: theme.success, color: "#fff" },
  choiceLetterBad: { backgroundColor: "#a33c3c", color: "#fff" },
  choiceText: {
    fontFamily: theme.fontBody,
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: theme.ink,
  },
  feedback: {
    borderLeftWidth: 4,
    borderRadius: 14,
    padding: 12,
    marginTop: 2,
    marginBottom: 12,
  },
  feedbackGood: { borderLeftColor: theme.success, backgroundColor: theme.successBg },
  feedbackBad: { borderLeftColor: "#a33c3c", backgroundColor: theme.dangerBg },
  feedbackTitle: { fontFamily: theme.fontBody, fontSize: 15, fontWeight: "700", marginBottom: 4 },
  good: { color: "#285431" },
  bad: { color: "#792626" },
  resultCard: { alignItems: "center" },
  medal: {
    fontFamily: theme.fontDisplay,
    fontSize: 30,
    fontWeight: "700",
    color: theme.gold,
    marginBottom: 4,
  },
  score: {
    fontFamily: theme.fontDisplay,
    fontSize: 40,
    fontWeight: "700",
    color: theme.primary,
    marginBottom: 8,
  },
});
