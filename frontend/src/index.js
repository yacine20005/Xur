import { getApiKey, getBackendUrl, getLanguage } from "./config.js";
import { injectStyles } from "./styles.js";
import { XurChatUI } from "./chat.js";
import { XurTracker } from "./tracker.js";

async function initXurWidget() {
  const apiKey = getApiKey();
  const backendUrl = getBackendUrl();
  const lang = getLanguage();

  console.log(`[Xur AI Widget] Initializing with key: ${apiKey} on backend: ${backendUrl}`);

  let configData = {
    companyName: "Xur AI",
    initialMessage: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
    button_options: ["Quels sont les délais ?", "Comment contacter le support ?"],
    theme: { primaryColor: "#2563eb", fontFamily: "DM Sans, sans-serif" }
  };
  let sessionId = "xur-session-" + Math.random().toString(36).substring(2, 9);

  try {
    const res = await fetch(`${backendUrl}/api/assistant/init/${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page_url: typeof window !== "undefined" ? window.location.href : "" })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.session_id) sessionId = data.session_id;
      if (data.response) configData = data.response;
    }
  } catch (err) {
    console.warn("[Xur AI Widget] Backend init unavailable, falling back to local defaults.", err);
  }

  // Inject styles with fetched or default theme
  injectStyles(configData.theme || {});

  // Mount Chat UI
  const chatUI = new XurChatUI(configData, sessionId);
  chatUI.mount();

  // Initialize Tracker
  XurTracker.init();

  // Expose global instance for debugging / custom triggers
  window.XurWidget = {
    open: () => chatUI.toggle(true),
    close: () => chatUI.toggle(false),
    toggle: () => chatUI.toggle(),
    send: (msg) => chatUI.handleSend(msg)
  };
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initXurWidget);
  } else {
    initXurWidget();
  }
}
