export function getScriptTag() {
  if (typeof document === "undefined") return null;
  return (
    document.getElementById("xur-widget-script") ||
    document.currentScript ||
    document.querySelector("script[data-xur-widget]") ||
    document.querySelector("script[forceddisplaytype]") ||
    document.querySelector('script[src*="widget.js"]') ||
    document.querySelector('script[src*="widget"]')
  );
}

export function getScriptAttribute(attr) {
  const tag = getScriptTag();
  if (!tag) return null;

  const dataAttr = `data-${attr}`;
  const camelAttr = attr.replace(/-([a-z])/g, (_, g) => g.toUpperCase());

  return (
    tag.getAttribute(attr) ||
    tag.getAttribute(dataAttr) ||
    (tag.dataset && tag.dataset[camelAttr]) ||
    (tag.dataset && tag.dataset[attr]) ||
    null
  );
}

export function getApiKey() {
  return (
    getScriptAttribute("api-key") ||
    getScriptAttribute("data-api-key") ||
    getScriptAttribute("key") ||
    "demo-xur-key-2024"
  );
}

export function getBackendUrl() {
  const attr = getScriptAttribute("backend-url") || getScriptAttribute("data-backend-url");
  if (attr) return attr.replace(/\/$/, "");
  if (typeof window !== "undefined" && window.XUR_BACKEND_URL) {
    return window.XUR_BACKEND_URL.replace(/\/$/, "");
  }
  const tag = getScriptTag();
  if (tag && tag.src) {
    try {
      const parsedUrl = new URL(tag.src, typeof window !== "undefined" ? window.location.href : undefined);
      return parsedUrl.origin;
    } catch (e) {
      // ignore parsing error
    }
  }
  if (typeof window !== "undefined" && window.location && window.location.origin) {
    return window.location.origin;
  }
  return "http://localhost:8005";
}

export function getLanguage() {
  return getScriptAttribute("lang") || "fr";
}
