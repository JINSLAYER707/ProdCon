import { useEffect, useMemo, useRef, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5006";

const interviewTypes = [
  {
    id: "product_sense",
    label: "Product Sense",
    icon: "PS",
    description: "Design products, identify user needs, and define success metrics."
  },
  {
    id: "product_strategy",
    label: "Product Strategy",
    icon: "ST",
    description: "Market positioning, competitive analysis, and growth planning."
  },
  {
    id: "product_execution",
    label: "Product Execution",
    icon: "EX",
    description: "Metrics analysis, debugging, launch readiness, and iteration."
  }
];

const difficulties = [
  { id: "EASY", label: "Easy", className: "easy" },
  { id: "MEDIUM", label: "Medium", className: "medium" },
  { id: "HARD", label: "Hard", className: "hard" }
];

const stageLabels = {
  problem_discovery: "Problem Discovery",
  solution_exploration: "Solution Exploration",
  tradeoff_analysis: "Tradeoff Analysis",
  final_recommendation: "Final Recommendation"
};

const stageProgress = {
  problem_discovery: 18,
  solution_exploration: 42,
  tradeoff_analysis: 68,
  final_recommendation: 90
};

const dimensionLabels = {
  productThinking: "Product Thinking",
  metricsThinking: "Metrics Thinking",
  prioritization: "Prioritization",
  tradeoffAnalysis: "Tradeoff Analysis",
  communicationClarity: "Communication",
  userEmpathy: "User Empathy"
};

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function labelForType(id) {
  return interviewTypes.find((type) => type.id === id)?.label || id;
}

function labelForDifficulty(id) {
  return difficulties.find((difficulty) => difficulty.id === id)?.label || id;
}

function getInitials(value = "") {
  const words = value.replace(/[^a-zA-Z ]/g, " ").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "PM";
  return words.slice(0, 2).map((word) => word[0]).join("").toUpperCase();
}

function speakText(text, role = "") {
  if (!text) return;
  // Some browsers (Chrome) initially return an empty voices list.
  // If voices aren't loaded yet, wait for the event and retry.
  if (speechSynthesis.getVoices().length === 0) {
    speechSynthesis.onvoiceschanged = () => {
      speakText(text, role);
    };
    return;
  }

  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  const voices = speechSynthesis.getVoices();

  const voiceMap = {
    CEO: 0,
    Designer: 1,
    Engineer: 2,
    "Finance Head": 3,
    "Product Lead": 4
  };

  const index = voiceMap[role];

  if (typeof index === "number" && voices[index]) {
    utterance.voice = voices[index];
  }

  utterance.rate = 1;
  utterance.pitch = 1;

  utterance.onstart = () => {
    try {
      ttsEvents.dispatchEvent(new Event("start"));
    } catch (e) {}
  };

  utterance.onend = () => {
    try {
      ttsEvents.dispatchEvent(new Event("end"));
    } catch (e) {}
  };

  utterance.onpause = () => {
    try {
      ttsEvents.dispatchEvent(new Event("pause"));
    } catch (e) {}
  };

  utterance.onresume = () => {
    try {
      ttsEvents.dispatchEvent(new Event("resume"));
    } catch (e) {}
  };

  utterance.onerror = () => {
    try {
      ttsEvents.dispatchEvent(new Event("end"));
    } catch (e) {}
  };

  speechSynthesis.speak(utterance);
}

// Simple event target to let React components track TTS state.
const ttsEvents = new EventTarget();

function pauseSpeech() {
  try {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      ttsEvents.dispatchEvent(new Event("pause"));
    }
  } catch (e) {}
}

function resumeSpeech() {
  try {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      ttsEvents.dispatchEvent(new Event("resume"));
    }
  } catch (e) {}
}

