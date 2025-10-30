# Contributing to SSA Inputs Parser

Thank you for your interest in contributing to SSA Inputs Parser! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other contributors

## How to Contribute

### Reporting Bugs

When reporting bugs, please include:

1. **Description**: Clear and concise description of the bug
2. **Steps to Reproduce**: Detailed steps to reproduce the issue
3. **Expected Behavior**: What you expected to happen
4. **Actual Behavior**: What actually happened
5. **Environment**: OS, Node.js version, package version
6. **Logs**: Relevant log files or error messages

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

1. **Clear title**: Descriptive title for the enhancement
2. **Motivation**: Why this enhancement would be useful
3. **Proposed Solution**: How you envision the enhancement working
4. **Alternatives**: Any alternative solutions you've considered

### Pull Requests

1. **Fork the repository**
2. **Create a branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes**: Follow the coding standards
4. **Write tests**: Ensure your changes are covered by tests
5. **Update documentation**: Update README and inline comments
6. **Run tests**: `pnpm test`
7. **Run linter**: `pnpm lint:fix`
8. **Commit**: Use conventional commit messages
9. **Push**: `git push origin feature/your-feature-name`
10. **Open PR**: Create a pull request with a clear description

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 10.0.0

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/your-username/ssa-inputs-parser.git
cd ssa-inputs-parser

# Install dependencies
pnpm install

# Build the project
pnpm build

# Run tests
pnpm test

# Link for local testing
pnpm link --global
```

## Coding Standards

### TypeScript Guidelines

- Use TypeScript strict mode
- Provide type annotations for function parameters and return types
- Avoid `any` types unless absolutely necessary
- Use interfaces for object types
- Use enums for fixed sets of values

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at the end of statements
- Use descriptive variable names
- Keep functions small and focused

### Documentation

- Add JSDoc comments to all public functions and classes
- Include `@param` and `@returns` tags
- Provide usage examples in comments
- Update README.md for user-facing changes

### Testing

- Write unit tests for all new functions
- Maintain 80%+ code coverage
- Follow TDD: Write tests before implementation
- Use descriptive test names
- Group related tests in `describe` blocks

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvement
- **test**: Adding or correcting tests
- **chore**: Changes to build process or auxiliary tools

### Examples

```
feat(parser): add support for nested object flattening

- Implement flattenObject method
- Add tests for deeply nested objects
- Update documentation

Closes #123
```

```
fix(logger): correct timestamp format in file logs

The timestamp was not being formatted correctly in file logs.
Changed format to ISO 8601.
```

## Testing Guidelines

### Writing Tests

```typescript
describe('FeatureName', () => {
  describe('methodName', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = method(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test src/parser/__tests__/TFVarsParser.test.ts
```

## Project Structure

```
src/
├── commands/          # CLI commands
├── parser/            # Core parsing logic
├── types/             # TypeScript types and schemas
├── utils/             # Utility functions
└── index.ts           # Main entry point
```

## Release Process

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create a git tag: `git tag -a v1.0.0 -m "Release v1.0.0"`
4. Push tag: `git push origin v1.0.0`
5. Create GitHub release with release notes

## Questions?

If you have questions about contributing, please open an issue with the `question` label.

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.

