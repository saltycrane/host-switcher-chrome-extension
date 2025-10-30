# host-switcher-chrome-extension

A Chrome extension that allows you to quickly switch between different host environments (like localhost, staging, and production) while preserving the current page path. Vibe coded; prompts are in commit messages.

## Screenshots

![Host Switcher Popup](docs/screenshot-host-switcher.png)
![Settings Page](docs/screenshot-settings.png)

## Features

- ✅ Configurable host list - Add, edit, or remove hosts
- ✅ Settings page - Right-click extension icon → "Options" or click "⚙️ Configure Hosts" in popup
- ✅ Persistent storage - Settings sync across Chrome browsers when signed in
- ✅ Validation - Ensures URLs are valid before saving
- ✅ User-friendly interface - Clean design with drag handles for future reordering

## To Install

1. Clone the repo
    ```
    git clone https://github.com/saltycrane/host-switcher-chrome-extension.git
    ```
2. Open Chrome and go to chrome://extensions/
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the extension folder (`host-switcher-chrome-extension`)

## To Use

1. Navigate to any page on one of your hosts
2. Click the extension icon in your toolbar
3. Click any host button to switch to that environment while keeping the same path

## To Access Settings

- Method 1: Right-click the extension icon → "Options"
- Method 2: Click "⚙️ Configure Hosts" link at bottom of popup
- Method 3: Go to chrome://extensions/, find Host Switcher, click "Details" → "Extension options"
