const fs = require("fs");
const config = JSON.parse(fs.readFileSync("sample-config.json", "utf8"));

// Test validation logic
function validateConfig(data) {
  if (!data.hosts || !Array.isArray(data.hosts)) {
    return { valid: false, error: "Missing hosts array" };
  }

  for (const host of data.hosts) {
    if (!host.label || !host.url) {
      return { valid: false, error: "Missing label or url" };
    }
    try {
      new URL(host.url);
    } catch (e) {
      return { valid: false, error: "Invalid URL: " + host.url };
    }
  }

  return { valid: true };
}

const result = validateConfig(config);
if (result.valid) {
  console.log("✓ Sample config is valid");
  console.log("  - Version:", config.version);
  console.log("  - Hosts count:", config.hosts.length);
  config.hosts.forEach((h) => console.log("    -", h.label + ":", h.url));
} else {
  console.log("✗ Validation failed:", result.error);
}
