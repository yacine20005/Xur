export class XurTracker {
  static init() {
    // Visitor event tracking initializations (page view, scroll)
  }

  static track(eventName, data = {}) {
    console.log("[XurTracker]", eventName, data);
  }
}