function stopSpeech() {
  try {
    speechSynthesis.cancel();
  } catch (e) {}
  ttsEvents.dispatchEvent(new Event("end"));
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

function normalizeTotalScore(scores = {}) {
  const vals = Object.values(scores).map(Number).filter(Number.isFinite);
  if (!vals.length) return 0;
  return Math.round(vals.reduce((sum, value) => sum + value, 0) * (100 / (vals.length * 10)));
}

function gradeFromScore(score) {
  if (score >= 85) return "Senior PM";
  if (score >= 70) return "Mid-Level PM";
  if (score >= 50) return "Junior PM";
  return "Aspiring PM";
}

function isEvaluation(data) {
  return Boolean(data && (data.scores || data.aiFeedback || data.strengths || data.weaknesses) && !data.followup);
}

function App() {
  const [screen, setScreen] = useState(() => (localStorage.getItem("prodcon-token") ? "home" : "auth"));
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ username: "", email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem("prodcon-token") || "");
  const [user, setUser] = useState(() => readJson("prodcon-user", null));

  const [selectedType, setSelectedType] = useState("product_sense");
  const [selectedDifficulty, setSelectedDifficulty] = useState("EASY");
  const [setupError, setSetupError] = useState("");
  const [setupLoading, setSetupLoading] = useState(false);

  const [sessionId, setSessionId] = useState("");
  const [scenario, setScenario] = useState(null);
  const [stakeholder, setStakeholder] = useState(null);
  const [stage, setStage] = useState("problem_discovery");
  const [messages, setMessages] = useState([]);
  const [answer, setAnswer] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [history, setHistory] = useState(() => readJson("prodcon-history", []));

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState(null);

  const chatEndRef = useRef(null);
  const authed = Boolean(token);

  const stats = useMemo(() => {
    const scores = history.map((item) => item.score).filter((score) => typeof score === "number");
    return {
      sessions: history.length,
      avg: scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : "-",
      best: scores.length ? Math.max(...scores) : "-"
    };
  }, [history]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, chatLoading]);

  useEffect(() => {
    const onStart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };
    const onEnd = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    const onPause = () => setIsPaused(true);
    const onResume = () => setIsPaused(false);

    ttsEvents.addEventListener("start", onStart);
    ttsEvents.addEventListener("end", onEnd);
    ttsEvents.addEventListener("pause", onPause);
    ttsEvents.addEventListener("resume", onResume);

    return () => {
      ttsEvents.removeEventListener("start", onStart);
      ttsEvents.removeEventListener("end", onEnd);
      ttsEvents.removeEventListener("pause", onPause);
      ttsEvents.removeEventListener("resume", onResume);
    };
  }, []);

  async function api(path, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {})
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers
    });

    const text = await response.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    if (!response.ok) {
      throw new Error(data?.message || `Request failed with ${response.status}`);
    }

    return data;
  }

  async function handleAuth(event) {
    event.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    const body = {
      email: authForm.email.trim(),
      password: authForm.password
    };

    if (authMode === "signup") {
      body.username = authForm.username.trim();
    }

    try {
      const data = await api(`/auth/${authMode}`, {
        method: "POST",
        body: JSON.stringify(body)
      });
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("prodcon-token", data.token);
      writeJson("prodcon-user", data.user);
      setAuthForm({ username: "", email: "", password: "" });
      setScreen("home");
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  }

  function logout() {
    setToken("");
    setUser(null);
    setSessionId("");
    setMessages([]);
    setFeedback(null);
    localStorage.removeItem("prodcon-token");
    localStorage.removeItem("prodcon-user");
    setScreen("auth");
  }

  async function startInterview() {
    setSetupError("");
    setSetupLoading(true);
    setFeedback(null);
    setMessages([]);
    setStage("problem_discovery");
    setStakeholder(null);

    try {
      const data = await api(`/session/${selectedType}/${selectedDifficulty}`, { method: "GET" });
      const nextScenario = data.scenario || {};
      const firstStakeholder = nextScenario.stakeholders?.[0] || { role: "Product Lead", personality: "Neutral" };

      setSessionId(data.sessionId);
      setScenario(nextScenario);
      setStakeholder(firstStakeholder);
      setMessages([
        {
          id: crypto.randomUUID(),
          kind: "stakeholder",
          stakeholder: firstStakeholder,
          text: openingPrompt(nextScenario)
        }
      ]);
      setScreen("interview");
    } catch (error) {
      setSetupError(error.message);
    } finally {
      setSetupLoading(false);
    }
  }

  function openingPrompt(nextScenario) {
    const problem = nextScenario.problemStatement || "this product challenge";
    return `Let's begin. Your scenario: ${problem}\n\nStart by framing the user problem and the first questions you would ask before proposing a solution.`;
  }

  async function sendAnswer(event, finishing = false) {
    event?.preventDefault();
    const currentAnswer = answer.trim() || (finishing ? "I am ready to conclude. Please evaluate my final recommendation based on the conversation so far." : "");
    if (!sessionId || !currentAnswer || chatLoading) return;

    setAnswer("");
    setChatLoading(true);
    setMessages((items) => [
      ...items,
      {
        id: crypto.randomUUID(),
        kind: "user",
        text: currentAnswer
      }
    ]);

    try {
      const data = await api(`/session/respond/${sessionId}`, {
        method: "POST",
        body: JSON.stringify({ userAnswer: currentAnswer })
      });

      if (isEvaluation(data)) {
        setFeedback(data);
        saveCompletedSession(data);
        setScreen("feedback");
        return;
      }

      const stake = data.stake || {};
      const followup = data.followup || {};
      const nextStakeholder = stake.stakeholder
        ? { role: stake.stakeholder, personality: stake.personality || "" }
        : stakeholder || { role: "Stakeholder", personality: "" };
      const nextStage = data.stage?.stage || followup.stage || stage;
      const statement = followup.statement || followup.question || "Tell me more about your reasoning.";

      setStakeholder(nextStakeholder);
      setStage(nextStage);
      setMessages((items) => [
        ...items,
        {
          id: crypto.randomUUID(),
          kind: "stakeholder",
          stakeholder: nextStakeholder,
          text: statement
        },
        ...(data["forced-transition"]
          ? [{
              id: crypto.randomUUID(),
              kind: "system",
              text: "Stage limit reached. The backend is nudging this interview toward the next phase."
            }]
          : [])
      ]);
    } catch (error) {
      setMessages((items) => [
        ...items,
        {
          id: crypto.randomUUID(),
          kind: "system",
          text: `I could not send that to the backend: ${error.message}`
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  function saveCompletedSession(evaluation) {
    const score = normalizeTotalScore(evaluation.scores);
    const item = {
      type: labelForType(selectedType),
      difficulty: labelForDifficulty(selectedDifficulty),
      score,
      date: new Date().toISOString(),
      company: scenario?.company || "Scenario",
      industry: scenario?.industry || "",
      grade: gradeFromScore(score)
    };
    const nextHistory = [...history, item];
    setHistory(nextHistory);
    writeJson("prodcon-history", nextHistory);
  }

  return (
    <>
      <div id="app">
        {screen === "auth" && (
          <AuthScreen
            mode={authMode}
            form={authForm}
            error={authError}
            loading={authLoading}
            onModeChange={setAuthMode}
            onFormChange={setAuthForm}
            onSubmit={handleAuth}
          />
        )}

        {screen === "home" && (
          <HomeScreen
            user={user}
            stats={stats}
            onLogout={logout}
            onStart={() => setScreen("setup")}
            onHistory={() => setScreen("history")}
          />
        )}

        {screen === "setup" && (
          <SetupScreen
            selectedType={selectedType}
            selectedDifficulty={selectedDifficulty}
            error={setupError}
            loading={setupLoading}
            onBack={() => setScreen("home")}
            onTypeChange={setSelectedType}
            onDifficultyChange={setSelectedDifficulty}
            onStart={startInterview}
          />
        )}

        {screen === "interview" && (
          <InterviewScreen
            selectedType={selectedType}
            selectedDifficulty={selectedDifficulty}
            scenario={scenario}
            stakeholder={stakeholder}
            stage={stage}
            messages={messages}
            answer={answer}
            loading={chatLoading}
            chatEndRef={chatEndRef}
            onAnswerChange={setAnswer}
            onSubmit={sendAnswer}
            onFinish={() => sendAnswer(null, true)}
            isSpeaking={isSpeaking}
            isPaused={isPaused}
            onGlobalPlay={() => {
              const latest = messages[messages.length - 1];
              if (latest && latest.kind === "stakeholder") {
                setPlayingMessageId(latest.id);
                speakText(latest.text, latest.stakeholder?.role);
              }
            }}
            onGlobalPause={() => pauseSpeech()}
            onGlobalResume={() => resumeSpeech()}
            onGlobalStop={() => stopSpeech()}
            playMessage={(id, text, role) => {
              setPlayingMessageId(id);
              speakText(text, role);
            }}
            playingMessageId={playingMessageId}
          />
        )}

        {screen === "feedback" && feedback && (
          <FeedbackScreen
            feedback={feedback}
            selectedType={selectedType}
            selectedDifficulty={selectedDifficulty}
            onHome={() => setScreen("home")}
            onPracticeAgain={() => setScreen("setup")}
          />
        )}

        {screen === "history" && (
          <HistoryScreen history={history} onBack={() => setScreen("home")} />
        )}
      </div>

      {authed && screen !== "auth" && (
        <BottomNav screen={screen} onNavigate={setScreen} />
      )}
    </>
  );
}

function AuthScreen({ mode, form, error, loading, onModeChange, onFormChange, onSubmit }) {
  return (
    <section className="screen active">
      <div className="hero auth-hero">
        <div className="hero-badge"><span /> AI-Powered PM Interview Simulator</div>
        <h1>Practice like a<br /><em>real PM</em>.</h1>
        <p>Adaptive stakeholder roleplays, real-world scenarios, and structured feedback.</p>
      </div>

      <div className="auth-shell">
        <div className="auth-card">
          <div className="auth-tabs" role="tablist">
            <button className={`auth-tab ${mode === "login" ? "active" : ""}`} type="button" onClick={() => onModeChange("login")}>Login</button>
            <button className={`auth-tab ${mode === "signup" ? "active" : ""}`} type="button" onClick={() => onModeChange("signup")}>Sign up</button>
          </div>

          <form onSubmit={onSubmit}>
            {mode === "signup" && (
              <label className="field">
                <span>Name</span>
                <input
                  value={form.username}
                  onChange={(event) => onFormChange({ ...form, username: event.target.value })}
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  required
                />
              </label>
            )}

            <label className="field">
              <span>Email</span>
              <input
                value={form.email}
                onChange={(event) => onFormChange({ ...form, email: event.target.value })}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="field">
              <span>Password</span>
              <input
                value={form.password}
                onChange={(event) => onFormChange({ ...form, password: event.target.value })}
                type="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                placeholder="Minimum 6 characters"
                required
              />
            </label>

            {error && <div className="notice error">{error}</div>}

            <button className="btn btn-primary full" type="submit" disabled={loading}>
              {loading ? (mode === "signup" ? "Creating..." : "Logging in...") : (mode === "signup" ? "Create Account" : "Login")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function HomeScreen({ user, stats, onLogout, onStart, onHistory }) {
  return (
    <section className="screen active">
      <div className="topbar">
        <div>
          <div className="brand">ProdCon</div>
          <div className="muted small">{user ? `${user.name || user.email} · ${user.points || 0} points` : "Ready for practice"}</div>
        </div>
        <button className="btn btn-secondary btn-sm" type="button" onClick={onLogout}>Logout</button>
      </div>

      <div className="hero">
        <div className="hero-badge"><span /> Interview Simulator</div>
        <h1>Practice like a<br /><em>real PM</em>.</h1>
        <p>Choose a PM interview type, answer stakeholder follow-ups, and get scored across core PM competencies.</p>
        <div className="btn-row">
          <button className="btn btn-primary" type="button" onClick={onStart}>Start Interview</button>
          <button className="btn btn-secondary" type="button" onClick={onHistory}>My History</button>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat"><div className="stat-num">{stats.sessions}</div><div className="stat-lbl">Sessions</div></div>
        <div className="stat"><div className="stat-num">{stats.avg}</div><div className="stat-lbl">Avg Score</div></div>
        <div className="stat"><div className="stat-num">{stats.best}</div><div className="stat-lbl">Best Score</div></div>
      </div>
    </section>
  );
}

function SetupScreen({ selectedType, selectedDifficulty, error, loading, onBack, onTypeChange, onDifficultyChange, onStart }) {
  return (
    <section className="screen active">
      <div className="panel">
        <button className="back-btn" type="button" onClick={onBack}>Back</button>
        <div className="section-header"><h2>Choose interview type</h2></div>

        <div className="grid-3">
          {interviewTypes.map((type) => (
            <button
              key={type.id}
              className={`option-card ${selectedType === type.id ? "selected" : ""}`}
              type="button"
              onClick={() => onTypeChange(type.id)}
            >
              <span className="check">✓</span>
              <div className="option-icon">{type.icon}</div>
              <h3>{type.label}</h3>
              <p>{type.description}</p>
            </button>
          ))}
        </div>

        <div className="section-header"><h2>Difficulty</h2></div>
        <div className="diff-row">
          {difficulties.map((difficulty) => (
            <button
              key={difficulty.id}
              className={`diff-pill ${difficulty.className} ${selectedDifficulty === difficulty.id ? "selected" : ""}`}
              type="button"
              onClick={() => onDifficultyChange(difficulty.id)}
            >
              {difficulty.label}
            </button>
          ))}
        </div>

        <button className="btn btn-primary full large" type="button" onClick={onStart} disabled={loading}>
          {loading ? "Generating..." : "Generate Interview"}
        </button>
        {error && <div className="notice error">{error}</div>}
      </div>
    </section>
  );
}

function InterviewScreen({
  selectedType,
  selectedDifficulty,
  scenario,
  stakeholder,
  stage,
  messages,
  answer,
  loading,
  chatEndRef,
  onAnswerChange,
  onSubmit,
  onFinish,
  isSpeaking,
  isPaused,
  onGlobalPlay,
  onGlobalPause,
  onGlobalResume,
  onGlobalStop,
  playMessage,
  playingMessageId
}) {

  const [isListening, setIsListening] =
    useState(false);

  const [autoPlay, setAutoPlay] =
    useState(true);

  const recognitionRef = useRef(null);
  const stakeholders = scenario?.stakeholders?.length ? scenario.stakeholders : [stakeholder || { role: "Product Lead", personality: "Neutral" }];
  const details = [
    scenario?.company && ["Company", scenario.company],
    scenario?.industry && ["Industry", scenario.industry],
    ...(scenario?.constraints || []).slice(0, 3).map((constraint) => ["Constraint", constraint])
  ].filter(Boolean);

  function startListening() {

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert(
      "Voice input works best in Chrome."
    );
    return;
  }

  const recognition =
    new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.continuous = true;
  recognition.interimResults = false;

  recognitionRef.current =
    recognition;

  recognition.onresult = (event) => {

    let transcript = "";

    for (
      let i = event.resultIndex;
      i < event.results.length;
      i++
    ) {
      transcript +=
        event.results[i][0].transcript +
        " ";
    }

    // Use functional setter to avoid stale closure over `answer`.
    onAnswerChange((prev) => prev + (prev ? " " : "") + transcript);
  };

  recognition.onend = () => {
    setIsListening(false);
  };

  setIsListening(true);

  recognition.start();
}

function stopListening() {

  if (recognitionRef.current) {
    recognitionRef.current.stop();
  }

  setIsListening(false);
}

useEffect(() => {

  if (!autoPlay) return;

  const latest =
    messages[messages.length - 1];

  if (
    latest &&
    latest.kind === "stakeholder"
  ) {
    speakText(
      latest.text,
      latest.stakeholder?.role
    );
  }

}, [messages, autoPlay]);

useEffect(() => {
  return () => {
    // Stop any ongoing speech and recognition when leaving the interview.
    try {
      speechSynthesis.cancel();
    } catch (e) {}

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  };
}, []);

  return (
    <section className="screen active">
      <header className="interview-header">
        <div className="ih-left">
          <div className="brand small-brand">ProdCon</div>
          <div className="ih-sep" />
          <div className="ih-meta">{labelForType(selectedType)} · {labelForDifficulty(selectedDifficulty)}</div>
        </div>
        <div className="ih-right">
          <label
  style={{
    display: "flex",
    gap: "6px",
    alignItems: "center",
    fontSize: "12px"
  }}
>
  <input
    type="checkbox"
    checked={autoPlay}
    onChange={() =>
      setAutoPlay(!autoPlay)
    }
  />
  Auto Voice
</label>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: 12 }}>
            {!isSpeaking && (
              <button  type="button" onClick={onGlobalPlay} disabled={loading}>
                🔉 Play
              </button>
            )}
            {isSpeaking && !isPaused && (
              <button  type="button" onClick={onGlobalPause}>
                ⏸️ Pause
              </button>
            )}
            {isSpeaking && isPaused && (
              <button type="button" onClick={onGlobalResume}>
                ▶️ Resume
              </button>
            )}
            {isSpeaking && (
              <button  type="button" onClick={onGlobalStop}>
                ⏹️ Stop
              </button>
            )}
          </div>
          <div className={`stage-badge ${stage}`}>{stageLabels[stage] || stage.replaceAll("_", " ")}</div>
          <button className="btn btn-sm btn-secondary" type="button" onClick={onFinish} disabled={loading}>Finish</button>
        </div>
      </header>

      <div className="progress-bar"><div className="progress-fill" style={{ width: `${stageProgress[stage] || 25}%` }} /></div>

      <article className="scenario-card">
        <div className="scenario-tag">Scenario</div>
        <h3>{scenario?.problemStatement || "Practice scenario"}</h3>
        <p>{scenario?.businessContext || `${scenario?.company || "Company"} · ${scenario?.industry || "Industry"}`}</p>
        <div className="scenario-details">
          {details.map(([label, value], index) => (
            <span className="tag" key={`${label}-${index}`}>{label}: {String(value)}</span>
          ))}
        </div>
      </article>

      <div className="stakeholders-row">
        {stakeholders.map((item, index) => (
          <div className={`stakeholder ${item?.role === stakeholder?.role ? "active" : ""}`} key={`${item?.role || "stake"}-${index}`}>
            <div className="avatar">{getInitials(item?.role || "Stakeholder")}</div>
            <div>{item?.role || "Stakeholder"}</div>
          </div>
        ))}
      </div>

      <main className="chat-area">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isSpeaking={isSpeaking}
            isPaused={isPaused}
            playingMessageId={playingMessageId}
            onPlay={() => playMessage?.(message.id, message.text, message.stakeholder?.role)}
            onPause={() => pauseSpeech()}
            onResume={() => resumeSpeech()}
            onStop={() => {
              stopSpeech();
              setPlayingMessageId(null);
            }}
          />
        ))}
        {loading && <TypingMessage stakeholder={stakeholder} />}
        <div ref={chatEndRef} />
      </main>

      <footer className="input-area">
        <form className="input-row" onSubmit={onSubmit}>
          <textarea
            className="chat-input"
            rows="1"
            placeholder="Share your thinking..."
            value={answer}
            onChange={(event) => onAnswerChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                onSubmit(event);
              }
            }}
            disabled={loading}
          />
          <button className="send-btn" type="submit" aria-label="Send answer" disabled={loading || !answer.trim()}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
          </button>
        </form>
        <div
  style={{
    display: "flex",
    gap: "8px",
    marginTop: "8px"
  }}
>
  {!isListening ? (
    <button
      type="button"
      className="btn btn-secondary btn-sm"
      onClick={startListening}
      disabled={loading}
    >
      🎤 Speak
    </button>
  ) : (
    <button
      type="button"
      className="btn btn-secondary btn-sm"
      onClick={stopListening}
      disabled={loading}
    >
      ⏹ Stop
    </button>
  )}
  {isListening && (
    <div style={{ alignSelf: "center", marginLeft: 8, fontSize: 13 }}>
      🎤 Recording...
    </div>
  )}
</div>
      </footer>
    </section>
  );
}

