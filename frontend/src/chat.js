import { ICONS } from "./utils.js";
import { parseMarkdown } from "./markdown.js";
import { streamResponse } from "./sse.js";
import { getScriptAttribute } from "./config.js";

export class XurChatUI {
  constructor(config = {}, sessionId = "") {
    this.config = config;
    this.sessionId = sessionId;
    this.isOpen = false;
    this.isResponding = false;
    this.container = null;
    this.messagesEl = null;
    this.inputEl = null;
    this.currentText = "";

    const forced = getScriptAttribute("forceddisplaytype") || (typeof window !== "undefined" && window.forcedDisplayType);
    this.displayType = forced || (config.displayType || "sticky");
  }

  mount() {
    if (document.getElementById("assistant-xur")) {
      return;
    }

    const companyName = this.config.companyName || "Xur AI";
    const initialMessage = this.config.initialMessage || "Bonjour ! Je suis l'assistant Xur. Comment puis-je vous aider aujourd'hui ?";
    const buttonOptions = this.config.button_options || [];

    if (this.displayType === "inline") {
      this.mountInlineMode(companyName, initialMessage, buttonOptions);
      return;
    }

    const root = document.createElement("div");
    root.id = "assistant-xur";
    root.className = `xur-mode-${this.displayType}`;

    if (this.displayType === "ai-card") {
      this.mountAICardMode(root, companyName, initialMessage, buttonOptions);
      return;
    }

    if (this.displayType === "sticky-bar") {
      this.mountStickyBarMode(root, companyName, initialMessage, buttonOptions);
      return;
    }

    // Default: Floating Sticky Window + Launcher Button (anchored at bottom right)
    root.innerHTML = `
      <div id="xur-chat-window" class="xur-chat-window hidden">
        <div class="xur-header">
          <div class="xur-header-info">
            <div class="xur-avatar">${ICONS.sparkles}</div>
            <div class="xur-header-details">
              <div class="xur-header-title">${companyName}</div>
              <div class="xur-badge-online">En ligne</div>
            </div>
          </div>
          <div class="xur-header-actions">
            <button id="xur-reload-btn" class="xur-icon-btn" title="Recommencer">${ICONS.reload}</button>
            <button id="xur-close-btn" class="xur-icon-btn" title="Fermer le chatbot">${ICONS.close}</button>
          </div>
        </div>

        <div id="xur-messages" class="xur-messages"></div>

        <div class="xur-composer-card">
          <div class="xur-composer-box">
            <button id="xur-attach-btn" class="xur-attach-btn" title="Ajouter une pièce jointe">${ICONS.plus}</button>
            <input id="xur-input" type="text" class="xur-input" placeholder="Poser une question à Xur..." />
            <button id="xur-send-btn" class="xur-send-btn" title="Envoyer">${ICONS.send}</button>
          </div>
        </div>

        <div class="xur-credits">
          Propulsé par <a href="https://github.com/yacine20005/Xur" target="_blank">Xur AI</a>
        </div>
      </div>

      <button id="xur-launcher-btn" class="xur-launcher-btn" title="Ouvrir le chat">
        <span class="xur-launcher-badge"></span>
        ${ICONS.chat}
      </button>
    `;

    document.body.appendChild(root);
    this.container = root;

    this.messagesEl = root.querySelector("#xur-messages");
    this.inputEl = root.querySelector("#xur-input");

    this.bindEvents(buttonOptions);
    this.addAssistantMessage(initialMessage, buttonOptions);
  }

