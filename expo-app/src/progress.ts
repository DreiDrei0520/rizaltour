import AsyncStorage from "@react-native-async-storage/async-storage";

export type QuizResult = {
  score: number;
  total: number;
  date: string;
};

export type Progress = {
  explored: string[];
  tourFinished: boolean;
  quizHistory: QuizResult[];
};

const STORAGE_KEY = "rizal-tour-progress";
const ONBOARDED_KEY = "rizal-onboarded";

export const initialProgress: Progress = {
  explored: [],
  tourFinished: false,
  quizHistory: [],
};

export async function loadProgress(): Promise<Progress> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return initialProgress;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      explored: Array.isArray(parsed.explored)
        ? parsed.explored.filter((id): id is string => typeof id === "string")
        : [],
      tourFinished: parsed.tourFinished === true,
      quizHistory: Array.isArray(parsed.quizHistory)
        ? parsed.quizHistory.filter(
            (entry): entry is QuizResult =>
              typeof entry === "object" &&
              entry !== null &&
              typeof entry.score === "number" &&
              typeof entry.total === "number" &&
              typeof entry.date === "string",
          )
        : [],
    };
  } catch {
    return initialProgress;
  }
}

export async function saveProgress(progress: Progress): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export async function resetProgress(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export async function hasOnboarded(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(ONBOARDED_KEY)) === "true";
  } catch {
    return false;
  }
}

export async function markOnboarded(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDED_KEY, "true");
}
