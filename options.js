// Default hosts
const defaultHosts = [
  { label: "Localhost", url: "http://localhost:3000" },
  { label: "AWS Staging", url: "https://aws-staging.mycompany.com" },
  { label: "Boats Staging", url: "https://boats-staging.mycompany.com" },
  { label: "PS Staging", url: "https://ps-staging.mycompany.com" },
  { label: "Pre-prod", url: "https://preprod.mycompany.com" },
  { label: "Production", url: "https://www.mycompany.com" },
];

// Load saved hosts or use defaults
function loadHosts() {
  chrome.storage.sync.get(["hosts"], (result) => {
    const hosts = result.hosts || defaultHosts;
    renderHosts(hosts);
  });
}

// Render the host list
function renderHosts(hosts) {
  const hostList = document.getElementById("hostList");
  hostList.innerHTML = "";

  hosts.forEach((host, index) => {
    const hostItem = document.createElement("div");
    hostItem.className = "host-item";
    hostItem.innerHTML = `
      <span class="drag-handle">⋮⋮</span>
      <input type="text" class="label-input" value="${escapeHtml(
        host.label
      )}" placeholder="Label" data-index="${index}" data-field="label">
      <input type="text" class="url-input" value="${escapeHtml(
        host.url
      )}" placeholder="https://example.com" data-index="${index}" data-field="url">
      <button class="remove-button" data-index="${index}">Remove</button>
    `;
    hostList.appendChild(hostItem);
  });

  // Add event listeners
  document.querySelectorAll(".remove-button").forEach((btn) => {
    btn.addEventListener("click", removeHost);
  });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Get current hosts from inputs
function getCurrentHosts() {
  const hosts = [];
  const hostItems = document.querySelectorAll(".host-item");

  hostItems.forEach((item) => {
    const labelInput = item.querySelector('[data-field="label"]');
    const urlInput = item.querySelector('[data-field="url"]');

    if (labelInput && urlInput) {
      const label = labelInput.value.trim();
      const url = urlInput.value.trim();

      if (label && url) {
        hosts.push({ label, url });
      }
    }
  });

  return hosts;
}

// Add new host
document.getElementById("addHost").addEventListener("click", () => {
  const hosts = getCurrentHosts();
  hosts.push({ label: "", url: "" });
  renderHosts(hosts);
});

// Remove host
function removeHost(e) {
  const hosts = getCurrentHosts();
  const index = parseInt(e.target.dataset.index);
  hosts.splice(index, 1);
  renderHosts(hosts);
}

// Save settings
document.getElementById("save").addEventListener("click", () => {
  const hosts = getCurrentHosts();

  if (hosts.length === 0) {
    showStatus("Please add at least one host", "error");
    return;
  }

  // Validate URLs
  for (const host of hosts) {
    try {
      new URL(host.url);
    } catch (e) {
      showStatus(`Invalid URL: ${host.url}`, "error");
      return;
    }
  }

  chrome.storage.sync.set({ hosts }, () => {
    showStatus("Settings saved successfully!", "success");
  });
});

// Reset to defaults
document.getElementById("reset").addEventListener("click", () => {
  if (
    confirm(
      "Are you sure you want to reset to default hosts? This will overwrite your current settings."
    )
  ) {
    renderHosts(defaultHosts);
    chrome.storage.sync.set({ hosts: defaultHosts }, () => {
      showStatus("Reset to default settings", "success");
    });
  }
});

// Show status message
function showStatus(message, type) {
  const status = document.getElementById("status");
  status.textContent = message;
  status.className = `status ${type}`;
  status.style.display = "block";

  setTimeout(() => {
    status.style.display = "none";
  }, 3000);
}

// Initialize
loadHosts();
