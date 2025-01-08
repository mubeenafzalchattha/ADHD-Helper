let isEnabled = true;
let tabLimit = 3;

chrome.storage.local.get(['isEnabled', 'tabLimit'], (result) => {
  isEnabled = result.isEnabled ?? true;
  tabLimit = result.tabLimit ?? 3;
});

chrome.tabs.onCreated.addListener(async (tab) => {
  if (!isEnabled) return;
  
  const tabs = await chrome.tabs.query({ currentWindow: true });
  if (tabs.length > tabLimit) {
    chrome.tabs.remove(tab.id);
    chrome.tabs.executeScript(tabs[0].id, {
      code: `alert('Tab limit reached! Maximum ${tabLimit} tabs allowed.');`
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'updateLimit') {
    tabLimit = request.value;
    chrome.storage.local.set({ tabLimit });
  } else if (request.type === 'toggleEnabled') {
    isEnabled = request.value;
    chrome.storage.local.set({ isEnabled });
  }
  sendResponse({ success: true });
});