# Contributing to Navigation Card

Thank you for your interest in contributing to the Navigation Card project! This document provides guidelines for contributing.

## 🐛 Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed steps to reproduce the behavior
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Screenshots**: If applicable
- **Environment**:
  - Home Assistant version
  - Browser and version
  - Card version

## 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use Case**: Why would this enhancement be useful?
- **Proposed Solution**: How should it work?
- **Alternatives**: Alternative solutions you've considered
- **Additional Context**: Any other relevant information

## 🔧 Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following the code style of the project
3. **Test your changes** thoroughly
4. **Update documentation** if needed (README, examples, etc.)
5. **Commit your changes** with clear, descriptive commit messages
6. **Push to your fork** and submit a pull request

### Code Style Guidelines

- Use clear, descriptive variable names
- Add comments for complex logic
- Follow existing code formatting
- Keep functions focused and concise
- Maintain consistent indentation (2 spaces)

### Commit Message Format

Use clear and descriptive commit messages:

```
Add feature: description of what was added
Fix: description of what was fixed
Update: description of what was updated
Docs: description of documentation changes
```

## 📝 Development Setup

1. Clone the repository
2. Make changes to `dist/ha-navigation-card.js`
3. Test in Home Assistant by:
   - Copying to `config/www/` folder
   - Adding as a resource in Lovelace
   - Testing all functionality

## ✅ Testing Checklist

Before submitting a PR, verify:

- [ ] Card loads without errors
- [ ] Visual editor works correctly
- [ ] Navigation links work (internal and external)
- [ ] Settings overlays work if configured
- [ ] Colors apply correctly
- [ ] Mobile responsive design works
- [ ] No console errors
- [ ] Code follows existing style

## 📋 Code Review Process

1. Maintainer will review your PR
2. May request changes or clarifications
3. Once approved, PR will be merged
4. Changes will be included in next release

## 🎯 Priority Areas

Current areas where contributions are especially welcome:

- Bug fixes
- Performance improvements
- Documentation improvements
- Example configurations
- Accessibility enhancements
- Test coverage

## 💬 Questions?

Feel free to open an issue with your question or reach out to the maintainers.

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.
