// popup.js
let isEnabled = true;
let currentLimit = 3;

document.addEventListener('DOMContentLoaded', async () => {
  // Load saved settings
  const storage = await chrome.storage.local.get(['isEnabled', 'tabLimit']);
  isEnabled = storage.isEnabled ?? true;
  currentLimit = storage.tabLimit ?? 3;
  
  updateUI();
  
  // Event listeners
  document.getElementById('increaseLimit').addEventListener('click', () => {
    currentLimit++;
    chrome.runtime.sendMessage({ type: 'updateLimit', value: currentLimit });
    updateUI();
  });
  
  document.getElementById('decreaseLimit').addEventListener('click', () => {
    if (currentLimit > 1) {
      currentLimit--;
      chrome.runtime.sendMessage({ type: 'updateLimit', value: currentLimit });
      updateUI();
    }
  });
  
  document.getElementById('toggleEnabled').addEventListener('click', () => {
    isEnabled = !isEnabled;
    chrome.runtime.sendMessage({ type: 'toggleEnabled', value: isEnabled });
    updateUI();
  });
});

async function updateUI() {
  // Update limit display
  document.getElementById('currentLimit').textContent = currentLimit;
  
  // Update toggle button
  const toggleButton = document.getElementById('toggleEnabled');
  toggleButton.textContent = isEnabled ? 'Extension Enabled' : 'Extension Disabled';
  toggleButton.className = `toggle-button ${isEnabled ? 'enabled' : 'disabled'}`;
  
  // Update tab count
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const tabCount = tabs.length;
  const tabCountElement = document.getElementById('tabCount');
  
  if (tabCount >= currentLimit) {
    tabCountElement.className = 'status warning';
    tabCountElement.textContent = `Warning: ${tabCount}/${currentLimit} tabs open!`;
  } else {
    tabCountElement.className = 'status good';
    tabCountElement.textContent = `${tabCount}/${currentLimit} tabs open`;
  }
}