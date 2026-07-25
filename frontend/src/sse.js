import { getApiKey, getBackendUrl } from "./config.js";

export function streamResponse({ message, sessionId, onToken, onDone, onError }) {
  const apiKey = getApiKey();
  const backendUrl = getBackendUrl();

  const params = new URLSearchParams({
    api_key: apiKey,
    user_message: message,
    session_id: sessionId || "",
    page_url: typeof window !== "undefined" ? window.location.href : ""
  });

  const url = `${backendUrl}/sse/get_response?${params.toString()}`;
  const eventSource = new EventSource(url);

  eventSource.onmessage = function (event) {
    if (event.data === "[DONE]") {
      eventSource.close();
      if (onDone) onDone();
      return;
    }

    try {
      const data = JSON.parse(event.data);
      if (data.event === "done") {
        eventSource.close();
        if (onDone) onDone();
        return;
      }
      if (data.event === "assistant_delta" && data.content && onToken) {
        onToken(data.content);
      }
    } catch (e) {
      if (onToken) onToken(event.data);
    }
  };

  eventSource.onerror = function (err) {
    console.error("[Xur SSE Error]", err);
    eventSource.close();
    if (onError) onError(err);
  };

  return eventSource;
}
