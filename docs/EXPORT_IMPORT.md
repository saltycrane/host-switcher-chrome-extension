# Export and Import Configuration

The Host Switcher extension allows you to export and import host configurations, making it easy to share settings across team members.

## Exporting Configuration

1. Open the extension settings page (Right-click the extension icon → "Options")
2. Configure your hosts as desired
3. Click the "📥 Export Config" button at the bottom of the page
4. A JSON file will be downloaded with the current date in the filename (e.g., `host-switcher-config-2025-11-05.json`)

## Importing Configuration

1. Open the extension settings page
2. Click the "📤 Import Config" button at the bottom of the page
3. Select a configuration JSON file
4. Review the confirmation dialog showing how many hosts will be imported
5. Click "OK" to proceed with the import
6. Click "Save Settings" to persist the imported configuration

## Configuration File Format

The exported JSON file has the following structure:

```json
{
  "version": "1.0",
  "exportDate": "2025-11-05T12:00:00.000Z",
  "hosts": [
    {
      "label": "Localhost",
      "url": "http://localhost:3000"
    },
    {
      "label": "Staging",
      "url": "https://staging.mycompany.com"
    },
    {
      "label": "Production",
      "url": "https://www.mycompany.com"
    }
  ]
}
```

### Fields

- **version**: The configuration format version (currently "1.0")
- **exportDate**: ISO 8601 timestamp of when the configuration was exported
- **hosts**: Array of host objects, each containing:
  - **label**: Display name for the host
  - **url**: Full URL including protocol (http:// or https://)

## Validation

The import function validates:
- File is valid JSON
- `hosts` array exists and is an array
- Each host has both `label` and `url` fields
- Each URL is properly formatted

If validation fails, an error message will be displayed and the import will be cancelled.

## Use Cases

### Team Sharing
1. One team member configures the hosts for all environments
2. Exports the configuration
3. Shares the JSON file via email, Slack, or version control
4. Other team members import the file to get the same configuration

### Backup and Restore
1. Export your configuration periodically as a backup
2. If you need to reinstall the extension or switch computers, import your backed-up configuration

### Multiple Configurations
1. Export different configurations for different projects
2. Quickly switch between project configurations by importing the appropriate file

## Example

A sample configuration file is provided at `docs/sample-config.json` that you can use as a template or for testing.
