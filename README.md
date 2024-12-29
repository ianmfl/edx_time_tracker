# Time Tracker & Focus Mode

#### Video Demo: https://youtu.be/lXqKzCG63xk

#### Description:

**Time Tracker & Focus Mode** is a Chrome extension designed to help users become more aware of their online habits, reduce distractions, and boost productivity. By monitoring the time spent on each website and providing configurable daily limits, the extension encourages a more focused and intentional browsing experience. This project aims to showcase how JavaScript, Chrome’s extension APIs, and thoughtful design decisions can come together to create an effective, easy-to-use productivity tool.

---

### Overview of the Project

When you install **Time Tracker & Focus Mode**, the extension immediately begins tracking the time you spend on active Chrome tabs. For each domain visited, the extension records how many milliseconds you remain on that page. This data is then displayed in a neat, concise interface (the popup), which shows a list of websites and the total time spent, measured in seconds or minutes. Over time, this helps you see precisely where your attention is going during the day.

One of the key features of this extension is **Focus Mode**, which allows you to set a daily limit on particular websites. Once you specify a domain (e.g., social media platforms) and a time limit in minutes, the extension warns you via Chrome notifications when you are approaching that limit. Should you exceed the limit entirely, the extension can block that website for the rest of the day. Through these subtle (and sometimes not-so-subtle) interventions, **Time Tracker & Focus Mode** keeps you from drifting away from critical tasks and spending excessive time in unproductive “rabbit holes.”

---

### Design Choices and Rationale

- **Minimalist Interface**: The popup’s design is deliberately kept simple, providing a short summary of where you’ve spent your time so you can quickly glance at your stats. We opted for a basic list format that displays each domain alongside the total time, as it minimizes clutter.
- **Local Storage**: All data is stored via Chrome’s local storage. We considered external databases or cloud storage but concluded that a local, offline-first approach would be more straightforward for most users, as it doesn’t require account creation or external services.
- **Manifest V3**: We used the latest version of Chrome’s extension manifest to stay up-to-date with best practices and security improvements. This required implementing a service worker–style background script, rather than a persistent background page.
- **Granular Blocking**: When a site’s time limit is exceeded, the extension uses `webRequest` and `webRequestBlocking` permissions to intercept any future requests to that domain. This was chosen instead of simply warning the user, as a true productivity tool should provide a real barrier once the daily limit is reached.

---

### How to Use

1. **Install or Load the Extension**: After downloading the project files, navigate to `chrome://extensions`, enable Developer Mode, and select “Load unpacked.” Choose this project’s folder to install the extension.
2. **Open the Popup**: Click the extension’s icon in your Chrome toolbar to view the time summary. You’ll see how many seconds (or minutes) you’ve spent on each tracked domain.
3. **Enable Focus Mode**: In the popup, toggle the Focus Mode switch. This tells the extension to actively enforce daily limits on the domains you configure.
4. **Configure Your Limits**: Click **Open Focus Settings** from the popup or open the options page directly. There, you can type in a domain (e.g., “youtube.com”) and specify how many minutes per day you want to allow. If you find yourself exceeding your chosen limits, the extension will notify you and eventually block further requests to that site, forcing you to be mindful of your usage.

---

### File-by-File Explanation

- **`manifest.json`**: The core configuration file for the Chrome extension. It declares permissions (like `tabs`, `notifications`, `webRequest`, etc.), specifies the extension’s version, and lists which scripts should run in the background or as service workers.
- **`background.js`**: The service worker script that handles the logic for tracking active tabs, calculating time spent, and blocking sites if users exceed set limits. It listens to Chrome’s tab events (`tabs.onActivated`, `tabs.onUpdated`) and intercepts network requests to enforce blocking.
- **`popup.html`** & **`popup.js`**: Define the popup interface seen when you click the extension icon. The HTML file creates a simple structure for displaying time data and toggles for Focus Mode. The JS file fetches stored data from Chrome’s local storage, populates the popup, and lets you toggle Focus Mode or open the Focus Settings page.
- **`popup.css`** (or `styles.css`) : Provides the styling for the popup, ensuring a clean layout for the extension’s UI.
- **`focus-settings.html`** & **`focus-settings.js`**: These files form the extension’s options page, where users can add, remove, or modify websites and their daily time limits. This page also stores those limits in Chrome’s local storage and triggers re-renders of the website list, allowing you to manage your sites at any time.
- **`focus-settings.css`**: Defines the appearance of the focus settings page, from layout spacing to button colors.

---

### Challenges and Considerations

During development, one of the more challenging aspects was determining how to **track time** accurately without relying on a constantly open background page (as required by Manifest V3’s new service worker model). We implemented a system that detects when the active tab changes and calculates elapsed time based on the difference between the “start time” and the “switch time.” We also had to ensure that once the user shifts focus away from Chrome entirely, time tracking ceases, preventing inflated numbers.

For **blocking websites**, we debated whether to show a custom block page versus simply intercepting the request. We chose request interception (`webRequestBlocking`) because it gracefully halts navigation to the domain and is simpler to implement. However, we did consider adding a “blocked.html” page that shows a motivational message or reminder of why the site is being restricted. This remains a possible future enhancement.

---

### Final Thoughts

The **Time Tracker & Focus Mode** extension is a hands-on project intended to showcase how JavaScript, Chrome’s extension APIs, and thoughtful design can significantly impact daily productivity. By offering transparent time-tracking data and the ability to enforce daily limits, the extension strikes a balance between awareness and action. Looking ahead, you could build upon this foundation with more robust analytics, cross-device synchronization, or an integrated rewards/punishment system to further encourage beneficial browsing habits. We hope that this README clarifies each component of the project and inspires new ideas for polishing or extending its functionality.

If you have any questions or suggestions, feel free to explore the codebase or reach out with feedback. Happy coding—and happy focusing!