function ChatMessage({ message, isSpeaking, isPaused, playingMessageId, onPlay, onPause, onResume, onStop }) {
  const isUser = message.kind === "user";
  const isSystem = message.kind === "system";
  const name = isUser ? "You" : isSystem ? "System" : message.stakeholder?.role || "Stakeholder";
  const sub = isUser || isSystem ? "" : message.stakeholder?.personality || "";
  const initials = isUser ? "You" : isSystem ? "!" : getInitials(name);
  const isThisPlaying = playingMessageId === message.id && isSpeaking;

  return (
    <div className={`msg ${isUser ? "user" : ""}`}>
      <div className="avatar">{initials}</div>
      <div className="msg-body">
        <div className="msg-name">{name}{sub ? ` · ${sub}` : ""}</div>
        <div className="msg-text">
  {message.text}

  {!isUser && !isSystem && (
    <span style={{ marginLeft: 10 }}>
      {!isThisPlaying && (
        <button type="button" className="speak-btn" onClick={onPlay} style={{ cursor: "pointer" }}>🔊</button>
      )}
      {isThisPlaying && !isPaused && (
        <button type="button" className="speak-btn" onClick={onPause} style={{ cursor: "pointer" }}>⏸</button>
      )}
      {isThisPlaying && isPaused && (
        <button type="button" className="speak-btn" onClick={onResume} style={{ cursor: "pointer" }}>▶</button>
      )}
      {isThisPlaying && (
        <button type="button" className="speak-btn" onClick={onStop} style={{ cursor: "pointer" }}>⏹</button>
      )}
    </span>
  )}
</div>
      </div>
    </div>
  );
}

