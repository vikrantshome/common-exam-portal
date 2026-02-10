import { UniversalAdapter } from "./adapters/UniversalAdapter";

console.log("UniApply Assistant: Content Script Loaded");

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "FILL_FORM") {
    const url = window.location.href;
    console.log("UniApply: Received Fill Request for", url);

    if (UniversalAdapter.matches(url)) {
      console.log("UniApply: Matched Universal Adapter");
      
      // Async execution
      UniversalAdapter.fill(request.data).then(() => {
        sendResponse({ status: "success" });
      }).catch((e) => {
        console.error("UniApply: Universal Fill Error", e);
        sendResponse({ status: "error", message: String(e) });
      });
      
      return true; // Keep channel open for async response
    } else {
      console.warn("UniApply: URL not supported by Universal Adapter.");
      sendResponse({ status: "no_adapter" });
    }
  }
});