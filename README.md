# host-switcher-chrome-extension

A Chrome extension that allows you to quickly switch between different host environments (like localhost, staging, and production) while preserving the current page path. Vibe coded; prompts are in commit messages.

## Screenshots

![Host Switcher Popup](docs/screenshot-host-switcher.png)
![Settings Page](docs/screenshot-settings.png)

## Features

- ✅ Change the host of the current page in 2 clicks
- ✅ Open a host in a new tab
- ✅ Add, edit, or remove hosts
- ✅ Settings sync across Chrome browsers when signed in

## To Install

1. Click this link to download the ZIP file: [`host-switcher-chrome-extension-1.1.0.zip`]( https://github.com/saltycrane/host-switcher-chrome-extension/archive/refs/tags/v1.1.0.zip) 
2. Unzip the file
3. Open Chrome and go to chrome://extensions/
4. Enable "Developer mode" (toggle in top right)
5. Click "Load unpacked"
6. Select the unzipped folder (e.g. `host-switcher-chrome-extension-1.1.0`)
7. Pin the extension to your toolbar

(Alternatively you can clone the repo instead of downloading the ZIP file.)

## To Use

1. Navigate to any page on one of your hosts
2. Click the extension icon in your toolbar
3. Click any host button to switch to that environment while keeping the same path

## To Access Settings

- Method 1: Right-click the extension icon → "Options"
- Method 2: Click "⚙️ Configure Hosts" link at bottom of popup
- Method 3: Go to chrome://extensions/, find Host Switcher, click "Details" → "Extension options"
