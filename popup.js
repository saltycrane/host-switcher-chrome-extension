// Default hosts (fallback if no settings saved)
const defaultHosts = [
  { label: "Localhost", url: "http://localhost:3000" },
  { label: "Staging", url: "https://staging.mycompany.com" },
  { label: "Production", url: "https://www.mycompany.com" },
];

// Load hosts from storage
chrome.storage.sync.get(["hosts"], (result) => {
  const hosts = result.hosts || defaultHosts;

  // Get the current tab URL
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    const currentUrl = new URL(currentTab.url);
    const currentOrigin = currentUrl.origin;

    // Create buttons for each host
    const hostList = document.getElementById("hostList");

    hosts.forEach((host) => {
      // Create a container for the host item
      const hostItem = document.createElement("div");
      hostItem.className = "host-item";

      // Create the main host button
      const button = document.createElement("button");
      button.className = "host-button";

      // Check if this is the current host
      if (currentOrigin === host.url) {
        button.classList.add("current");
      }

      // Create host button row 1
      const row1 = document.createElement("div");
      row1.className = "host-button-row1";

      // Create button host name label
      const label = document.createElement("span");
      label.className = "host-label";
      label.textContent = host.label;

      // Create host button row 2
      const row2 = document.createElement("div");
      row2.className = "host-button-row2";

      // Create host button URL
      const urlSpan = document.createElement("span");
      urlSpan.className = "host-url";
      urlSpan.textContent = host.url;

      // Add URL to row 2
      row2.appendChild(urlSpan);

      // Add click handler for switching in current tab
      button.addEventListener("click", () => {
        switchHost(currentUrl, host.url, currentTab.id);
      });

      // Create the "New Tab" button
      const newTabButton = document.createElement("button");
      newTabButton.className = "new-tab-button";
      newTabButton.textContent = "New Tab";
      newTabButton.title = "Open in new tab";

      // Add click handler for opening in new tab
      newTabButton.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent triggering the host button click
        openInNewTab(currentUrl, host.url);
      });

      // Add contents to row 1
      row1.appendChild(label);
      row1.appendChild(newTabButton);

      // Add the 2 rows to the button
      button.appendChild(row1);
      button.appendChild(row2);

      // Add both buttons to the host item
      hostItem.appendChild(button);

      // Add host to the host list
      hostList.appendChild(hostItem);
    });

    // Add settings link at the bottom
    const settingsDiv = document.createElement("div");
    settingsDiv.style.marginTop = "12px";
    settingsDiv.style.textAlign = "center";
    settingsDiv.innerHTML =
      '<a href="#" id="openSettings" style="color: #4285f4; text-decoration: none; font-size: 12px;">⚙️ Configure Hosts</a>';
    document.body.appendChild(settingsDiv);

    document.getElementById("openSettings").addEventListener("click", (e) => {
      e.preventDefault();
      chrome.runtime.openOptionsPage();
    });
  });
});

// Function to switch host in current tab
function switchHost(currentUrl, newOrigin, tabId) {
  // Construct the new URL with the new origin but same path and query
  const newUrl =
    newOrigin + currentUrl.pathname + currentUrl.search + currentUrl.hash;

  // Update the tab with the new URL
  chrome.tabs.update(tabId, { url: newUrl }, () => {
    window.close();
  });
}

// Function to open in new tab
function openInNewTab(currentUrl, newOrigin) {
  // Construct the new URL with the new origin but same path and query
  const newUrl =
    newOrigin + currentUrl.pathname + currentUrl.search + currentUrl.hash;

  // Open in new tab
  chrome.tabs.create({ url: newUrl }, () => {
    window.close();
  });
}
