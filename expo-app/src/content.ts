import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  destinations,
  questions,
  sceneSpots,
  scenes,
  visitorInfo,
  type Question,
  type Scene,
} from "./data";

export type AppSettings = {
  appName: string;
  initials: string;
  kicker: string;
  location: string;
  heroTitle: string;
  heroText: string;
  introTitle: string;
  introSubtitle: string;
  quizTitle: string;
  quizIntro: string;
  questionsPerQuiz: number;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
  requireTour: boolean;
  passingPercent: number;
};

export type Destination = (typeof destinations)[number];
export type VisitorInfo = typeof visitorInfo;

export type AppContent = {
  settings: AppSettings;
  destinations: Destination[];
  scenes: Scene[];
  sceneSpots: Record<string, import("./data").Spot[]>;
  visitorInfo: VisitorInfo;
  questions: Question[];
};

export type QuizItem = {
  source: Question;
  choices: string[];
  answer: number;
};

const STORAGE_KEY = "rizal-tour-content-v1";

const defaultSettings: AppSettings = {
  appName: "Rizal Virtual Tour",
  initials: "RV",
  kicker: "Cultural Mapping • Phase 2",
  location: "Calamba, Laguna",
  heroTitle: "Walk through the home that shaped a hero.",
  heroText:
    "Explore the gardens, sala, and dining room of the Mercado family home in Calamba — the birthplace of José Rizal.",
  introTitle: "Explore Rizal Shrine",
  introSubtitle: "The birthplace of José Rizal.",
  quizTitle: "Rizal Shrine Quiz",
  quizIntro: "Answer questions drawn from the three 360° rooms of the shrine.",
  questionsPerQuiz: 0,
  shuffleQuestions: true,
  shuffleChoices: true,
  requireTour: true,
  passingPercent: 70,
};

export const defaultContent: AppContent = {
  settings: defaultSettings,
  destinations,
  scenes,
  sceneSpots,
  visitorInfo,
  questions,
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const str = (value: unknown, fallback: string) => (typeof value === "string" ? value : fallback);

const bool = (value: unknown, fallback: boolean) => (typeof value === "boolean" ? value : fallback);

const int = (value: unknown, fallback: number, min: number, max: number) =>
  typeof value === "number" && Number.isFinite(value)
    ? Math.min(max, Math.max(min, Math.round(value)))
    : fallback;

export function normalizeContent(value: unknown): AppContent {
  if (!isObject(value)) return defaultContent;

  const rawScenes = value.scenes;
  const validScenes =
    Array.isArray(rawScenes) &&
    rawScenes.length > 0 &&
    rawScenes.every(
      (scene) =>
        isObject(scene) &&
        typeof scene.id === "string" &&
        typeof scene.title === "string" &&
        Array.isArray(scene.photos),
    ) &&
    rawScenes.some((scene) => isObject(scene) && Boolean(scene.pano))
      ? (rawScenes as Scene[])
      : defaultContent.scenes;

  const rawQuestions = value.questions;
  const validQuestions =
    Array.isArray(rawQuestions) &&
    rawQuestions.every(
      (question) =>
        isObject(question) &&
        typeof question.question === "string" &&
        Array.isArray(question.choices) &&
        question.choices.every((choice: unknown) => typeof choice === "string") &&
        typeof question.answer === "number",
    )
      ? (rawQuestions as Question[])
      : defaultContent.questions;

  const rawDestinations = value.destinations;
  const validDestinations =
    Array.isArray(rawDestinations) && rawDestinations.length > 0
      ? (rawDestinations as Destination[])
      : defaultContent.destinations;

  const rawSettings = isObject(value.settings) ? value.settings : {};
  const rawVisitor = isObject(value.visitorInfo) ? value.visitorInfo : {};
  const rawSpots = isObject(value.sceneSpots)
    ? (value.sceneSpots as AppContent["sceneSpots"])
    : defaultContent.sceneSpots;

  return {
    settings: {
      appName: str(rawSettings.appName, defaultSettings.appName),
      initials: str(rawSettings.initials, defaultSettings.initials),
      kicker: str(rawSettings.kicker, defaultSettings.kicker),
      location: str(rawSettings.location, defaultSettings.location),
      heroTitle: str(rawSettings.heroTitle, defaultSettings.heroTitle),
      heroText: str(rawSettings.heroText, defaultSettings.heroText),
      introTitle: str(rawSettings.introTitle, defaultSettings.introTitle),
      introSubtitle: str(rawSettings.introSubtitle, defaultSettings.introSubtitle),
      quizTitle: str(rawSettings.quizTitle, defaultSettings.quizTitle),
      quizIntro: str(rawSettings.quizIntro, defaultSettings.quizIntro),
      questionsPerQuiz: int(rawSettings.questionsPerQuiz, 0, 0, 999),
      shuffleQuestions: bool(rawSettings.shuffleQuestions, true),
      shuffleChoices: bool(rawSettings.shuffleChoices, true),
      requireTour: bool(rawSettings.requireTour, true),
      passingPercent: int(rawSettings.passingPercent, 70, 0, 100),
    },
    destinations: validDestinations,
    scenes: validScenes,
    sceneSpots: rawSpots,
    visitorInfo: { ...defaultContent.visitorInfo, ...rawVisitor },
    questions: validQuestions,
  };
}

export async function loadContent(): Promise<AppContent> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? normalizeContent(JSON.parse(raw)) : defaultContent;
  } catch {
    return defaultContent;
  }
}

export async function saveContent(content: AppContent): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(content));
}

export async function resetContent(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

const shuffled = <T>(items: T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export function buildQuiz(content: AppContent): QuizItem[] {
  const items: QuizItem[] = [];

  for (const question of content.questions) {
    if (
      !question.question?.trim() ||
      !Array.isArray(question.choices) ||
      question.choices.filter((choice) => choice?.trim()).length < 2 ||
      !Number.isInteger(question.answer) ||
      question.answer < 0 ||
      question.answer >= question.choices.length
    ) {
      continue;
    }

    const indices = question.choices.map((_, index) => index);
    const ordered = content.settings.shuffleChoices ? shuffled(indices) : indices;
    const choices = ordered.map((index) => question.choices[index]);
    const answer = choices.indexOf(question.choices[question.answer]);
    items.push({ source: question, choices, answer });
  }

  const orderedItems = content.settings.shuffleQuestions ? shuffled(items) : items;
  const limit =
    content.settings.questionsPerQuiz > 0 ? content.settings.questionsPerQuiz : orderedItems.length;
  return orderedItems.slice(0, limit);
}

const RAW_BASE = "https://raw.githubusercontent.com/DreiDrei0520/rizaltour/main/public";

export function assetUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${RAW_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}
