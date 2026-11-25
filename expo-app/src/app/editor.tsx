import { useEffect, useState } from "react";
import { Alert, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import { useApp } from "@/AppContext";
import { normalizeContent, type AppContent } from "@/content";
import { Button, Card, Screen, SectionTitle, theme } from "@/components/ui";

export default function EditorScreen() {
  const { ready, content, updateContent, resetAppContent } = useApp();
  const [draft, setDraft] = useState<AppContent | null>(null);

  useEffect(() => {
    setDraft(content);
  }, [content]);

  if (!ready || !draft) return null;

  const settings = draft.settings;

  const patchSetting = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) =>
    setDraft((current) =>
      current ? { ...current, settings: { ...current.settings, [key]: value } } : current,
    );

  const patchQuestion = (index: number, patch: Partial<AppContent["questions"][number]>) =>
    setDraft((current) => {
      if (!current) return current;
      const questions = [...current.questions];
      questions[index] = { ...questions[index], ...patch };
      return { ...current, questions };
    });

  const addQuestion = () =>
    setDraft((current) =>
      current
        ? {
            ...current,
            questions: [
              ...current.questions,
              {
                sceneId: "grounds",
                stop: "New stop",
                question: "",
                choices: ["", "", "", ""],
                answer: 0,
                explanation: "",
              },
            ],
          }
        : current,
    );

  const deleteQuestion = (index: number) =>
    setDraft((current) =>
      current
        ? { ...current, questions: current.questions.filter((_, i) => i !== index) }
        : current,
    );

  const save = async () => {
    await updateContent(draft);
    Alert.alert("Saved", "Your edits are saved on this device.");
    router.back();
  };

  const exportJson = async () => {
    await Clipboard.setStringAsync(JSON.stringify(draft, null, 2));
    Alert.alert("Copied", "The content JSON is on your clipboard.");
  };

  const importJson = async () => {
    const text = await Clipboard.getStringAsync();
    if (!text) {
      Alert.alert("Nothing to paste", "Your clipboard is empty.");
      return;
    }
    try {
      setDraft(normalizeContent(JSON.parse(text)));
      Alert.alert("Loaded", "Review the pasted content, then tap Save changes.");
    } catch {
      Alert.alert("Invalid JSON", "No changes were made.");
    }
  };

  return (
    <Screen>
      <SectionTitle
        title="Content studio"
        subtitle="Edits stay on this device; the Vercel web app is view-only"
      />

      <Card>
        <Field
          label="App name"
          value={settings.appName}
          onChange={(value) => patchSetting("appName", value)}
        />
        <Field
          label="Kicker"
          value={settings.kicker}
          onChange={(value) => patchSetting("kicker", value)}
        />
        <Field
          label="Location"
          value={settings.location}
          onChange={(value) => patchSetting("location", value)}
        />
        <Field
          label="Hero title"
          value={settings.heroTitle}
          onChange={(value) => patchSetting("heroTitle", value)}
          multiline
        />
        <Field
          label="Hero text"
          value={settings.heroText}
          onChange={(value) => patchSetting("heroText", value)}
          multiline
        />
        <Field
          label="Quiz title"
          value={settings.quizTitle}
          onChange={(value) => patchSetting("quizTitle", value)}
        />
        <Field
          label="Quiz intro"
          value={settings.quizIntro}
          onChange={(value) => patchSetting("quizIntro", value)}
          multiline
        />
        <Field
          label="Questions per quiz (0 = all)"
          value={String(settings.questionsPerQuiz)}
          onChange={(value) =>
            patchSetting("questionsPerQuiz", Math.max(0, Number.parseInt(value, 10) || 0))
          }
          keyboardType="numeric"
        />
        <Field
          label="Passing percent"
          value={String(settings.passingPercent)}
          onChange={(value) =>
            patchSetting(
              "passingPercent",
              Math.min(100, Math.max(0, Number.parseInt(value, 10) || 0)),
            )
          }
          keyboardType="numeric"
        />
        <Toggle
          label="Shuffle questions"
          value={settings.shuffleQuestions}
          onChange={(value) => patchSetting("shuffleQuestions", value)}
        />
        <Toggle
          label="Shuffle choices"
          value={settings.shuffleChoices}
          onChange={(value) => patchSetting("shuffleChoices", value)}
        />
        <Toggle
          label="Require tour before quiz"
          value={settings.requireTour}
          onChange={(value) => patchSetting("requireTour", value)}
        />
      </Card>

      <SectionTitle title="Questions" subtitle={`${draft.questions.length} in this quiz`} />
      {draft.questions.map((question, index) => (
        <Card key={index}>
          <View style={styles.questionHead}>
            <Text style={styles.questionNumber}>Q{index + 1}</Text>
            <Button label="Delete" variant="danger" onPress={() => deleteQuestion(index)} />
          </View>
          <Field
            label="Stop"
            value={question.stop}
            onChange={(value) => patchQuestion(index, { stop: value })}
          />
          <Field
            label="Question"
            value={question.question}
            onChange={(value) => patchQuestion(index, { question: value })}
            multiline
          />
          {question.choices.map((choice, choiceIndex) => (
            <Field
              key={choiceIndex}
              label={`Choice ${choiceIndex + 1}${choiceIndex === question.answer ? " (answer)" : ""}`}
              value={choice}
              onChange={(value) => {
                const choices = [...question.choices];
                choices[choiceIndex] = value;
                patchQuestion(index, { choices });
              }}
            />
          ))}
          <Field
            label="Correct choice number"
            value={String(question.answer + 1)}
            onChange={(value) => {
              const answer = Math.min(
                question.choices.length,
                Math.max(1, Number.parseInt(value, 10) || 1),
              );
              patchQuestion(index, { answer: answer - 1 });
            }}
            keyboardType="numeric"
          />
          <Field
            label="Explanation"
            value={question.explanation}
            onChange={(value) => patchQuestion(index, { explanation: value })}
            multiline
          />
        </Card>
      ))}
      <Button label="Add question" variant="secondary" onPress={addQuestion} />

      <SectionTitle title="Backup" subtitle="Copy or paste content JSON" />
      <Button label="Copy JSON to clipboard" variant="ghost" onPress={() => void exportJson()} />
      <Button label="Paste JSON from clipboard" variant="ghost" onPress={() => void importJson()} />

      <Button label="Save changes" onPress={() => void save()} />
      <Button
        label="Reset to original content"
        variant="danger"
        onPress={() =>
          Alert.alert("Reset content?", "This restores the original tour and questions.", [
            { text: "Cancel", style: "cancel" },
            { text: "Reset", style: "destructive", onPress: () => void resetAppContent() },
          ])
        }
      />
    </Screen>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  keyboardType = "default",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  keyboardType?: "default" | "numeric";
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multiline]}
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        keyboardType={keyboardType}
      />
    </View>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.toggle}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 12 },
  label: { fontSize: 12, fontWeight: "700", color: theme.ink, marginBottom: 5 },
  input: {
    backgroundColor: theme.cream,
    borderWidth: 1,
    borderColor: theme.line,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    fontSize: 13,
    color: theme.ink,
  },
  multiline: { minHeight: 70, textAlignVertical: "top" },
  toggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  questionHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  questionNumber: { fontSize: 15, fontWeight: "800", color: theme.green },
});
