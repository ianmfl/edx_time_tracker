document.addEventListener('DOMContentLoaded', () => {
    const websiteInput = document.getElementById('website')
    const timeLimitInput = document.getElementById('time-limit')
    const addWebsiteButton = document.getElementById('add-website')
    const websiteList = document.getElementById('website-list')

    chrome.storage.local.get(['focusSettings'], (result) => {
        const focusSettings = result.focusSettings || {}
        renderWebsiteList(focusSettings)
    })

    addWebsiteButton.addEventListener('click', () => {
        const website = websiteInput.value.trim()
        const timeLimit = parseInt(timeLimitInput.value, 10)

        if (!website || isNaN(timeLimit) || timeLimit < 1) {
            alert('Please provide a valid website and time limit (minutes).')
            return;
        }

        chrome.storage.local.get(['focusSettings'], (result) => {
            const focusSettings = result.focusSettings || {}
            focusSettings[website] = timeLimit * 60 * 1000;
            chrome.storage.local.set({ focusSettings }, () => {
                renderWebsiteList(focusSettings)
            })
        })

        websiteInput.value = ''
        timeLimitInput.value = ''
    })

    function renderWebsiteList(focusSettings) {
        websiteList.innerHTML = ''

        const entries = Object.entries(focusSettings);
        if (entries.length === 0) {
            const li = document.createElement('li')
            li.textContent = 'No website limits set.'
            websiteList.appendChild(li)
            return;
        }

        entries.forEach(([site, limitMs]) => {
            const li = document.createElement('li')
            li.className = 'website-item'

            const limitMinutes = Math.floor(limitMs / 1000 / 60)
            li.innerHTML = 
                `
                    <span class="site-info"><strong>${site}</strong> - ${limitMinutes} min</span>
                    <button class="remove-btn">Remove</button>
            `;

            li.querySelector('.remove-btn').addEventListener('click', () => {
                chrome.storage.local.get(['focusSettings'], (res) => {
                    const updatedSettings = res.focusSettings || {}
                    delete updatedSettings[site]
                    chrome.storage.local.set({ focusSettings: updatedSettings }, () => {
                        renderWebsiteList(updatedSettings)
                    })
                })
            })
            websiteList.appendChild(li)
        })
    }
})