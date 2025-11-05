const fs = require("fs");

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

console.log("Running validation tests...\n");

// Test 1: Valid config
console.log("Test 1: Valid configuration");
const validConfig = {
  version: "1.0",
  hosts: [{ label: "Test", url: "http://localhost:3000" }],
};
let result = validateConfig(validConfig);
console.log(
  result.valid ? "✓ PASS" : "✗ FAIL:",
  result.error || "Valid config accepted"
);

// Test 2: Missing hosts array
console.log("\nTest 2: Missing hosts array");
const noHosts = { version: "1.0" };
result = validateConfig(noHosts);
console.log(
  !result.valid ? "✓ PASS" : "✗ FAIL:",
  result.error || "Should reject"
);

// Test 3: Hosts not an array
console.log("\nTest 3: Hosts is not an array");
const hostsNotArray = { version: "1.0", hosts: "not an array" };
result = validateConfig(hostsNotArray);
console.log(
  !result.valid ? "✓ PASS" : "✗ FAIL:",
  result.error || "Should reject"
);

// Test 4: Missing label
console.log("\nTest 4: Host missing label");
const noLabel = {
  version: "1.0",
  hosts: [{ url: "http://localhost:3000" }],
};
result = validateConfig(noLabel);
console.log(
  !result.valid ? "✓ PASS" : "✗ FAIL:",
  result.error || "Should reject"
);

// Test 5: Missing url
console.log("\nTest 5: Host missing URL");
const noUrl = {
  version: "1.0",
  hosts: [{ label: "Test" }],
};
result = validateConfig(noUrl);
console.log(
  !result.valid ? "✓ PASS" : "✗ FAIL:",
  result.error || "Should reject"
);

// Test 6: Invalid URL
console.log("\nTest 6: Invalid URL format");
const invalidUrl = {
  version: "1.0",
  hosts: [{ label: "Bad", url: "not-a-url" }],
};
result = validateConfig(invalidUrl);
console.log(
  !result.valid ? "✓ PASS" : "✗ FAIL:",
  result.error || "Should reject"
);

// Test 7: Multiple hosts with one invalid
console.log("\nTest 7: Multiple hosts with one invalid URL");
const mixedHosts = {
  version: "1.0",
  hosts: [
    { label: "Good", url: "http://localhost:3000" },
    { label: "Bad", url: "invalid" },
  ],
};
result = validateConfig(mixedHosts);
console.log(
  !result.valid ? "✓ PASS" : "✗ FAIL:",
  result.error || "Should reject"
);

// Test 8: Empty hosts array
console.log("\nTest 8: Empty hosts array");
const emptyHosts = {
  version: "1.0",
  hosts: [],
};
result = validateConfig(emptyHosts);
console.log(
  result.valid ? "✓ PASS" : "✗ FAIL:",
  "Empty array is technically valid"
);

console.log("\n✓ All validation tests completed");
