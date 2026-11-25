import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  destinations as defaultDestinations,
  questions as defaultQuestions,
  sceneSpots as defaultSceneSpots,
  scenes as defaultScenes,
  visitorInfo as defaultVisitorInfo,
  type Question,
  type Scene,
  type Spot,
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
  passingPercent: number;
  requireTour: boolean;
};

export type Destination = (typeof defaultDestinations)[number];
export type VisitorInfo = typeof defaultVisitorInfo;

export type AppContent = {
  settings: AppSettings;
  destinations: Destination[];
  scenes: Scene[];
  sceneSpots: Record<string, Spot[]>;
  visitorInfo: VisitorInfo;
  questions: Question[];
};

export const defaultContent: AppContent = {
  settings: {
    appName: "Rizal Virtual Tour",
    initials: "RV",
    kicker: "Cultural Mapping • Phase 2",
    location: "Calamba, Laguna",
    heroTitle: "Walk through the\nhome that shaped a hero.",
    heroText: "Explore the gardens, sala, and dining room in real 360°—anytime, anywhere.",
    introTitle: "Explore Rizal Shrine",
    introSubtitle: "The birthplace of José Rizal.",
    quizTitle: "Rizal Shrine Quiz",
    quizIntro: "The questions come from the gardens, sala, and dining room inside the 360° tour.",
    questionsPerQuiz: 0,
    shuffleQuestions: true,
    shuffleChoices: true,
    passingPercent: 70,
    requireTour: true,
  },
  destinations: defaultDestinations,
  scenes: defaultScenes,
  sceneSpots: defaultSceneSpots,
  visitorInfo: defaultVisitorInfo,
  questions: defaultQuestions,
};

const STORAGE_KEY = "rizal-tour-content-v1";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidScene(value: unknown): value is Scene {
  if (!isObject(value)) return false;
  return (
    typeof value.id === "string" && typeof value.title === "string" && Array.isArray(value.photos)
  );
}

function isValidQuestion(value: unknown): value is Question {
  if (!isObject(value)) return false;
  return (
    typeof value.question === "string" &&
    Array.isArray(value.choices) &&
    value.choices.every((choice) => typeof choice === "string") &&
    typeof value.answer === "number"
  );
}

export function normalizeContent(value: unknown): AppContent {
  if (!isObject(value)) return defaultContent;
  const saved = value as Partial<AppContent>;
  const candidateScenes =
    Array.isArray(saved.scenes) && saved.scenes.length > 0 && saved.scenes.every(isValidScene)
      ? saved.scenes
      : defaultContent.scenes;
  const scenes = candidateScenes.some((scene) => Boolean(scene.pano))
    ? candidateScenes
    : defaultContent.scenes;
  const questions =
    Array.isArray(saved.questions) && saved.questions.every(isValidQuestion)
      ? saved.questions
      : defaultContent.questions;
  const destinations =
    Array.isArray(saved.destinations) && saved.destinations.length > 0
      ? (saved.destinations as Destination[])
      : defaultContent.destinations;
  const settings = isObject(saved.settings) ? (saved.settings as Partial<AppSettings>) : {};
  const visitorInfo = isObject(saved.visitorInfo)
    ? (saved.visitorInfo as Partial<VisitorInfo>)
    : {};

  return {
    settings: {
      ...defaultContent.settings,
      ...settings,
      questionsPerQuiz: Number.isFinite(settings.questionsPerQuiz)
        ? Math.max(0, Math.floor(Number(settings.questionsPerQuiz)))
        : defaultContent.settings.questionsPerQuiz,
      passingPercent: Number.isFinite(settings.passingPercent)
        ? Math.min(100, Math.max(0, Math.floor(Number(settings.passingPercent))))
        : defaultContent.settings.passingPercent,
      shuffleQuestions:
        settings.shuffleQuestions === undefined
          ? defaultContent.settings.shuffleQuestions
          : Boolean(settings.shuffleQuestions),
      shuffleChoices:
        settings.shuffleChoices === undefined
          ? defaultContent.settings.shuffleChoices
          : Boolean(settings.shuffleChoices),
      requireTour:
        settings.requireTour === undefined
          ? defaultContent.settings.requireTour
          : Boolean(settings.requireTour),
    },
    destinations,
    scenes,
    sceneSpots: isObject(saved.sceneSpots)
      ? (saved.sceneSpots as Record<string, Spot[]>)
      : defaultContent.sceneSpots,
    visitorInfo: { ...defaultContent.visitorInfo, ...visitorInfo },
    questions,
  };
}

function loadContent(): AppContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? normalizeContent(JSON.parse(raw)) : defaultContent;
  } catch {
    return defaultContent;
  }
}

type ContentContextValue = {
  content: AppContent;
  panoScenes: Scene[];
  storyScenes: Scene[];
  sceneSpots: Record<string, Spot[]>;
  updateContent: (next: AppContent) => void;
  patchSettings: (patch: Partial<AppSettings>) => void;
  resetContent: () => void;
  exportContent: () => string;
  importContent: (json: string) => boolean;
};

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<AppContent>(loadContent);

  const updateContent = useCallback((next: AppContent) => {
    const normalized = normalizeContent(next);
    setContent(normalized);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    } catch {}
  }, []);

  const patchSettings = useCallback((patch: Partial<AppSettings>) => {
    setContent((current) => {
      const next = normalizeContent({ ...current, settings: { ...current.settings, ...patch } });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage failures.
      }
      return next;
    });
  }, []);

  const resetContent = useCallback(() => {
    setContent(defaultContent);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage failures.
    }
  }, []);

  const exportContent = useCallback(() => JSON.stringify(content, null, 2), [content]);

  const importContent = useCallback(
    (json: string) => {
      try {
        updateContent(JSON.parse(json));
        return true;
      } catch {
        return false;
      }
    },
    [updateContent],
  );

  const value = useMemo<ContentContextValue>(() => {
    const panoScenes = content.scenes.filter((scene) => Boolean(scene.pano));
    return {
      content,
      panoScenes,
      storyScenes: content.scenes.filter((scene) => !scene.pano),
      sceneSpots: content.sceneSpots,
      updateContent,
      patchSettings,
      resetContent,
      exportContent,
      importContent,
    };
  }, [content, updateContent, patchSettings, resetContent, exportContent, importContent]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): ContentContextValue {
  const context = useContext(ContentContext);
  if (!context) throw new Error("useContent must be used inside ContentProvider");
  return context;
}

export function isValidQuizQuestion(question: Question): boolean {
  const choices = question.choices ?? [];
  return (
    Boolean(question.question?.trim()) &&
    choices.length >= 2 &&
    choices.every((choice) => choice.trim()) &&
    Number.isInteger(question.answer) &&
    question.answer >= 0 &&
    question.answer < choices.length
  );
}

export type QuizItem = { source: Question; choices: string[]; answer: number };

function shuffled<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

export function buildQuiz(content: AppContent): QuizItem[] {
  let items: QuizItem[] = content.questions.filter(isValidQuizQuestion).map((question) => {
    const order = question.choices.map((_, index) => index);
    const choices = content.settings.shuffleChoices ? shuffled(order) : order;
    return {
      source: question,
      choices: choices.map((index) => question.choices[index]!),
      answer: choices.indexOf(question.answer),
    };
  });
  if (content.settings.shuffleQuestions) items = shuffled(items);
  const limit =
    content.settings.questionsPerQuiz > 0 ? content.settings.questionsPerQuiz : items.length;
  return items.slice(0, limit);
}
