import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  loadContent,
  resetContent,
  saveContent,
  type AppContent,
  type AppSettings,
} from "./content";
import {
  initialProgress,
  loadProgress,
  resetProgress,
  saveProgress,
  type Progress,
} from "./progress";

type AppContextValue = {
  ready: boolean;
  content: AppContent;
  progress: Progress;
  panoScenes: AppContent["scenes"];
  storyScenes: AppContent["scenes"];
  updateContent: (content: AppContent) => Promise<void>;
  patchSettings: (patch: Partial<AppSettings>) => Promise<void>;
  resetAppContent: () => Promise<void>;
  markExplored: (id: string) => Promise<void>;
  finishTour: () => Promise<void>;
  recordQuiz: (score: number, total: number) => Promise<void>;
  resetUserProgress: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

const emptyContent: AppContent = {
  settings: {
    appName: "Rizal Virtual Tour",
    initials: "RV",
    kicker: "",
    location: "",
    heroTitle: "",
    heroText: "",
    introTitle: "",
    introSubtitle: "",
    quizTitle: "",
    quizIntro: "",
    questionsPerQuiz: 0,
    shuffleQuestions: true,
    shuffleChoices: true,
    requireTour: true,
    passingPercent: 70,
    apkDownloadUrl: "",
  },
  destinations: [],
  scenes: [],
  sceneSpots: {},
  visitorInfo: {
    address: "",
    hours: "",
    contact: "",
    note: "",
    source: "",
    lat: 0,
    lng: 0,
    mapUrl: "",
    directionsUrl: "",
  },
  questions: [],
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [content, setContent] = useState<AppContent>(emptyContent);
  const [progress, setProgress] = useState<Progress>(initialProgress);

  useEffect(() => {
    let active = true;
    Promise.all([loadContent(), loadProgress()]).then(([loadedContent, loadedProgress]) => {
      if (!active) return;
      setContent(loadedContent);
      setProgress(loadedProgress);
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const updateContent = useCallback(async (next: AppContent) => {
    setContent(next);
    await saveContent(next);
  }, []);

  const patchSettings = useCallback(
    async (patch: Partial<AppSettings>) => {
      await updateContent({ ...content, settings: { ...content.settings, ...patch } });
    },
    [content, updateContent],
  );

  const resetAppContent = useCallback(async () => {
    const { defaultContent } = await import("./content");
    await resetContent();
    setContent(defaultContent);
  }, []);

  const markExplored = useCallback(async (id: string) => {
    setProgress((current) => {
      if (current.explored.includes(id)) return current;
      const next = { ...current, explored: [...current.explored, id] };
      void saveProgress(next);
      return next;
    });
  }, []);

  const finishTour = useCallback(async () => {
    setProgress((current) => {
      const next: Progress = {
        ...current,
        explored: Array.from(new Set([...current.explored, ...content.scenes.map((s) => s.id)])),
        tourFinished: true,
      };
      void saveProgress(next);
      return next;
    });
  }, [content.scenes]);

  const recordQuiz = useCallback(async (score: number, total: number) => {
    setProgress((current) => {
      const next: Progress = {
        ...current,
        quizHistory: [...current.quizHistory, { score, total, date: new Date().toISOString() }],
      };
      void saveProgress(next);
      return next;
    });
  }, []);

  const resetUserProgress = useCallback(async () => {
    await resetProgress();
    setProgress(initialProgress);
  }, []);

  const panoScenes = useMemo(
    () => content.scenes.filter((scene) => Boolean(scene.pano)),
    [content.scenes],
  );
  const storyScenes = useMemo(
    () => content.scenes.filter((scene) => !scene.pano),
    [content.scenes],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      ready,
      content,
      progress,
      panoScenes,
      storyScenes,
      updateContent,
      patchSettings,
      resetAppContent,
      markExplored,
      finishTour,
      recordQuiz,
      resetUserProgress,
    }),
    [
      ready,
      content,
      progress,
      panoScenes,
      storyScenes,
      updateContent,
      patchSettings,
      resetAppContent,
      markExplored,
      finishTour,
      recordQuiz,
      resetUserProgress,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp must be used inside AppProvider");
  return value;
}