function TypingMessage({ stakeholder }) {
  const role = stakeholder?.role || "Stakeholder";
  return (
    <div className="msg">
      <div className="avatar">{getInitials(role)}</div>
      <div className="msg-body">
        <div className="msg-name">{role}</div>
        <div className="msg-text"><div className="typing"><span /><span /><span /></div></div>
      </div>
    </div>
  );
}

function FeedbackScreen({ feedback, selectedType, selectedDifficulty, onHome, onPracticeAgain }) {
  const total = normalizeTotalScore(feedback.scores);
  const grade = gradeFromScore(total);

  return (
    <section className="screen active">
      <div className="panel">
        <button className="back-btn" type="button" onClick={onHome}>Home</button>
        <div className="fb-header">
          <div className="fb-score">{total}</div>
          <div className="fb-score-sub">Overall PM Competency Score</div>
          <div className="pill-row center">
            <span className="tag">{grade}</span>
            <span className="tag">{labelForType(selectedType)}</span>
            <span className="tag">{labelForDifficulty(selectedDifficulty)}</span>
          </div>
        </div>

        <div className="score-grid">
          {Object.entries(feedback.scores || {}).map(([key, value]) => {
            const score = Number(value || 0);
            const percent = Math.max(0, Math.min(score * 10, 100));
            return (
              <div className="score-card" key={key}>
                <div className="sc-label">{dimensionLabels[key] || key}</div>
                <div className="sc-bar-bg">
                  <div
                    className="sc-bar-fill"
                    style={{
                      width: `${percent}%`,
                      background: score >= 7 ? "var(--green)" : score >= 5 ? "var(--amber)" : "var(--red)"
                    }}
                  />
                </div>
                <div className="sc-val">{score}/10</div>
              </div>
            );
          })}
        </div>

        <div className="divider" />
        <FeedbackList title="Strengths" items={feedback.strengths} className="strength" empty="No specific strengths returned by the backend." />
        <FeedbackList title="Areas to improve" items={feedback.weaknesses} className="improve" empty="No specific improvement areas returned by the backend." />

        {feedback.aiFeedback && (
          <div className="fb-section">
            <h3>Summary</h3>
            <div className="summary-box">{feedback.aiFeedback}</div>
          </div>
        )}

        <button className="btn btn-primary full" type="button" onClick={onPracticeAgain}>Practice Again</button>
      </div>
    </section>
  );
}

