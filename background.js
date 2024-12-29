const ALARM_NAME = 'timeTrackingAlarm';
const WARNING_THRESHOLD_MS = 5 * 60 * 1000; 

let activeTabUrl = null;      
let startTime = null;        


let lastActiveUrl = null;   
let lastCheckTime = null;     



chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['timeData', 'focusSettings'], (res) => {
    if (!res.timeData) chrome.storage.local.set({ timeData: {} });
    if (!res.focusSettings) chrome.storage.local.set({ focusSettings: {} });
  });


  chrome.alarms.create(ALARM_NAME, { periodInMinutes: 0.5 });
});


chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.create(ALARM_NAME, { periodInMinutes: 0.5 });
});


chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    switchTab(tab.url);
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.url) {
    switchTab(changeInfo.url);
  }
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    switchTab(null);
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].url) {
        switchTab(tabs[0].url);
      }
    });
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
   
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const now = Date.now();
      if (tabs && tabs.length > 0) {
        const currentTab = tabs[0];
        const currentUrl = currentTab.url;

        if (!lastActiveUrl || !lastCheckTime) {
          lastActiveUrl = currentUrl;
          lastCheckTime = now;
        } else {
         
          if (currentUrl === lastActiveUrl) {
            const elapsed = now - lastCheckTime;
            storeTimeData(currentUrl, elapsed);
            lastCheckTime = now;
          } else {
            
            const elapsed = now - lastCheckTime;
            storeTimeData(lastActiveUrl, elapsed);

    
            lastActiveUrl = currentUrl;
            lastCheckTime = now;
          }
        }
      } else {
      
        if (lastActiveUrl) {
          const elapsed = now - lastCheckTime;
          storeTimeData(lastActiveUrl, elapsed);
          lastActiveUrl = null;
          lastCheckTime = null;
        }
      }
    });
  }
});


function switchTab(newUrl) {
  const now = Date.now();
  if (activeTabUrl && startTime) {
    const elapsed = now - startTime;
    storeTimeData(activeTabUrl, elapsed);
  }

  if (newUrl) {
    activeTabUrl = newUrl;
    startTime = now;
  } else {
    
    activeTabUrl = null;
    startTime = null;
  }
}

function storeTimeData(url, timeSpent) {
  let hostname;
  try {
    hostname = new URL(url).hostname;
  } catch (err) {
    return; 
  }

  chrome.storage.local.get(['timeData', 'focusSettings', 'focusMode'], (res) => {
    const timeData = res.timeData || {};
    const focusSettings = res.focusSettings || {};
    const focusModeEnabled = !!res.focusMode;

    timeData[hostname] = (timeData[hostname] || 0) + timeSpent;

    chrome.storage.local.set({ timeData }, () => {
      if (focusModeEnabled && focusSettings[hostname]) {
        enforceFocusMode(hostname, timeData[hostname], focusSettings[hostname]);
      }
    });
  });
}


function enforceFocusMode(hostname, currentMs, limitMs) {
  const remaining = limitMs - currentMs;


  if (remaining <= WARNING_THRESHOLD_MS && remaining > 0) {
    sendNotification(
      `Tiempo casi agotado en ${hostname}`,
      `Te queda ~${(remaining / 60000).toFixed(1)} minuto(s) para ${hostname}.`
    );
  }


  if (currentMs >= limitMs) {
    blockWebsite(hostname);
    sendNotification(
      `Bloqueado ${hostname}`,
      `¡Has superado tu límite diario para ${hostname}!`
    );
  }
}

function blockWebsite(hostname) {
  chrome.webRequest.onBeforeRequest.addListener(
    () => ({ cancel: true }),
    { urls: [`*://${hostname}/*`] },
    ['blocking']
  );
}


function sendNotification(title, message) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon48.png', 
    title,
    message
  });
}


chrome.runtime.onSuspend.addListener(() => {
  switchTab(null);
});
