# Export/Import Feature Flow Diagram

## Export Flow
```
User clicks "Export Config" button
    ↓
getCurrentHosts() - Reads hosts from UI inputs
    ↓
Create export data object:
  {
    version: "1.0",
    exportDate: ISO timestamp,
    hosts: [array of host objects]
  }
    ↓
Convert to JSON string
    ↓
Create Blob and download link
    ↓
Trigger download with timestamped filename
    ↓
Show success message
```

## Import Flow
```
User clicks "Import Config" button
    ↓
Open file picker (JSON files only)
    ↓
User selects a file
    ↓
FileReader reads file content
    ↓
Parse JSON
    ↓
Validate structure:
  - Has hosts array?
  - Is hosts an array?
    ↓
Validate each host:
  - Has label?
  - Has url?
  - Is url valid format?
    ↓
Show confirmation dialog:
"Replace X hosts with Y hosts?"
    ↓
User confirms
    ↓
renderHosts() - Display imported hosts in UI
    ↓
Show success message:
"Successfully imported X hosts. Don't forget to save!"
    ↓
User clicks "Save Settings" to persist
```

## Validation Checks

### Structure Validation
- ✓ File is valid JSON
- ✓ Has `hosts` property
- ✓ `hosts` is an array

### Host Validation (for each host)
- ✓ Has `label` property
- ✓ Has `url` property
- ✓ `url` is a valid URL format

### Error Handling
- Invalid JSON → Parse error caught and displayed
- Missing/invalid structure → Clear error message
- Invalid URL → Specific error with problematic URL
- Any validation failure → Import cancelled, no changes made

## User Experience Features

### Export
- One-click export
- Automatic filename with date
- Validation before export (must have at least 1 host)
- Success confirmation

### Import
- File picker filters to .json files only
- Comprehensive validation
- Confirmation dialog shows before/after count
- Reminder to save after import
- Original config preserved until "Save" clicked
- File input reset after import (successful or failed)

## Team Collaboration Workflow

```
Team Lead                    Team Member
    |                             |
    | 1. Configure hosts          |
    |    in settings              |
    |                             |
    | 2. Export config            |
    |    (download .json)         |
    |                             |
    | 3. Share file               |
    |---------------------------->|
    |    (email/Slack/Git)        |
    |                             |
    |                             | 4. Receive file
    |                             |
    |                             | 5. Import config
    |                             |    (upload .json)
    |                             |
    |                             | 6. Save settings
    |                             |
    |                             | ✓ Same config
```
