export function injectStyles(theme = {}) {
  if (typeof document === "undefined") return;
  
  // Remove any existing style element to ensure fresh injection
  const existingStyle = document.getElementById("xur-widget-styles");
  if (existingStyle) {
    existingStyle.remove();
  }

  const fontFamily = theme.fontFamily || "'Albert Sans', 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif";

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Albert+Sans:ital,wght@0,300..900;1,300..900&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');

    /* Astryx Dark Obsidian Design Tokens (Uniform UX Systems) */
    :root {
      --xur-bg-surface: rgba(14, 15, 20, 0.94);
      --xur-bg-card: rgba(255, 255, 255, 0.05);
      --xur-bg-subtle: rgba(8, 9, 12, 0.4);
      --xur-border: rgba(255, 255, 255, 0.12);
      --xur-border-hover: rgba(255, 255, 255, 0.25);
      --xur-text-primary: #ffffff;
      --xur-text-secondary: #d4d4d8;
      --xur-text-muted: #8e8e98;
      --xur-brand: #ffffff;
      --xur-brand-color: #09090b;
      --xur-radius-card: 22px;
      --xur-radius-pill: 9999px;
      --xur-shadow-card: 0 28px 70px -10px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.15);
      --xur-font: ${fontFamily};
    }

    #assistant-xur,
    #assistant-xur *,
    .xur-inline-card,
    .xur-inline-card * {
      box-sizing: border-box !important;
      font-family: var(--xur-font) !important;
      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
    }

    #assistant-xur h1, #assistant-xur h2, #assistant-xur h3, #assistant-xur p, #assistant-xur ul, #assistant-xur li,
    .xur-inline-card h1, .xur-inline-card h2, .xur-inline-card h3, .xur-inline-card p, .xur-inline-card ul, .xur-inline-card li {
      margin: 0;
      padding: 0;
    }

    #assistant-xur.xur-mode-sticky {
      position: fixed !important;
      bottom: 24px !important;
      right: 24px !important;
      z-index: 999999 !important;
    }

    #assistant-xur.xur-mode-sticky-bar {
      position: fixed !important;
      bottom: 24px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      z-index: 999999 !important;
      width: calc(100% - 40px) !important;
      max-width: 540px !important;
    }

    /* ------------------------------------
       Astryx Floating Launcher Button (Fitts's Law: 60px target)
    ------------------------------------ */
    #assistant-xur .xur-launcher-btn {
      width: 58px !important;
      height: 58px !important;
      border-radius: var(--xur-radius-pill) !important;
      background: #ffffff !important;
      color: #09090b !important;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
      box-shadow: 0 10px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease !important;
      position: relative !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    #assistant-xur .xur-launcher-btn:hover {
      transform: scale(1.08) !important;
      box-shadow: 0 14px 40px rgba(255, 255, 255, 0.22) !important;
    }

    #assistant-xur .xur-launcher-badge {
      position: absolute !important;
      top: 3px !important;
      right: 3px !important;
      width: 12px !important;
      height: 12px !important;
      background-color: #10b981 !important;
      border: 2px solid #09090b !important;
      border-radius: 50% !important;
      box-shadow: 0 0 10px #10b981 !important;
    }

    /* ------------------------------------
       Astryx Chat Window Card (Law of Common Region)
    ------------------------------------ */
    #assistant-xur .xur-chat-window {
      width: 385px !important;
      height: 590px !important;
      max-width: calc(100vw - 32px) !important;
      max-height: calc(85vh - 24px) !important;
      background: var(--xur-bg-surface) !important;
      backdrop-filter: blur(28px) saturate(190%) !important;
      -webkit-backdrop-filter: blur(28px) saturate(190%) !important;
      border: 1px solid var(--xur-border) !important;
      border-radius: var(--xur-radius-card) !important;
      box-shadow: var(--xur-shadow-card) !important;
      display: flex !important;
      flex-direction: column !important;
      overflow: hidden !important;
      z-index: 999999 !important;
      transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
      transform-origin: bottom right !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    .xur-inline-card {
      width: 100% !important;
      max-width: 600px !important;
      height: 530px !important;
      max-height: calc(85vh - 24px) !important;
      background: var(--xur-bg-surface) !important;
      backdrop-filter: blur(28px) saturate(190%) !important;
      -webkit-backdrop-filter: blur(28px) saturate(190%) !important;
      border: 1px solid var(--xur-border) !important;
      border-radius: var(--xur-radius-card) !important;
      box-shadow: var(--xur-shadow-card) !important;
      display: flex !important;
      flex-direction: column !important;
      overflow: hidden !important;
      margin: 0 auto !important;
      padding: 0 !important;
    }

    #assistant-xur .xur-chat-window.hidden {
      display: none !important;
      opacity: 0 !important;
      transform: scale(0.95) translateY(14px) !important;
    }

    /* Astryx Header (Jakob's Law: Standard Header pattern) */
    #assistant-xur .xur-header,
    .xur-inline-card .xur-header {
      background: rgba(18, 20, 26, 0.95) !important;
      border-bottom: 1px solid var(--xur-border) !important;
      padding: 14px 18px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      gap: 12px !important;
      margin: 0 !important;
      flex-shrink: 0 !important;
    }

    #assistant-xur .xur-header-info,
    .xur-inline-card .xur-header-info {
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
    }

    #assistant-xur .xur-avatar,
    .xur-inline-card .xur-avatar {
      width: 36px !important;
      height: 36px !important;
      border-radius: 50% !important;
      background: linear-gradient(135deg, #27272a 0%, #09090b 100%) !important;
      border: 1px solid rgba(255, 255, 255, 0.18) !important;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      color: #ffffff !important;
      flex-shrink: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    #assistant-xur .xur-header-details,
    .xur-inline-card .xur-header-details {
      display: flex !important;
      flex-direction: column !important;
      gap: 2px !important;
    }

    #assistant-xur .xur-header-title,
    .xur-inline-card .xur-header-title {
      font-size: 14.5px !important;
      font-weight: 700 !important;
      letter-spacing: -0.01em !important;
      line-height: 1.2 !important;
      color: #ffffff !important;
    }

    #assistant-xur .xur-badge-online,
    .xur-inline-card .xur-badge-online {
      display: inline-flex !important;
      align-items: center !important;
      gap: 5px !important;
      font-size: 11px !important;
      font-weight: 600 !important;
      color: #34d399 !important;
    }

    #assistant-xur .xur-badge-online::before,
    .xur-inline-card .xur-badge-online::before {
      content: '' !important;
      width: 6px !important;
      height: 6px !important;
      background: #10b981 !important;
      border-radius: 50% !important;
      display: inline-block !important;
      box-shadow: 0 0 8px #10b981 !important;
    }

    #assistant-xur .xur-header-actions,
    .xur-inline-card .xur-header-actions {
      display: flex !important;
      align-items: center !important;
      gap: 6px !important;
    }

    #assistant-xur .xur-icon-btn,
    .xur-inline-card .xur-icon-btn {
      background: rgba(255, 255, 255, 0.05) !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      color: var(--xur-text-secondary) !important;
      cursor: pointer !important;
      width: 32px !important;
      height: 32px !important;
      border-radius: 50% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: all 0.2s ease !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    #assistant-xur .xur-icon-btn:hover,
    .xur-inline-card .xur-icon-btn:hover {
      color: #ffffff !important;
      background: rgba(255, 255, 255, 0.15) !important;
      border-color: rgba(255, 255, 255, 0.25) !important;
    }

    /* ------------------------------------
       Messages Area (Uniform 18px Grid & Law of Proximity)
    ------------------------------------ */
    #assistant-xur .xur-messages,
    .xur-inline-card .xur-messages {
      flex: 1 !important;
      padding: 18px !important;
      overflow-y: auto !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 16px !important;
      background: var(--xur-bg-subtle) !important;
      margin: 0 !important;
    }

    #assistant-xur .xur-messages::-webkit-scrollbar,
    .xur-inline-card .xur-messages::-webkit-scrollbar {
      width: 5px !important;
    }

    #assistant-xur .xur-messages::-webkit-scrollbar-track,
    .xur-inline-card .xur-messages::-webkit-scrollbar-track {
      background: transparent !important;
    }

    #assistant-xur .xur-messages::-webkit-scrollbar-thumb,
    .xur-inline-card .xur-messages::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.12) !important;
      border-radius: 9999px !important;
    }

    #assistant-xur .xur-messages::-webkit-scrollbar-thumb:hover,
    .xur-inline-card .xur-messages::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.25) !important;
    }

    #assistant-xur .xur-msg-wrapper,
    .xur-inline-card .xur-msg-wrapper {
      display: flex !important;
      flex-direction: column !important;
      max-width: 86% !important;
      width: fit-content !important;
      margin: 2px 0 !important;
      padding: 0 !important;
    }

    #assistant-xur .xur-msg-wrapper.user,
    .xur-inline-card .xur-msg-wrapper.user {
      align-self: flex-end !important;
      align-items: flex-end !important;
      margin-left: 20px !important;
    }

    #assistant-xur .xur-msg-wrapper.assistant,
    .xur-inline-card .xur-msg-wrapper.assistant {
      align-self: flex-start !important;
      align-items: flex-start !important;
      max-width: 90% !important;
      margin-right: 16px !important;
    }

    #assistant-xur .xur-bubble,
    .xur-inline-card .xur-bubble {
      padding: 12px 16px !important;
      border-radius: 18px !important;
      font-size: 13.5px !important;
      line-height: 1.58 !important;
      word-break: break-word !important;
      letter-spacing: -0.005em !important;
      margin: 0 !important;
    }

    #assistant-xur .xur-msg-wrapper.user .xur-bubble,
    .xur-inline-card .xur-msg-wrapper.user .xur-bubble {
      background: linear-gradient(135deg, #ffffff 0%, #f4f4f5 100%) !important;
      color: #09090b !important;
      font-weight: 600 !important;
      border-bottom-right-radius: 4px !important;
      box-shadow: 0 4px 14px rgba(255, 255, 255, 0.12) !important;
    }

    #assistant-xur .xur-msg-wrapper.assistant .xur-bubble,
    .xur-inline-card .xur-msg-wrapper.assistant .xur-bubble {
      background: rgba(255, 255, 255, 0.06) !important;
      color: #f4f4f5 !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      border-bottom-left-radius: 4px !important;
      backdrop-filter: blur(12px) !important;
    }

    #assistant-xur .xur-bubble a,
    .xur-inline-card .xur-bubble a {
      color: #60a5fa !important;
      text-decoration: underline !important;
    }

    #assistant-xur .xur-bubble ul,
    .xur-inline-card .xur-bubble ul {
      margin-left: 16px !important;
      margin-top: 6px !important;
    }

    #assistant-xur .xur-bubble li,
    .xur-inline-card .xur-bubble li {
      margin-bottom: 4px !important;
    }

    #assistant-xur .xur-bubble code,
    .xur-inline-card .xur-bubble code {
      background: rgba(0, 0, 0, 0.4) !important;
      border: 1px solid var(--xur-border) !important;
      color: #38bdf8 !important;
      padding: 2px 6px !important;
      border-radius: 6px !important;
      font-size: 12px !important;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
    }

    /* ------------------------------------
       Astryx Quick-Prompt Suggestions (Hick's Law: Choice Simplification)
    ------------------------------------ */
    #assistant-xur .xur-options-container,
    .xur-inline-card .xur-options-container {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 8px !important;
      width: 100% !important;
      margin-top: 10px !important;
      padding: 2px 0 !important;
    }

    #assistant-xur .xur-option-btn,
    .xur-inline-card .xur-option-btn {
      background: rgba(255, 255, 255, 0.08) !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      color: #e4e4e7 !important;
      padding: 8px 14px !important;
      border-radius: var(--xur-radius-pill) !important;
      font-size: 12.5px !important;
      font-weight: 600 !important;
      cursor: pointer !important;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 6px !important;
      text-align: left !important;
      line-height: 1.35 !important;
      margin: 1px 0 !important;
    }

    #assistant-xur .xur-option-btn:hover,
    .xur-inline-card .xur-option-btn:hover {
      background: #ffffff !important;
      color: #09090b !important;
      border-color: #ffffff !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 6px 18px rgba(255, 255, 255, 0.15) !important;
    }

    /* ------------------------------------
       Astryx Chat Composer Box (Fitts's & Miller's Law)
    ------------------------------------ */
    #assistant-xur .xur-composer-card,
    .xur-inline-card .xur-composer-card {
      padding: 12px 18px 14px 18px !important;
      background: rgba(14, 15, 20, 0.95) !important;
      border-top: 1px solid var(--xur-border) !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 8px !important;
      margin: 0 !important;
      flex-shrink: 0 !important;
    }

    #assistant-xur .xur-composer-box,
    .xur-inline-card .xur-composer-box {
      background: rgba(255, 255, 255, 0.05) !important;
      border: 1px solid rgba(255, 255, 255, 0.12) !important;
      border-radius: var(--xur-radius-pill) !important;
      padding: 4px 4px 4px 14px !important;
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      transition: border-color 0.2s, box-shadow 0.2s, background 0.2s !important;
      margin: 0 !important;
    }

    #assistant-xur .xur-composer-box:focus-within,
    .xur-inline-card .xur-composer-box:focus-within {
      border-color: rgba(255, 255, 255, 0.4) !important;
      background: rgba(255, 255, 255, 0.08) !important;
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.08) !important;
    }

    #assistant-xur .xur-attach-btn,
    .xur-inline-card .xur-attach-btn {
      background: transparent !important;
      border: none !important;
      color: var(--xur-text-secondary) !important;
      cursor: pointer !important;
      padding: 4px !important;
      border-radius: 50% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: color 0.2s !important;
      flex-shrink: 0 !important;
      margin: 0 !important;
    }

    #assistant-xur .xur-attach-btn:hover,
    .xur-inline-card .xur-attach-btn:hover {
      color: #ffffff !important;
    }

    #assistant-xur .xur-input,
    .xur-inline-card .xur-input {
      flex: 1 !important;
      border: none !important;
      background: transparent !important;
      font-size: 13.5px !important;
      outline: none !important;
      color: #ffffff !important;
      padding: 5px 0 !important;
      margin: 0 !important;
    }

    #assistant-xur .xur-input::placeholder,
    .xur-inline-card .xur-input::placeholder {
      color: var(--xur-text-muted) !important;
    }

    #assistant-xur .xur-send-btn,
    .xur-inline-card .xur-send-btn {
      width: 36px !important;
      height: 36px !important;
      border-radius: 50% !important;
      background: #ffffff !important;
      color: #09090b !important;
      border: none !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: transform 0.2s, box-shadow 0.2s !important;
      flex-shrink: 0 !important;
      box-shadow: 0 4px 12px rgba(255, 255, 255, 0.15) !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    #assistant-xur .xur-send-btn:hover,
    .xur-inline-card .xur-send-btn:hover {
      transform: scale(1.08) !important;
      box-shadow: 0 6px 18px rgba(255, 255, 255, 0.25) !important;
    }

    /* ------------------------------------
       Astryx Sticky Bar Mode
    ------------------------------------ */
    #assistant-xur .xur-sticky-bar-card {
      background: rgba(14, 15, 20, 0.92) !important;
      backdrop-filter: blur(24px) !important;
      -webkit-backdrop-filter: blur(24px) !important;
      border: 1px solid var(--xur-border) !important;
      border-radius: var(--xur-radius-pill) !important;
      padding: 6px 8px 6px 16px !important;
      box-shadow: var(--xur-shadow-card) !important;
      display: flex !important;
      align-items: center !important;
      gap: 12px !important;
      cursor: pointer !important;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
      margin: 0 !important;
    }

    #assistant-xur .xur-sticky-bar-card:hover {
      transform: translateY(-2px) !important;
      border-color: var(--xur-border-hover) !important;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6) !important;
    }

    #assistant-xur .xur-sticky-bar-title {
      font-size: 13.5px !important;
      font-weight: 600 !important;
      color: #ffffff !important;
      flex: 1 !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
    }

    /* ------------------------------------
       Astryx AI Card Mode
    ------------------------------------ */
    #assistant-xur .xur-ai-card {
      width: 400px !important;
      max-width: 100% !important;
      background: rgba(14, 15, 20, 0.92) !important;
      backdrop-filter: blur(24px) !important;
      border: 1px solid var(--xur-border) !important;
      border-radius: var(--xur-radius-card) !important;
      padding: 24px !important;
      box-shadow: var(--xur-shadow-card) !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 14px !important;
      margin: 0 !important;
    }

    #assistant-xur .xur-ai-card-badge {
      display: inline-flex !important;
      align-items: center !important;
      gap: 6px !important;
      background: rgba(255, 255, 255, 0.06) !important;
      border: 1px solid rgba(255, 255, 255, 0.12) !important;
      color: #ffffff !important;
      font-size: 11px !important;
      font-weight: 700 !important;
      padding: 4px 10px !important;
      border-radius: var(--xur-radius-pill) !important;
      align-self: flex-start !important;
    }

    #assistant-xur .xur-ai-card-title {
      font-size: 19px !important;
      font-weight: 800 !important;
      letter-spacing: -0.02em !important;
      color: #ffffff !important;
    }

    #assistant-xur .xur-ai-card-desc {
      font-size: 13.5px !important;
      color: var(--xur-text-secondary) !important;
      line-height: 1.55 !important;
    }

    /* Credits Footer */
    #assistant-xur .xur-credits,
    .xur-inline-card .xur-credits {
      text-align: center !important;
      padding: 6px 0 8px 0 !important;
      font-size: 11px !important;
      color: var(--xur-text-muted) !important;
      background: rgba(14, 15, 20, 0.95) !important;
      margin: 0 !important;
      flex-shrink: 0 !important;
    }

    #assistant-xur .xur-credits a,
    .xur-inline-card .xur-credits a {
      color: var(--xur-text-secondary) !important;
      text-decoration: none !important;
      font-weight: 600 !important;
      transition: color 0.2s !important;
    }

    #assistant-xur .xur-credits a:hover,
    .xur-inline-card .xur-credits a:hover {
      color: #ffffff !important;
      text-decoration: underline !important;
    }
  `;

  const styleEl = document.createElement("style");
  styleEl.id = "xur-widget-styles";
  styleEl.textContent = css;
  document.head.appendChild(styleEl);
}
