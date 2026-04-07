# Contributing to ACM Media Platform

Thank you for your interest in contributing to the ACM Media Platform! This document provides guidelines and instructions for contributing.

---

## 🚀 Quick Start

### For First-Time Contributors

1. **Fork the repository**
   ```bash
   # Fork the repository on GitHub
   # Clone your fork
   git clone https://github.com/YOUR_USERNAME/acm-media-platform.git
   cd acm-media-platform
   ```

2. **Set up development environment**
   ```bash
   # Run the setup script
   ./scripts/setup.sh

   # Create .env.local with your credentials
   cp .env.example .env.local
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes**
   ```bash
   # Start development server
   ./scripts/dev.sh dev

   # Make changes and test
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create pull request on GitHub
   ```

---

## 📋 Development Guidelines

### Code Style

**TypeScript:**
- Use TypeScript for all new code
- Avoid `any` types
- Use interfaces for object shapes
- Add proper type annotations

**React Components:**
- Use functional components with hooks
- Follow naming conventions: PascalCase for components
- Use prop interfaces or types
- Add JSDoc comments for complex functions

**CSS:**
- Use Tailwind CSS utility classes
- Avoid inline styles
- Use responsive prefixes (sm:, md:, lg:, xl:)
- Follow mobile-first approach

### Commit Messages

Follow conventional commits format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

**Examples:**
```bash
feat(blog): add comment system
fix(auth): resolve login issue with expired tokens
docs(readme): update installation instructions
style(components): format code with prettier
refactor(database): optimize query performance
test(api): add integration tests for endpoints
chore(deps): update dependencies
```

---

## 🏗️ Project Structure

```
acm-media-platform/
├── .github/
│   └── workflows/          # CI/CD workflows
├── docs/
│   └── adr/                # Architectural Decision Records
├── scripts/                # Development and build scripts
├── src/
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   │   ├── ads/          # Ad components
│   │   ├── layout/       # Layout components
│   │   └── ui/           # UI components
│   ├── contexts/         # React contexts
│   └── lib/              # Utility functions
├── .env.example           # Environment variables template
├── next.config.mjs        # Next.js configuration
├── tailwind.config.ts     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

---

## 🧪 Testing

### Before Submitting

1. **Run linter**
   ```bash
   ./scripts/dev.sh lint
   ```

2. **Run type check**
   ```bash
   ./scripts/dev.sh type-check
   ```

3. **Build project**
   ```bash
   ./scripts/dev.sh build
   ```

4. **Test locally**
   ```bash
   ./scripts/dev.sh dev
   ```

### Writing Tests

- Unit tests: `src/components/__tests__/`
- Integration tests: `src/lib/__tests__/`
- E2E tests: `e2e/`

See [TESTING.md](TESTING.md) for detailed testing guidelines.

---

## 📝 Documentation

### When to Update Documentation

Update documentation when:
- Adding new features
- Changing existing functionality
- Updating dependencies
- Modifying configuration
- Adding new scripts or tools

### Documentation Files

- `README.md` - Project overview and quick start
- `DOCS_INDEX.md` - Documentation index
- `CHANGELOG.md` - Version history and changes
- `docs/adr/` - Architectural Decision Records

---

## 🐛 Reporting Issues

### Before Creating an Issue

1. **Search existing issues**
   - Check if the issue already exists
   - Review closed issues for solutions

2. **Gather information**
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment details (OS, browser, version)
   - Screenshots (if applicable)

### Issue Template

```markdown
## Description
[Brief description of the issue]

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
[What you expected to happen]

## Actual Behavior
[What actually happened]

## Environment
- OS: [e.g., macOS 14.0]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 1.0.0]

## Screenshots
[If applicable, add screenshots]
```

---

## ✅ Pull Request Guidelines

### Before Submitting PR

1. **Update documentation**
   - Update README if needed
   - Add/update ADRs for architectural changes
   - Update CHANGELOG.md

2. **Write descriptive PR title**
   ```
   feat: add comment system to blog posts
   fix: resolve authentication timeout issue
   docs: update deployment guide
   ```

3. **Fill PR template**
   - Describe changes
   - Link to related issues
   - Add screenshots for UI changes
   - List breaking changes

### PR Review Process

1. **Automated checks**
   - CI/CD pipeline runs tests
   - Linter checks pass
   - Build succeeds

2. **Code review**
   - Reviewer provides feedback
   - Address requested changes
   - Iterate until approved

3. **Merge**
   - Squash commits if needed
   - Merge to main branch
   - Delete feature branch

---

## 🎯 Feature Contribution Guidelines

### Proposing New Features

1. **Discuss first**
   - Open an issue to discuss
   - Get feedback from maintainers
   - Avoid doing significant work without approval

2. **Create ADR**
   - Write Architectural Decision Record
   - Document rationale and alternatives
   - Get approval before implementation

3. **Implement**
   - Follow development guidelines
   - Add tests for new features
   - Update documentation

### Feature Checklist

- [ ] Feature discussed and approved
- [ ] ADR created (if applicable)
- [ ] Code follows style guidelines
- [ ] Tests added and passing
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] PR created with descriptive title
- [ ] PR template filled out
- [ ] Automated checks passing
- [ ] Code review completed

---

## 🚫 What Not to Do

### Don't
- Commit directly to main branch
- Skip tests or linter checks
- Ignore code review feedback
- Make breaking changes without discussion
- Commit sensitive data (API keys, passwords)
- Write unclear commit messages
- Skip documentation updates

### Always
- Use feature branches
- Follow commit message conventions
- Write tests for new code
- Update documentation
- Respond to review feedback
- Ask questions if unsure

---

## 📚 Resources

### Documentation
- [README.md](README.md) - Project overview
- [DOCS_INDEX.md](DOCS_INDEX.md) - Documentation index
- [TESTING.md](TESTING.md) - Testing guidelines
- [SECURITY.md](SECURITY.md) - Security best practices
- [PERFORMANCE.md](PERFORMANCE.md) - Performance guidelines

### Development Tools
- [scripts/dev.sh](scripts/dev.sh) - Development helper
- [scripts/setup.sh](scripts/setup.sh) - Setup script
- [scripts/verify-deployment.sh](scripts/verify-deployment.sh) - Deployment verification

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

---

## 🤝 Code of Conduct

### Be Respectful
- Treat everyone with respect
- Welcome newcomers and help them learn
- Focus on constructive feedback

### Be Collaborative
- Work together to solve problems
- Share knowledge and experience
- Consider different perspectives

### Be Professional
- Keep discussions focused and productive
- Acknowledge and learn from mistakes
- Support the project's goals

---

## 🆘 Getting Help

### Where to Ask
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Pull Requests**: Code changes and improvements

### Response Time
- Maintainers will respond as soon as possible
- Complex issues may take time to investigate
- Be patient and respectful

---

## 🎉 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in significant features

Thank you for contributing to ACM Media Platform! 🙏

---

**Last Updated**: 2026-04-07
**Maintained by**: CTO (78a41381-9fb6-4908-bd58-6ab26fca8d4e)