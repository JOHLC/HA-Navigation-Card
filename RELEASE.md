# Release Preparation Guide

This guide helps maintainers prepare releases for the Navigation Card.

## Before Creating a Release

### 1. Test the Card
Run the validation script:
```bash
node test/validate-card.js
```

All tests should pass before releasing.

### 2. Update Version Number
Update `CARD_VERSION` in `dist/ha-navigation-card.js`:
```javascript
const CARD_VERSION = '0.2.0'; // Update this
```

### 3. Update CHANGELOG.md
Add a new section for the release:
```markdown
## [0.2.0] - YYYY-MM-DD

### Added
- New feature 1
- New feature 2

### Fixed
- Bug fix 1
- Bug fix 2

### Changed
- Change 1
```

### 4. Commit Changes
```bash
git add dist/ha-navigation-card.js CHANGELOG.md
git commit -m "Bump version to 0.2.0"
git push
```

## Creating a Release

### Via GitHub UI
1. Go to the repository on GitHub
2. Click "Releases" in the sidebar
3. Click "Draft a new release"
4. Create a new tag (e.g., `v0.2.0`)
5. Set release title: "v0.2.0"
6. Copy release notes from CHANGELOG.md
7. Check "Set as the latest release"
8. Click "Publish release"

### Via Command Line
```bash
# Create and push a tag
git tag -a v0.2.0 -m "Release version 0.2.0"
git push origin v0.2.0

# Then create the release via GitHub UI
```

## After Release

### 1. Verify HACS
- Check that HACS can discover the new version
- Test installation in Home Assistant
- Verify the card works as expected

### 2. Update Documentation
- Ensure README badges show correct version
- Update any version-specific documentation

## Version Numbers

This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features, backwards compatible
- **PATCH** (0.0.1): Bug fixes, backwards compatible

## Checklist

Before each release, verify:

- [ ] All tests pass (`node test/validate-card.js`)
- [ ] Version number updated in code
- [ ] CHANGELOG.md updated
- [ ] Changes committed and pushed
- [ ] Release created on GitHub with proper tag
- [ ] Release notes copied from CHANGELOG
- [ ] Installation tested via HACS
- [ ] Card functionality verified in Home Assistant

## First Release (v0.1.0)

For the initial release to HACS:

1. Ensure all files are present:
   - [x] hacs.json
   - [x] info.md
   - [x] README.md
   - [x] LICENSE
   - [x] dist/ha-navigation-card.js

2. Create the first release tag `v0.1.0`

3. Submit to HACS:
   - Repository must be public
   - Has at least one release
   - Contains all required files
   - Follow HACS naming convention

4. Wait for HACS review and approval

## Support

For questions about releases, open an issue on GitHub.
