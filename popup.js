document.addEventListener('DOMContentLoaded', () => {
    const timeList = document.getElementById('time-list')
    const focusToggle = document.getElementById('focus-toggle')
    const openFocusSettingsBtn = document.getElementById('open-focus-settings')

    chrome.storage.local.get(['focusMode'], (result) => {
        focusToggle.checked = result.focusMode || false
    })

    focusToggle.addEventListener('change', () => {
        chrome.storage.local.set({ focusMode: focusToggle.checked})
    })

    openFocusSettingsBtn.addEventListener('click', () => {
        chrome.tabs.create({ url: chrome.runtime.getURL('focus-settings.html') });
    })

    chrome.storage.local.get(['timeData'], (result) => {
        const timeData = result.timeData || {}
        if (Object.keys(timeData).length === 0) {
            timeList.innerHTML = '<li>No data available yet.</li>';
            return;
        }

        timeList.innerHTML = ''
        Object.keys(timeData).forEach((hostname) => {
            const li = document.createElement('li')
            const totalSeconds = Math.floor(timeData[hostname] / 1000)
            li.textContent = `${hostname}: ${totalSeconds} seconds`;
            timeList.appendChild(li)

        })
    })
})