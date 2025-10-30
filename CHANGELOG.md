# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-10-30

### Added
- Initial release of SSA Inputs Parser
- Core TFVarsParser class for parsing Port.io SSA JSON
- Handlebars template engine integration
- Custom Handlebars helpers: `ifExists`, `lowercase`, `uppercase`, `eq`
- CLI command `generate` for parsing and generating TFVars files
- Winston-based logging with console and file transports
- Zod schemas for input validation
- Comprehensive unit tests with 80%+ coverage
- Example files for Azure App Service and simple deployments
- Complete documentation (README, CONTRIBUTING)
- TypeScript support with strict mode
- ESLint configuration for code quality
- Jest configuration for testing
- Support for nested object flattening
- Verbose logging mode
- Strict/non-strict validation modes

### Features
- ✨ Template-based TFVars generation
- 🔒 Type-safe with TypeScript and Zod
- 📝 Enterprise-grade logging
- 🧪 Test-driven development
- 🎯 Port.io Self-Service Action integration
- 🚀 CLI-first with Oclif
- 🔧 Extensible with custom helpers

## [Unreleased]

### Planned
- Support for additional template engines (EJS, Jinja2)
- Built-in Terraform syntax validation
- Interactive mode for template generation
- Multiple output format support (YAML, JSON)
- Direct Port.io API integration
- Template marketplace/library