function FeedbackList({ title, items = [], className, empty }) {
  return (
    <div className="fb-section">
      <h3>{title}</h3>
      <div className="fb-list">
        {items.length ? items.map((item, index) => (
          <div className={`fb-item ${className}`} key={`${className}-${index}`}>{item}</div>
        )) : <div className={`fb-item ${className}`}>{empty}</div>}
      </div>
    </div>
  );
}

function HistoryScreen({ history, onBack }) {
  return (
    <section className="screen active">
      <div className="panel">
        <button className="back-btn" type="button" onClick={onBack}>Home</button>
        <div className="section-header"><h2>Interview history</h2></div>

        <div className="history-list">
          {history.length ? history.slice().reverse().map((item, index) => (
            <div className="hist-item" key={`${item.date}-${index}`}>
              <div>
                <div className="hi-title">{item.type} · {item.company}</div>
                <div className="hi-meta">{item.difficulty} · {formatDate(item.date)}{item.industry ? ` · ${item.industry}` : ""}</div>
              </div>
              <div className="hi-score" style={{ color: item.score >= 70 ? "var(--green)" : item.score >= 50 ? "var(--amber)" : "var(--red)" }}>{item.score}</div>
            </div>
          )) : (
            <div className="empty-state"><p>No interviews yet.<br />Start practicing to see your history.</p></div>
          )}
        </div>
      </div>
    </section>
  );
}

function BottomNav({ screen, onNavigate }) {
  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>
    },
    {
      id: "setup",
      label: "Practice",
      icon: <><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></>
    },
    {
      id: "history",
      label: "History",
      icon: <><path d="M3 3v18h18" /><path d="m7 15 4-4 3 3 5-7" /></>
    }
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${screen === item.id ? "active" : ""}`}
          type="button"
          onClick={() => onNavigate(item.id)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">{item.icon}</svg>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default App;
