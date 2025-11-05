// Default hosts
const defaultHosts = [
  { label: "Localhost", url: "http://localhost:3000" },
  { label: "Staging", url: "https://staging.mycompany.com" },
  { label: "Production", url: "https://www.mycompany.com" },
];

// Load saved hosts or use defaults
function loadHosts() {
  // Check if chrome.storage is available (extension context)
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(["hosts"], (result) => {
      const hosts = result.hosts || defaultHosts;
      renderHosts(hosts);
    });
  } else {
    // Fallback for testing outside extension context
    renderHosts(defaultHosts);
  }
}

// Render the host list
function renderHosts(hosts) {
  const hostList = document.getElementById("hostList");
  hostList.innerHTML = "";

  hosts.forEach((host, index) => {
    const hostItem = document.createElement("div");
    hostItem.className = "host-item";
    hostItem.draggable = true;
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

  // Add drag and drop event listeners
  setupDragAndDrop();
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

  // Check if chrome.storage is available (extension context)
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.set({ hosts }, () => {
      showStatus("Settings saved successfully!", "success");
    });
  } else {
    // Fallback for testing outside extension context
    console.log("Saved hosts:", hosts);
    showStatus("Settings saved successfully! (test mode)", "success");
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

// Drag and drop functionality
function setupDragAndDrop() {
  const hostItems = document.querySelectorAll(".host-item");
  const hostList = document.getElementById("hostList");

  hostItems.forEach((item) => {
    // Dragstart - mark the item being dragged
    item.addEventListener("dragstart", (e) => {
      item.id = "dragged-item";
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/html", item.innerHTML);
    });

    // Dragend - cleanup
    item.addEventListener("dragend", (e) => {
      item.removeAttribute("id");
      // Remove any leftover placeholders
      const placeholder = hostList.querySelector(".placeholder");
      if (placeholder) {
        placeholder.remove();
      }
    });
  });

  // Dragover - show where the item will be dropped
  hostList.addEventListener("dragover", (e) => {
    e.preventDefault();
    const draggedItem = document.getElementById("dragged-item");
    if (!draggedItem) return;

    const afterElement = getDragAfterElement(hostList, e.clientY);
    const placeholder = getOrCreatePlaceholder(draggedItem);

    if (afterElement == null) {
      hostList.appendChild(placeholder);
    } else {
      hostList.insertBefore(placeholder, afterElement);
    }
  });

  // Drop - reorder the items
  hostList.addEventListener("drop", (e) => {
    e.preventDefault();
    const draggedItem = document.getElementById("dragged-item");
    const placeholder = hostList.querySelector(".placeholder");

    if (!draggedItem || !placeholder) return;

    // Insert the dragged item at the placeholder position
    hostList.insertBefore(draggedItem, placeholder);
    placeholder.remove();

    // Update the indices in the inputs
    updateIndices();
  });

  // Dragleave - remove placeholder when leaving the list
  hostList.addEventListener("dragleave", (e) => {
    if (!hostList.contains(e.relatedTarget)) {
      const placeholder = hostList.querySelector(".placeholder");
      if (placeholder) {
        placeholder.remove();
      }
    }
  });
}

// Get or create a placeholder element
function getOrCreatePlaceholder(draggedItem) {
  let placeholder = document.querySelector(".placeholder");

  if (!placeholder) {
    placeholder = document.createElement("div");
    placeholder.className = "host-item placeholder";
    placeholder.style.height = `${draggedItem.offsetHeight}px`;
  }

  return placeholder;
}

// Determine which element comes after the cursor position
function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(
      ".host-item:not(#dragged-item):not(.placeholder)"
    ),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

// Update the data-index attributes after reordering
function updateIndices() {
  const hostItems = document.querySelectorAll(".host-item");
  hostItems.forEach((item, index) => {
    const labelInput = item.querySelector('[data-field="label"]');
    const urlInput = item.querySelector('[data-field="url"]');
    const removeButton = item.querySelector(".remove-button");

    if (labelInput) labelInput.dataset.index = index;
    if (urlInput) urlInput.dataset.index = index;
    if (removeButton) removeButton.dataset.index = index;
  });
}

// Export configuration
document.getElementById("exportConfig").addEventListener("click", () => {
  const hosts = getCurrentHosts();

  if (hosts.length === 0) {
    showStatus("No hosts to export. Please add at least one host.", "error");
    return;
  }

  // Create the export data
  const exportData = {
    version: "1.0",
    exportDate: new Date().toISOString(),
    hosts: hosts,
  };

  // Convert to JSON string
  const jsonString = JSON.stringify(exportData, null, 2);

  // Create a blob and download link
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `host-switcher-config-${
    new Date().toISOString().split("T")[0]
  }.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showStatus("Configuration exported successfully!", "success");
});

// Import configuration
document.getElementById("importConfig").addEventListener("click", () => {
  document.getElementById("importFile").click();
});

document.getElementById("importFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const importData = JSON.parse(event.target.result);

      // Validate the imported data
      if (!importData.hosts || !Array.isArray(importData.hosts)) {
        showStatus("Invalid configuration file: missing hosts array", "error");
        return;
      }

      // Validate each host
      for (const host of importData.hosts) {
        if (!host.label || !host.url) {
          showStatus(
            "Invalid configuration file: each host must have a label and url",
            "error"
          );
          return;
        }

        // Validate URL format
        try {
          new URL(host.url);
        } catch (err) {
          showStatus(`Invalid URL in configuration: ${host.url}`, "error");
          return;
        }
      }

      // Show confirmation dialog
      const confirmMessage = `This will replace your current ${
        getCurrentHosts().length
      } host(s) with ${
        importData.hosts.length
      } host(s) from the file. Continue?`;
      if (confirm(confirmMessage)) {
        renderHosts(importData.hosts);
        showStatus(
          `Successfully imported ${importData.hosts.length} host(s). Don't forget to save!`,
          "success"
        );
      }
    } catch (error) {
      showStatus(`Error importing configuration: ${error.message}`, "error");
    } finally {
      // Reset the file input
      e.target.value = "";
    }
  };

  reader.onerror = () => {
    showStatus("Error reading file", "error");
    e.target.value = "";
  };

  reader.readAsText(file);
});

// Initialize
loadHosts();
