# Documentation Files

This directory contains documentation and testing resources for the Host Switcher Chrome extension.

## Documentation Files

### EXPORT_IMPORT.md
Comprehensive guide on how to use the export and import feature. Includes:
- How to export configurations
- How to import configurations
- Configuration file format specification
- Validation rules
- Use cases and examples

### IMPLEMENTATION_SUMMARY.md
Technical summary of the export/import feature implementation. Includes:
- Overview of changes made
- Files modified and created
- Testing results
- User workflow

### FLOW_DIAGRAM.md
Visual flow diagrams showing:
- Export process flow
- Import process flow
- Validation checks
- Team collaboration workflow

## Sample Files

### sample-config.json
Example configuration file showing the proper JSON structure for importing. Can be used as a template for creating custom configurations.

## Test Files

### test-export-import.html
Browser-based testing interface for validating the import/export logic. Open in Chrome to run interactive tests.

### test-validation.js
Node.js script that validates the sample-config.json file using the same validation logic as the extension.

### test-validation-comprehensive.js
Comprehensive test suite that validates the import validation logic with multiple test cases including:
- Valid configuration
- Missing hosts array
- Invalid array type
- Missing labels/URLs
- Invalid URL formats
- Multiple hosts with errors
- Empty hosts array

## Screenshots

### screenshot-host-switcher.png
Screenshot of the popup showing host selection interface.

### screenshot-settings.png
Screenshot of the settings/options page showing host configuration interface.

## Usage

### Running Tests
```bash
# Validate sample config
cd docs
node test-validation.js

# Run comprehensive validation tests
node test-validation-comprehensive.js

# Open browser-based tests
open test-export-import.html
```

### Using Sample Config
The sample-config.json can be imported directly into the extension for testing or used as a template for creating team configurations.

## Adding Documentation

When adding new features, please:
1. Update the main README.md in the root directory
2. Create detailed documentation in this docs/ directory
3. Add examples and test files as appropriate
4. Update this README.md to list new documentation files
