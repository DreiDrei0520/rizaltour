import { useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { useContent, type AppContent, type Destination, type VisitorInfo } from "./content";
import type { Question, Scene } from "./data";

type Tab = "questions" | "stops" | "info" | "settings";

const tabs: { id: Tab; label: string }[] = [
  { id: "questions", label: "Questions" },
  { id: "stops", label: "Tour stops" },
  { id: "info", label: "Information" },
  { id: "settings", label: "Quiz & app" },
];

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="editor-field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

const infoFields: {
  key: keyof VisitorInfo;
  label: string;
  multiline?: boolean;
  number?: boolean;
}[] = [
  { key: "address", label: "Address", multiline: true },
  { key: "hours", label: "Opening hours" },
  { key: "contact", label: "Contact" },
  { key: "note", label: "Good to know", multiline: true },
  { key: "source", label: "Source" },
  { key: "lat", label: "Latitude", number: true },
  { key: "lng", label: "Longitude", number: true },
  { key: "mapUrl", label: "Embedded map URL" },
  { key: "directionsUrl", label: "Directions URL" },
];

export default function ContentEditor({
  close,
  notify,
}: {
  close: () => void;
  notify: (message: string) => void;
}) {
  const { content, updateContent, patchSettings, resetContent, exportContent, importContent } =
    useContent();
  const [tab, setTab] = useState<Tab>("questions");
  const [confirmReset, setConfirmReset] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (next: AppContent) => updateContent(next);

  const move = <T,>(items: T[], from: number, to: number): T[] => {
    if (to < 0 || to >= items.length) return items;
    const copy = [...items];
    const [item] = copy.splice(from, 1);
    copy.splice(to, 0, item!);
    return copy;
  };

  const updateQuestion = (index: number, patch: Partial<Question>) =>
    set({
      ...content,
      questions: content.questions.map((q, i) => (i === index ? { ...q, ...patch } : q)),
    });

  const updateScene = (index: number, patch: Partial<Scene>) =>
    set({
      ...content,
      scenes: content.scenes.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    });

  const updateDestination = (index: number, patch: Partial<Destination>) =>
    set({
      ...content,
      destinations: content.destinations.map((d, i) => (i === index ? { ...d, ...patch } : d)),
    });

  const download = () => {
    const blob = new Blob([exportContent()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rizal-tour-content.json";
    link.click();
    URL.revokeObjectURL(url);
    notify("Content exported as JSON.");
  };

  const onImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    notify(
      importContent(text)
        ? "Content imported successfully."
        : "Invalid JSON file. No changes were made.",
    );
    event.target.value = "";
  };

  return (
    <main className="page editor-page">
      <div className="page-header">
        <div>
          <p className="kicker">Content studio</p>
          <h1>Edit tour content</h1>
        </div>
        <button className="icon-button pale" onClick={close} aria-label="Close editor">
          ×
        </button>
      </div>
      <p className="editor-intro">
        Changes save automatically on this device. Export the JSON to share the same questions and
        details with other phones.
      </p>

      <div className="editor-tabs">
        {tabs.map((item) => (
          <button
            key={item.id}
            className={tab === item.id ? "active" : ""}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "questions" && (
        <section className="editor-section">
          <p className="editor-note">
            {content.questions.length} question{content.questions.length === 1 ? "" : "s"} saved.
            Only complete questions appear in the quiz.
          </p>
          {content.questions.map((q, index) => (
            <article className="editor-card" key={index}>
              <div className="editor-card-head">
                <strong>Question {index + 1}</strong>
                <div className="editor-mini-actions">
                  <button
                    onClick={() =>
                      set({ ...content, questions: move(content.questions, index, index - 1) })
                    }
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() =>
                      set({ ...content, questions: move(content.questions, index, index + 1) })
                    }
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <button
                    className="remove"
                    onClick={() =>
                      set({
                        ...content,
                        questions: content.questions.filter((_, i) => i !== index),
                      })
                    }
                    aria-label="Delete question"
                  >
                    ×
                  </button>
                </div>
              </div>
              <Field label="Stop / topic">
                <input
                  value={q.stop ?? ""}
                  onChange={(e) => updateQuestion(index, { stop: e.target.value })}
                />
              </Field>
              <Field label="Question">
                <textarea
                  rows={2}
                  value={q.question}
                  onChange={(e) => updateQuestion(index, { question: e.target.value })}
                />
              </Field>
              <Field label="Choices" hint="One choice per line. The first line is choice A.">
                <textarea
                  rows={4}
                  value={q.choices.join("\n")}
                  onChange={(e) =>
                    updateQuestion(index, {
                      choices: e.target.value.split("\n").map((choice) => choice.trim()),
                    })
                  }
                />
              </Field>
              <Field label="Correct answer">
                <select
                  value={q.answer}
                  onChange={(e) => updateQuestion(index, { answer: Number(e.target.value) })}
                >
                  {q.choices.map((choice, i) => (
                    <option key={i} value={i}>
                      {String.fromCharCode(65 + i)} — {choice || `Choice ${i + 1}`}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Explanation">
                <textarea
                  rows={2}
                  value={q.explanation ?? ""}
                  onChange={(e) => updateQuestion(index, { explanation: e.target.value })}
                />
              </Field>
            </article>
          ))}
          <button
            className="secondary full"
            onClick={() =>
              set({
                ...content,
                questions: [
                  ...content.questions,
                  {
                    sceneId: "",
                    stop: "New stop",
                    question: "",
                    choices: ["", "", "", ""],
                    answer: 0,
                    explanation: "",
                  },
                ],
              })
            }
          >
            + Add question
          </button>
        </section>
      )}

      {tab === "stops" && (
        <section className="editor-section">
          <p className="editor-note">
            Edit the text shown in each stop. Photos and 360° panoramas stay in the original tour
            data.
          </p>
          {content.scenes.map((scene, index) => (
            <article className="editor-card" key={scene.id}>
              <div className="editor-card-head">
                <strong>{scene.shortTitle || scene.title}</strong>
                <small>
                  {scene.photos.length} photos{scene.pano ? " · 360°" : ""}
                </small>
              </div>
              <Field label="Title">
                <input
                  value={scene.title}
                  onChange={(e) => updateScene(index, { title: e.target.value })}
                />
              </Field>
              <Field label="Short title">
                <input
                  value={scene.shortTitle}
                  onChange={(e) => updateScene(index, { shortTitle: e.target.value })}
                />
              </Field>
              <Field label="Description">
                <textarea
                  rows={3}
                  value={scene.description}
                  onChange={(e) => updateScene(index, { description: e.target.value })}
                />
              </Field>
              <Field label="Why it matters">
                <textarea
                  rows={3}
                  value={scene.significance}
                  onChange={(e) => updateScene(index, { significance: e.target.value })}
                />
              </Field>
              <Field label="Hotspot label">
                <input
                  value={scene.hotspotLabel}
                  onChange={(e) => updateScene(index, { hotspotLabel: e.target.value })}
                />
              </Field>
              <Field label="Details" hint="One detail per line.">
                <textarea
                  rows={4}
                  value={scene.details.join("\n")}
                  onChange={(e) =>
                    updateScene(index, {
                      details: e.target.value
                        .split("\n")
                        .map((line) => line.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </Field>
            </article>
          ))}
        </section>
      )}

      {tab === "info" && (
        <section className="editor-section">
          <article className="editor-card">
            <div className="editor-card-head">
              <strong>Visitor information</strong>
            </div>
            {infoFields.map((field) => (
              <Field key={field.key} label={field.label}>
                {field.multiline ? (
                  <textarea
                    rows={3}
                    value={String(content.visitorInfo[field.key])}
                    onChange={(e) =>
                      set({
                        ...content,
                        visitorInfo: { ...content.visitorInfo, [field.key]: e.target.value },
                      })
                    }
                  />
                ) : (
                  <input
                    type={field.number ? "number" : "text"}
                    step={field.number ? "any" : undefined}
                    value={String(content.visitorInfo[field.key])}
                    onChange={(e) =>
                      set({
                        ...content,
                        visitorInfo: {
                          ...content.visitorInfo,
                          [field.key]: field.number ? Number(e.target.value) : e.target.value,
                        },
                      })
                    }
                  />
                )}
              </Field>
            ))}
          </article>
          <article className="editor-card">
            <div className="editor-card-head">
              <strong>Destinations</strong>
            </div>
            {content.destinations.map((destination, index) => (
              <div className="editor-group" key={index}>
                <Field label="Province">
                  <input
                    value={destination.province}
                    onChange={(e) => updateDestination(index, { province: e.target.value })}
                  />
                </Field>
                <Field label="Place">
                  <input
                    value={destination.place}
                    onChange={(e) => updateDestination(index, { place: e.target.value })}
                  />
                </Field>
                <div className="editor-row">
                  <Field label="Status">
                    <select
                      value={destination.status}
                      onChange={(e) => updateDestination(index, { status: e.target.value })}
                    >
                      <option value="unlocked">Unlocked</option>
                      <option value="soon">Coming soon</option>
                    </select>
                  </Field>
                  <Field label="Code">
                    <input
                      value={destination.code}
                      onChange={(e) => updateDestination(index, { code: e.target.value })}
                    />
                  </Field>
                </div>
                <button
                  className="remove-button"
                  onClick={() =>
                    set({
                      ...content,
                      destinations: content.destinations.filter((_, i) => i !== index),
                    })
                  }
                >
                  Remove destination
                </button>
              </div>
            ))}
            <button
              className="secondary full"
              onClick={() =>
                set({
                  ...content,
                  destinations: [
                    ...content.destinations,
                    {
                      province: "New province",
                      place: "New destination",
                      status: "soon",
                      code: "XX",
                      x: 50,
                      y: 50,
                    },
                  ],
                })
              }
            >
              + Add destination
            </button>
          </article>
        </section>
      )}

      {tab === "settings" && (
        <section className="editor-section">
          <article className="editor-card">
            <div className="editor-card-head">
              <strong>App text</strong>
            </div>
            <Field label="App name">
              <input
                value={content.settings.appName}
                onChange={(e) => patchSettings({ appName: e.target.value })}
              />
            </Field>
            <Field label="Initials">
              <input
                value={content.settings.initials}
                onChange={(e) => patchSettings({ initials: e.target.value })}
              />
            </Field>
            <Field label="Eyebrow / kicker">
              <input
                value={content.settings.kicker}
                onChange={(e) => patchSettings({ kicker: e.target.value })}
              />
            </Field>
            <Field label="Location">
              <input
                value={content.settings.location}
                onChange={(e) => patchSettings({ location: e.target.value })}
              />
            </Field>
            <Field label="Hero headline" hint="Use Enter for a line break.">
              <textarea
                rows={2}
                value={content.settings.heroTitle}
                onChange={(e) => patchSettings({ heroTitle: e.target.value })}
              />
            </Field>
            <Field label="Hero description">
              <textarea
                rows={2}
                value={content.settings.heroText}
                onChange={(e) => patchSettings({ heroText: e.target.value })}
              />
            </Field>
            <Field label="Explore section title">
              <input
                value={content.settings.introTitle}
                onChange={(e) => patchSettings({ introTitle: e.target.value })}
              />
            </Field>
            <Field label="Explore section subtitle">
              <input
                value={content.settings.introSubtitle}
                onChange={(e) => patchSettings({ introSubtitle: e.target.value })}
              />
            </Field>
            <Field label="Quiz title">
              <input
                value={content.settings.quizTitle}
                onChange={(e) => patchSettings({ quizTitle: e.target.value })}
              />
            </Field>
            <Field label="Quiz intro / locked message">
              <textarea
                rows={2}
                value={content.settings.quizIntro}
                onChange={(e) => patchSettings({ quizIntro: e.target.value })}
              />
            </Field>
          </article>
          <article className="editor-card">
            <div className="editor-card-head">
              <strong>Quiz behavior</strong>
            </div>
            <div className="editor-row">
              <Field label="Questions per quiz" hint="0 uses all questions.">
                <input
                  type="number"
                  min={0}
                  value={content.settings.questionsPerQuiz}
                  onChange={(e) => patchSettings({ questionsPerQuiz: Number(e.target.value) })}
                />
              </Field>
              <Field label="Passing percent">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={content.settings.passingPercent}
                  onChange={(e) => patchSettings({ passingPercent: Number(e.target.value) })}
                />
              </Field>
            </div>
            <label className="editor-check">
              <input
                type="checkbox"
                checked={content.settings.shuffleQuestions}
                onChange={(e) => patchSettings({ shuffleQuestions: e.target.checked })}
              />{" "}
              Shuffle question order
            </label>
            <label className="editor-check">
              <input
                type="checkbox"
                checked={content.settings.shuffleChoices}
                onChange={(e) => patchSettings({ shuffleChoices: e.target.checked })}
              />{" "}
              Shuffle answer choices
            </label>
            <label className="editor-check">
              <input
                type="checkbox"
                checked={content.settings.requireTour}
                onChange={(e) => patchSettings({ requireTour: e.target.checked })}
              />{" "}
              Require the 360° tour before the quiz
            </label>
          </article>
        </section>
      )}

      <section className="editor-section editor-tools">
        <div className="editor-row">
          <button className="secondary" onClick={download}>
            Export JSON
          </button>
          <button className="secondary" onClick={() => fileRef.current?.click()}>
            Import JSON
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={onImport}
        />
        <button className="danger full" onClick={() => setConfirmReset(true)}>
          Reset to original content
        </button>
      </section>

      {confirmReset && (
        <div className="modal-backdrop">
          <div className="confirm-dialog">
            <h2>Reset all content?</h2>
            <p>
              Your edited questions, texts, and settings on this device will be replaced with the
              original tour content.
            </p>
            <button
              className="danger full"
              onClick={() => {
                resetContent();
                setConfirmReset(false);
                notify("Original content restored.");
              }}
            >
              Yes, reset content
            </button>
            <button className="text-button" onClick={() => setConfirmReset(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