  mountStickyBarMode(root, companyName, initialMessage, buttonOptions) {
    root.innerHTML = `
      <div id="xur-sticky-bar-card" class="xur-sticky-bar-card">
        <div class="xur-avatar" style="width:32px;height:32px;">${ICONS.sparkles}</div>
        <span class="xur-sticky-bar-title">${initialMessage}</span>
        <button id="xur-bar-open-btn" class="xur-send-btn" style="width:36px;height:36px;" title="Ouvrir le chatbot">${ICONS.send}</button>
      </div>

      <div id="xur-chat-window" class="xur-chat-window hidden" style="position:fixed;bottom:92px;left:50%;transform:translateX(-50%);width:400px;">
        <div class="xur-header">
          <div class="xur-header-info">
            <div class="xur-avatar">${ICONS.sparkles}</div>
            <div class="xur-header-details">
              <div class="xur-header-title">${companyName}</div>
              <div class="xur-badge-online">En ligne</div>
            </div>
          </div>
          <div class="xur-header-actions">
            <button id="xur-reload-btn" class="xur-icon-btn" title="Recommencer">${ICONS.reload}</button>
            <button id="xur-close-btn" class="xur-icon-btn" title="Fermer">${ICONS.close}</button>
          </div>
        </div>
        <div id="xur-messages" class="xur-messages"></div>
        <div class="xur-composer-card">
          <div class="xur-composer-box">
            <button id="xur-attach-btn" class="xur-attach-btn" title="Pièce jointe">${ICONS.plus}</button>
            <input id="xur-input" type="text" class="xur-input" placeholder="Poser une question..." />
            <button id="xur-send-btn" class="xur-send-btn" title="Envoyer">${ICONS.send}</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(root);
    this.container = root;
    this.messagesEl = root.querySelector("#xur-messages");
    this.inputEl = root.querySelector("#xur-input");

    const barCard = root.querySelector("#xur-sticky-bar-card");
    barCard.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggle(true);
    });

    this.bindEvents(buttonOptions);
    this.addAssistantMessage(initialMessage, buttonOptions);
  }

  mountAICardMode(root, companyName, initialMessage, buttonOptions) {
    root.innerHTML = `
      <div class="xur-ai-card">
        <div class="xur-ai-card-badge">${ICONS.sparkles} Propulsé par Xur AI</div>
        <div class="xur-ai-card-title">${companyName}</div>
        <div class="xur-ai-card-desc">${initialMessage}</div>
        <div id="xur-options-container" class="xur-options-container"></div>
        <div class="xur-composer-box">
          <button id="xur-attach-btn" class="xur-attach-btn">${ICONS.plus}</button>
          <input id="xur-input" type="text" class="xur-input" placeholder="Posez une question..." />
          <button id="xur-send-btn" class="xur-send-btn">${ICONS.send}</button>
        </div>
      </div>
    `;

    document.body.appendChild(root);
    this.container = root;
    this.inputEl = root.querySelector("#xur-input");

    const sendBtn = root.querySelector("#xur-send-btn");
    sendBtn.addEventListener("click", () => this.handleSend());
    this.inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.handleSend();
    });

    const optionsContainer = root.querySelector("#xur-options-container");
    if (buttonOptions && buttonOptions.length > 0) {
      buttonOptions.forEach((opt) => {
        const btn = document.createElement("button");
        btn.className = "xur-option-btn";
        btn.textContent = opt;
        btn.addEventListener("click", () => this.handleSend(opt));
        optionsContainer.appendChild(btn);
      });
    }
  }

  mountInlineMode(companyName, initialMessage, buttonOptions) {
    const doMount = () => {
      const target = document.getElementById("xur-inline-target");
      if (!target) return false;
      if (document.getElementById("xur-inline-card-mounted")) return true;

      const card = document.createElement("div");
      card.id = "xur-inline-card-mounted";
      card.className = "xur-inline-card";
      card.innerHTML = `
        <div class="xur-header">
          <div class="xur-header-info">
            <div class="xur-avatar">${ICONS.sparkles}</div>
            <div class="xur-header-details">
              <div class="xur-header-title">${companyName}</div>
              <div class="xur-badge-online">Assistant Virtuel</div>
            </div>
          </div>
        </div>
        <div id="xur-messages" class="xur-messages"></div>
        <div class="xur-composer-card">
          <div class="xur-composer-box">
            <button id="xur-attach-btn" class="xur-attach-btn">${ICONS.plus}</button>
            <input id="xur-input" type="text" class="xur-input" placeholder="Posez votre question à l'assistant de Yacine..." />
            <button id="xur-send-btn" class="xur-send-btn">${ICONS.send}</button>
          </div>
        </div>
      `;

      target.appendChild(card);
      this.container = card;
      this.messagesEl = card.querySelector("#xur-messages");
      this.inputEl = card.querySelector("#xur-input");

      this.bindEvents(buttonOptions);
      this.addAssistantMessage(initialMessage, buttonOptions);
      return true;
    };

    if (!doMount()) {
      let attempts = 0;
      const timer = setInterval(() => {
        attempts++;
        if (doMount() || attempts > 50) {
          clearInterval(timer);
        }
      }, 100);
    }
  }

  bindEvents(buttonOptions = []) {
    const launcherBtn = this.container.querySelector("#xur-launcher-btn");
    const closeBtn = this.container.querySelector("#xur-close-btn");
    const reloadBtn = this.container.querySelector("#xur-reload-btn");
    const sendBtn = this.container.querySelector("#xur-send-btn");

    if (launcherBtn) {
      launcherBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggle();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggle(false);
      });
    }

    if (reloadBtn) {
      reloadBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (this.messagesEl) {
          this.messagesEl.innerHTML = "";
          const initialMessage = this.config.initialMessage || "Bonjour ! Comment puis-je vous aider ?";
          this.addAssistantMessage(initialMessage, buttonOptions);
        }
      });
    }

    if (sendBtn) sendBtn.addEventListener("click", () => this.handleSend());

    if (this.inputEl) {
      this.inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this.handleSend();
        }
      });
    }

    // ESC key shortcut to close widget (Jakob's Law / Accessibility)
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.toggle(false);
      }
    });

    if (this.messagesEl) {
      this.messagesEl.addEventListener("click", (e) => {
        const optionBtn = e.target.closest(".xur-option-btn");
        if (optionBtn) {
          const text = optionBtn.textContent.replace(/^✦\s*/, "").trim();
          this.handleSend(text);
        }
      });
    }
  }

  toggle(forceState = null) {
    this.isOpen = forceState !== null ? forceState : !this.isOpen;
    const windowEl = this.container.querySelector("#xur-chat-window");
    const launcherBtn = this.container.querySelector("#xur-launcher-btn");

    if (this.isOpen) {
      if (windowEl) windowEl.classList.remove("hidden");
      if (launcherBtn) launcherBtn.innerHTML = ICONS.close;
      if (this.inputEl) this.inputEl.focus();
    } else {
      if (windowEl) windowEl.classList.add("hidden");
      if (launcherBtn) launcherBtn.innerHTML = `${ICONS.chat}<span class="xur-launcher-badge"></span>`;
    }
  }

  addUserMessage(text) {
    if (!this.messagesEl) return;
    const wrapper = document.createElement("div");
    wrapper.className = "xur-msg-wrapper user";
    wrapper.innerHTML = `<div class="xur-bubble">${parseMarkdown(text)}</div>`;
    this.messagesEl.appendChild(wrapper);
    this.scrollToBottom();
  }

  addAssistantMessage(text, options = []) {
    if (!this.messagesEl) return;
    const wrapper = document.createElement("div");
    wrapper.className = "xur-msg-wrapper assistant";
    
    let html = `<div class="xur-bubble">${parseMarkdown(text)}</div>`;

    if (options && options.length > 0) {
      html += `<div class="xur-options-container">`;
      options.forEach((opt) => {
        html += `<button class="xur-option-btn"><span style="opacity:0.7;font-size:11px;">✦</span> ${opt}</button>`;
      });
      html += `</div>`;
    }

    wrapper.innerHTML = html;
    this.messagesEl.appendChild(wrapper);
    this.scrollToBottom();
  }

  handleSend(customText = null) {
    const text = customText || (this.inputEl ? this.inputEl.value.trim() : "");
    if (!text || this.isResponding) return;

    if (!customText && this.inputEl) {
      this.inputEl.value = "";
    }

    this.addUserMessage(text);
    this.isResponding = true;

    if (!this.messagesEl) return;

    const wrapper = document.createElement("div");
    wrapper.className = "xur-msg-wrapper assistant";
    wrapper.innerHTML = `<div class="xur-bubble">...</div>`;
    this.messagesEl.appendChild(wrapper);
    this.scrollToBottom();

    const bubbleEl = wrapper.querySelector(".xur-bubble");
    this.currentText = "";

    streamResponse({
      message: text,
      sessionId: this.sessionId,
      onToken: (token) => {
        this.currentText += token;
        bubbleEl.innerHTML = parseMarkdown(this.currentText);
        this.scrollToBottom();
      },
      onDone: () => {
        this.isResponding = false;
        if (!this.currentText) {
          bubbleEl.innerHTML = parseMarkdown("Désolé, aucune réponse n'a été reçue.");
        }
      },
      onError: (err) => {
        this.isResponding = false;
        if (!this.currentText) {
          bubbleEl.innerHTML = `<span style="color: #ef4444;">Erreur de connexion au serveur Xur.</span>`;
        }
      }
    });
  }

  scrollToBottom() {
    if (this.messagesEl) {
      this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
    }
  }
}

