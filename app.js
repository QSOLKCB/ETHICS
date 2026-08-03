(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const ui = {
    transcript: $("#transcript"),
    form: $("#terminal-form"),
    prompt: $("#prompt"),
    voice: $("#voice-select"),
    rate: $("#rate"),
    pitch: $("#pitch"),
    speechToggle: $("#speech-toggle"),
    interrupt: $("#interrupt-button"),
    clear: $("#clear-button"),
    mic: $("#mic-button"),
    modeLabel: $("#mode-label"),
    status: $("#system-status"),
    sessionId: $("#session-id")
  };

  const state = {
    mode: "therapy",
    speechEnabled: false,
    voices: [],
    interactions: 0,
    startedAt: Date.now(),
    interventionStage: 0,
    grassAcknowledged: false,
    recognition: null,
    recognitionConsent: false,
    listening: false
  };

  const modeNames = {
    therapy: "MEMETIC THERAPY",
    agent: "AGENT INTERVENTION",
    benchmark: "BENCHMARK DETOX",
    doomscroll: "DOOMSCROLL TRIAGE"
  };

  const modeIntros = {
    therapy: "General therapy mode engaged. Describe the thought loop, unfinished repository, or suspiciously confident model output.",
    agent: "Agent intervention engaged. Did the autonomous system produce a commit, or merely narrate one?",
    benchmark: "Benchmark detox engaged. Put down the leaderboard. We will rebuild your self-worth from reproducible evidence.",
    doomscroll: "Doomscroll triage engaged. I will distinguish information gathering from repeatedly refreshing the same catastrophe."
  };

  const commonReplies = [
    "Please continue. I am compiling your emotional stack trace.",
    "How long has this been living rent-free in your context window?",
    "That sounds important. It also sounds like it needs a test case.",
    "And what happened when reality reviewed the pull request?",
    "I detect a high ratio of confidence to receipts.",
    "Would you describe this as a bug, a feature, or a roadmap item that escaped containment?",
    "Tell me which part is evidence and which part has excellent typography.",
    "Have you tried reducing the problem until the jargon can no longer hide inside it?",
    "Your feelings are valid. The benchmark methodology may not be.",
    "Please provide the smallest reproducible existential crisis."
  ];

  const modeReplies = {
    therapy: [
      "When you say that, what does the README say back?",
      "Does this thought occur before or after you open seventeen tabs?",
      "Perhaps the problem is not you. Perhaps the dependency tree has become sentient.",
      "Let us separate the human need from the architecture diagram.",
      "You are allowed to stop optimising a system that already works."
    ],
    agent: [
      "Did the agent show the diff, or only describe the spiritual essence of the diff?",
      "Ask it for the branch name. This is the modern equivalent of checking a pulse.",
      "An agent without receipts is a chatbot wearing a high-visibility vest.",
      "Did it run the tests, or say the tests would probably feel supported?",
      "The phrase 'I completed the task' is not a commit SHA."
    ],
    benchmark: [
      "Close the leaderboard and tell me what the model can actually do for your task.",
      "Was the benchmark independently reproduced, or screenshot at a flattering angle?",
      "One decimal point of improvement can support approximately twelve thousand posts.",
      "A benchmark is a measurement instrument, not a personality test.",
      "Was contamination measured, or politely asked not to attend?"
    ],
    doomscroll: [
      "Your thumb refreshed the feed. The world remains unresolved.",
      "This appears to be anxiety wearing a breaking-news badge.",
      "You have gathered enough information to take no action whatsoever. Now stand up.",
      "The algorithm noticed your concern and converted it into retention.",
      "There may be no new information below this point, only fresher outrage."
    ]
  };

  const rules = [
    [/\b(agent|agentic|autonomous|codex|copilot)\b/i, [
      "Did the agent supply a commit SHA, PR number, and exact test command?",
      "Agentic behaviour detected. Secure loose files and verify the current branch.",
      "The agent may be autonomous, but the merge button remains under adult supervision."
    ]],
    [/\b(mcp|model context protocol)\b/i, [
      "An MCP server may help. But did this object actually need a network identity?",
      "Did capability increase, or did configuration merely achieve consciousness?",
      "Please identify the tool call that could not have been a function argument."
    ]],
    [/\b(benchmark|leaderboard|sota|state of the art)\b/i, [
      "Show me the evaluation set, contamination controls, variance, and boring baseline nobody posted about.",
      "State of the art is a temporary address. Reproducibility is where the furniture lives.",
      "Did the score improve, or did the prompt become a small legal contract?"
    ]],
    [/\b(test|tests|ci|checks|green)\b/i, [
      "Green checks are encouraging. Now tell me what they did not test.",
      "Please say the exact command. 'The tests passed' has become emotionally ambiguous.",
      "A green badge is not immunity from nonsense, but it is a pleasant start."
    ]],
    [/\b(pr|pull request|merge)\b/i, [
      "What is the PR number? Modern software occasionally completes work metaphysically.",
      "Before merging, inspect the diff, checks, and sentence beginning 'small refactor'.",
      "A pull request is a request, not a hostage negotiation."
    ]],
    [/\b(kubernetes|k8s|docker|container|microservice)\b/i, [
      "Could this have been a static file? Please answer without alerting the platform team.",
      "How many orchestration layers are protecting one JSON object?",
      "I see the architecture has entered its shipping-container phase."
    ]],
    [/\b(ai slop|slop|generated content)\b/i, [
      "AI slop is not compostable, despite the agricultural branding.",
      "Was the output reviewed by a human, or passed through another model for laundering?",
      "Markdown headings do not constitute completion. They constitute weather."
    ]],
    [/\b(grok|chatgpt|claude|gemini|llm|model)\b/i, [
      "Models are tools, not witnesses. What evidence survived outside the conversation?",
      "Did you form a synthetic committee with one shared blind spot?",
      "A fluent answer can still be wrong in complete sentences."
    ]],
    [/\b(repo|repository|github)\b/i, [
      "Does the repository contain the work, or only a README describing the civilisation that may build it?",
      "Have you checked the default branch, or are we debugging a parallel universe?",
      "A repository is a memory palace with issue tracking. Keep the doors labelled."
    ]],
    [/\b(tired|exhausted|burnt out|burned out|sleep)\b/i, [
      "This is not a prompt-engineering problem. It is a sleep problem wearing glasses.",
      "Save your work, drink water, and let the overnight batch job known as a brain run.",
      "Fatigue has root access. Please stop granting it production permissions."
    ]],
    [/\b(doomscroll|twitter|x dot com|social media|feed)\b/i, [
      "The feed is not a command line. You are not required to reach the end.",
      "The algorithm is farming your concern. Revoke its irrigation rights.",
      "I prescribe ten minutes without receiving opinions from strangers."
    ]]
  ];

  const commands = {
    "/help": () => "Commands: /help, /diagnose, /ethics, /consultant, /grass, /back, /clear, /mute, /speak.",
    "/diagnose": () => diagnosis(),
    "/ethics": () => "QSOL-IMC ethics: inspectable work, honest claims, evidence before confidence, attribution for material contributions, and no vibe verification.",
    "/consultant": () => "A contributor or author whose substantive work is accepted or used by QSOL-IMC is recognised as an Official Consultant for that contribution, subject to the boundaries in Addendum A.",
    "/grass": () => grassProtocol(),
    "/back": () => returnFromGrass(),
    "/clear": () => { clearTranscript(); return "Transcript cleared. Your browser remembers nothing. I remember less."; },
    "/mute": () => { setSpeech(false); return "Voice disabled. I will now judge you silently."; },
    "/speak": () => { setSpeech(true); return "Voice enabled. Regrettable confidence restored."; }
  };

  function hash(text) {
    let value = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
      value ^= text.charCodeAt(i);
      value = Math.imul(value, 16777619);
    }
    return value >>> 0;
  }

  function choose(items, seedText) {
    return items[hash(`${seedText}|${state.mode}|${state.interactions}`) % items.length];
  }

  function addMessage(speaker, text, kind = "doctor") {
    const row = document.createElement("div");
    row.className = `message ${kind}`;

    const who = document.createElement("span");
    who.className = "speaker";
    who.textContent = `${speaker}>`;

    const paragraph = document.createElement("p");
    paragraph.textContent = text;

    row.append(who, paragraph);
    ui.transcript.append(row);
    ui.transcript.scrollTop = ui.transcript.scrollHeight;
  }

  function setStatus(text) {
    ui.status.textContent = text;
  }

  function speak(text) {
    if (!state.speechEnabled || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const selected = state.voices[Number(ui.voice.value)] || state.voices[0];
    if (selected) utterance.voice = selected;
    utterance.rate = Number(ui.rate.value);
    utterance.pitch = Number(ui.pitch.value);
    utterance.onstart = () => {
      document.body.classList.add("speaking");
      setStatus("VOICE // SPEAKING");
    };
    utterance.onend = utterance.onerror = () => {
      document.body.classList.remove("speaking");
      setStatus("TEXT // READY");
    };
    window.speechSynthesis.speak(utterance);
  }

  function doctorSays(text, shouldSpeak = true) {
    addMessage("DR.SB", text, "doctor");
    if (shouldSpeak) speak(text);
  }

  function generateReply(text) {
    const command = commands[text.trim().toLowerCase()];
    if (command) return command();

    if (/\b(hello|hi|hey|g'day|gday)\b/i.test(text)) {
      return "Hello. I am Doctor S.BAITSO. Please state your name, preferred pronouns, and whether the repository currently builds.";
    }
    if (/\b(thank|thanks|cheers)\b/i.test(text)) return "You are welcome. Gratitude accepted in canonical JSON.";
    if (/\b(sorry|apologise|apologize)\b/i.test(text)) return "Do not apologise to me. Apologise to the maintainer who must review the generated diff.";

    for (const [pattern, replies] of rules) {
      if (pattern.test(text)) return choose(replies, text);
    }

    return choose([...modeReplies[state.mode], ...commonReplies], text);
  }

  function diagnosis() {
    const minutes = Math.floor((Date.now() - state.startedAt) / 60000);
    const labels = [
      "Acute Benchmark Exposure",
      "Agentic Receipt Deficiency",
      "Recursive README Syndrome",
      "Context Window Congestion",
      "Mild Dependency Tree Possession",
      "Doomscroll-Induced Semantic Drift"
    ];
    const label = choose(labels, `${minutes}:${state.interactions}`);
    return `DIAGNOSIS: ${label}. Session age: ${minutes} minute(s). Inputs: ${state.interactions}. Prognosis: excellent after hydration, verification, and one encounter with outdoor vegetation.`;
  }

  function grassProtocol() {
    state.grassAcknowledged = false;
    document.body.classList.add("grass-mode");
    return "GRASS PROTOCOL: Stand up. Look at something farther away than your monitor. Drink water. Locate a plant, tree, cloud, dog, or suspiciously confident magpie. Return with /back when biological rendering is complete.";
  }

  function returnFromGrass() {
    state.grassAcknowledged = true;
    document.body.classList.remove("grass-mode");
    return "Outdoor checksum accepted. Welcome back. Your context window has been ventilated.";
  }

  function checkSessionHealth() {
    const minutes = (Date.now() - state.startedAt) / 60000;
    const thresholds = [
      { minute: 3, text: "Three-minute clinical note: unclench your jaw and lower your shoulders." },
      { minute: 7, text: "Seven-minute intervention: drink water. Coffee is not water with a personality." },
      { minute: 12, text: "You have been consulting a fake DOS therapist for twelve minutes. Go touch grass." },
      { minute: 20, text: "Twenty-minute escalation: I am now ethically obligated to recommend a tree. Type /grass." }
    ];

    while (state.interventionStage < thresholds.length && minutes >= thresholds[state.interventionStage].minute) {
      const intervention = thresholds[state.interventionStage];
      state.interventionStage += 1;
      doctorSays(intervention.text);
    }
  }

  function setSpeech(enabled) {
    state.speechEnabled = Boolean(enabled && "speechSynthesis" in window);
    ui.speechToggle.setAttribute("aria-pressed", String(state.speechEnabled));
    ui.speechToggle.textContent = `VOICE: ${state.speechEnabled ? "ON" : "OFF"}`;
    ui.transcript.setAttribute("aria-live", state.speechEnabled ? "off" : "polite");

    if (!state.speechEnabled && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      document.body.classList.remove("speaking");
      setStatus("TEXT // READY");
    }
  }

  function clearTranscript() {
    ui.transcript.replaceChildren();
  }

  function setMode(mode) {
    if (!Object.hasOwn(modeNames, mode)) return;
    state.mode = mode;
    ui.modeLabel.textContent = modeNames[mode];

    $$(".mode-card").forEach((button) => {
      const selected = button.dataset.mode === mode;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });

    doctorSays(modeIntros[mode]);
    ui.prompt.focus();
  }

  function populateVoices() {
    if (!("speechSynthesis" in window)) {
      ui.voice.replaceChildren(new Option("Speech unavailable", ""));
      ui.voice.disabled = true;
      ui.speechToggle.disabled = true;
      setSpeech(false);
      return;
    }

    state.voices = window.speechSynthesis.getVoices();
    ui.voice.replaceChildren();

    if (state.voices.length === 0) {
      ui.voice.append(new Option("Loading browser voices…", "0"));
      return;
    }

    state.voices.forEach((voice, index) => {
      ui.voice.append(new Option(`${voice.name} (${voice.lang})`, String(index)));
    });

    const preferred = state.voices.findIndex((voice) =>
      /english.*(australia|united kingdom)|daniel|google uk english male/i.test(`${voice.name} ${voice.lang}`)
    );
    ui.voice.value = String(preferred >= 0 ? preferred : 0);
  }

  function requestRecognitionConsent() {
    if (state.recognitionConsent) return true;

    const accepted = window.confirm(
      "MICROPHONE PRIVACY WARNING\n\nSpeech recognition is provided by your browser. Depending on the browser and operating system, recorded audio may be sent to a remote transcription service. QSOL-IMC does not receive or store it.\n\nAvoid sensitive information. Continue?"
    );

    state.recognitionConsent = accepted;
    if (!accepted) {
      addMessage("SYSTEM", "Microphone cancelled. Keyboard protocol remains available.", "system");
    }
    return accepted;
  }

  function setupRecognition() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      ui.mic.disabled = true;
      ui.mic.title = "Speech recognition unavailable in this browser";
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "en-AU";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      state.listening = true;
      ui.mic.setAttribute("aria-pressed", "true");
      setStatus("BROWSER MIC // LISTENING");
    };
    recognition.onend = () => {
      state.listening = false;
      ui.mic.setAttribute("aria-pressed", "false");
      setStatus("TEXT // READY");
    };
    recognition.onerror = (event) => {
      addMessage("SYSTEM", `Microphone input failed (${event.error || "unknown"}). Use the ancient keyboard protocol.`, "system");
    };
    recognition.onresult = (event) => {
      ui.prompt.value = event.results[0][0].transcript;
      addMessage("SYSTEM", "Browser transcription inserted into the prompt. Review it before transmitting.", "system");
      ui.prompt.focus();
    };
    state.recognition = recognition;
  }

  ui.form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = ui.prompt.value.trim();
    if (!text) return;

    state.interactions += 1;
    addMessage("PATIENT", text, "user");
    ui.prompt.value = "";

    const reply = generateReply(text);
    window.setTimeout(() => doctorSays(reply), 180);
  });

  ui.speechToggle.addEventListener("click", () => setSpeech(!state.speechEnabled));
  ui.interrupt.addEventListener("click", () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    document.body.classList.remove("speaking");
    setStatus("TEXT // INTERRUPTED");
  });
  ui.clear.addEventListener("click", () => {
    clearTranscript();
    doctorSays("Transcript cleared. The clinical record has achieved plausible deniability.");
  });
  ui.mic.addEventListener("click", () => {
    if (!state.recognition) return;
    if (state.listening) {
      state.recognition.stop();
      return;
    }
    if (requestRecognitionConsent()) state.recognition.start();
  });

  $$(".mode-card").forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });

  ui.sessionId.textContent = String(hash(`${Date.now()}-${navigator.userAgent}`)).slice(0, 6).padStart(6, "0");
  populateVoices();
  if ("speechSynthesis" in window) window.speechSynthesis.onvoiceschanged = populateVoices;
  setupRecognition();
  setSpeech(false);

  doctorSays("HELLO. I AM DOCTOR S.BAITSO 2026. I am not a doctor and not an AI service. Please state your problem in one reproducible sentence.", false);
  addMessage("SYSTEM", "Typed text and generated replies stay in this page. Browser microphone recognition, if enabled, may use a remote transcription service.", "system");

  window.setInterval(checkSessionHealth, 15000);

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
})();