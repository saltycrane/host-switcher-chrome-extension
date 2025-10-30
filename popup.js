// Define the list of hosts
const hosts = [
  { label: 'Localhost', url: 'http://localhost:3000' },
  { label: 'AWS Staging', url: 'https://aws-staging.mycompany.com' },
  { label: 'Boats Staging', url: 'https://boats-staging.mycompany.com' },
  { label: 'PS Staging', url: 'https://ps-staging.mycompany.com' },
  { label: 'Pre-prod', url: 'https://preprod.mycompany.com' },
  { label: 'Production', url: 'https://www.mycompany.com' }
];

// Get the current tab URL
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentTab = tabs[0];
  const currentUrl = new URL(currentTab.url);
  const currentOrigin = currentUrl.origin;
  
  // Display current URL
  document.getElementById('currentUrl').textContent = `Current: ${currentTab.url}`;
  
  // Create buttons for each host
  const hostList = document.getElementById('hostList');
  
  hosts.forEach(host => {
    const button = document.createElement('button');
    button.className = 'host-button';
    
    // Check if this is the current host
    if (currentOrigin === host.url) {
      button.classList.add('current');
    }
    
    // Create button content
    const label = document.createElement('span');
    label.className = 'host-label';
    label.textContent = host.label;
    
    const urlSpan = document.createElement('span');
    urlSpan.className = 'host-url';
    urlSpan.textContent = host.url;
    
    button.appendChild(label);
    button.appendChild(urlSpan);
    
    // Add click handler
    button.addEventListener('click', () => {
      switchHost(currentUrl, host.url, currentTab.id);
    });
    
    hostList.appendChild(button);
  });
});

// Function to switch host
function switchHost(currentUrl, newOrigin, tabId) {
  // Construct the new URL with the new origin but same path and query
  const newUrl = newOrigin + currentUrl.pathname + currentUrl.search + currentUrl.hash;
  
  // Update the tab with the new URL
  chrome.tabs.update(tabId, { url: newUrl }, () => {
    window.close();
  });
}