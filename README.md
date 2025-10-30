# SSA Inputs Parser

Enterprise-grade CLI tool to parse [Port.io](https://getport.io) Self-Service Action (SSA) JSON inputs and generate Terraform variable (TFVars) files using customizable templates.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

## Features

✨ **Template-Based Generation**: Use Handlebars templates to define your TFVars structure  
🔒 **Type-Safe**: Built with TypeScript and Zod for runtime validation  
📝 **Enterprise Logging**: Comprehensive logging using Winston  
🧪 **Test-Driven**: Developed with TDD principles, 80%+ code coverage  
🎯 **Port.io Integration**: Seamlessly parse Port.io Self-Service Action JSON payloads  
🚀 **CLI-First**: Built on Oclif for a robust command-line experience  
🔧 **Extensible**: Custom Handlebars helpers for advanced template logic

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [Template Syntax](#template-syntax)
- [Examples](#examples)
- [Development](#development)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Prerequisites

- Node.js >= 18.0.0
- pnpm (recommended) or npm

### Install Dependencies

```bash
pnpm install
```

### Build the Project

```bash
pnpm build
```

### Link for Local Development

```bash
pnpm link --global
```

## Quick Start

1. **Prepare your files**:
   - Port.io SSA JSON input file
   - TFVars template file

2. **Run the generator**:

```bash
ssa-parser generate \
  --input examples/port-ssa-input.json \
  --template examples/template.tfvars \
  --output generated.tfvars
```

3. **View the generated TFVars file**:

```bash
cat generated.tfvars
```

## Usage

### Basic Command

```bash
ssa-parser generate -i <input.json> -t <template.tfvars> -o <output.tfvars>
```

### Command Options

| Option | Alias | Description | Required | Default |
|--------|-------|-------------|----------|---------|
| `--input` | `-i` | Path to Port.io SSA JSON input file | Yes | - |
| `--template` | `-t` | Path to TFVars template file | Yes | - |
| `--output` | `-o` | Path to output TFVars file | Yes | - |
| `--strict` | - | Enable strict validation mode | No | `true` |
| `--no-strict` | - | Disable strict validation | No | - |
| `--verbose` | `-v` | Enable verbose logging | No | `false` |

### Examples

#### Generate with Default Settings

```bash
ssa-parser generate \
  -i input.json \
  -t template.tfvars \
  -o output.tfvars
```

#### Generate with Verbose Logging

```bash
ssa-parser generate \
  -i input.json \
  -t template.tfvars \
  -o output.tfvars \
  --verbose
```

#### Generate with Non-Strict Validation

```bash
ssa-parser generate \
  -i input.json \
  -t template.tfvars \
  -o output.tfvars \
  --no-strict
```

## Template Syntax

The tool uses [Handlebars](https://handlebarsjs.com/) as the templating engine with custom helpers.

### Basic Variable Substitution

```hcl
# Template
base_name = "{{properties.baseName}}"
location = "{{properties.location}}"

# With input:
{
  "properties": {
    "baseName": "production",
    "location": "us-east-1"
  }
}

# Output:
base_name = "production"
location = "us-east-1"
```

### Nested Properties

```hcl
# Template
key_vault_name = "{{properties.keyVault.name}}"
key_vault_rg = "{{properties.keyVault.resourceGroup}}"

# With input:
{
  "properties": {
    "keyVault": {
      "name": "my-vault",
      "resourceGroup": "vault-rg"
    }
  }
}

# Output:
key_vault_name = "my-vault"
key_vault_rg = "vault-rg"
```

### Flattened Access

For deeply nested properties, use the `flat` accessor:

```hcl
# Template
deep_value = "{{flat.properties.level1.level2.level3}}"

# With input:
{
  "properties": {
    "level1": {
      "level2": {
        "level3": "deep-value"
      }
    }
  }
}

# Output:
deep_value = "deep-value"
```

### Custom Helpers

#### `ifExists` - Conditional Rendering

```hcl
{{#ifExists properties.optionalField}}
optional_field = "{{properties.optionalField}}"
{{/ifExists}}
```

#### `lowercase` - Convert to Lowercase

```hcl
region = "{{lowercase properties.region}}"

# Input: "US-EAST-1" → Output: "us-east-1"
```

#### `uppercase` - Convert to Uppercase

```hcl
environment = "{{uppercase properties.environment}}"

# Input: "production" → Output: "PRODUCTION"
```

#### `eq` - Equality Check

```hcl
{{#if (eq properties.environment "production")}}
production_config = true
{{/if}}
```

## Examples

### Example 1: Simple Infrastructure Deployment

**Input JSON** (`examples/simple-input.json`):
```json
{
  "properties": {
    "environment": "production",
    "projectName": "my-app",
    "region": "us-west-2",
    "tags": {
      "team": "devops",
      "cost-center": "engineering"
    }
  }
}
```

**Template** (`examples/simple-template.tfvars`):
```hcl
environment = "{{properties.environment}}"
project_name = "{{properties.projectName}}"
region = "{{properties.region}}"

tags = {
  team = "{{properties.tags.team}}"
  cost_center = "{{properties.tags.cost-center}}"
}
```

**Generate**:
```bash
ssa-parser generate \
  -i examples/simple-input.json \
  -t examples/simple-template.tfvars \
  -o output.tfvars
```

### Example 2: Azure App Service (from template)

See the included `examples/port-ssa-input.json` and `examples/template.tfvars` for a comprehensive Azure App Service deployment example.

**Generate**:
```bash
ssa-parser generate \
  -i examples/port-ssa-input.json \
  -t examples/template.tfvars \
  -o azure-output.tfvars
```

## Development

### Project Structure

```
ssa-inputs-parser/
├── src/
│   ├── commands/          # Oclif CLI commands
│   │   ├── generate.ts    # Main generate command
│   │   └── index.ts       # Root command
│   ├── parser/            # Core parsing logic
│   │   ├── TFVarsParser.ts
│   │   └── __tests__/
│   ├── types/             # TypeScript types and schemas
│   │   ├── index.ts
│   │   └── __tests__/
│   ├── utils/             # Utility functions
│   │   ├── logger.ts
│   │   └── __tests__/
│   └── index.ts           # Main entry point
├── examples/              # Example files
├── bin/                   # CLI executables
├── dist/                  # Compiled output
└── logs/                  # Application logs
```

### Available Scripts

```bash
# Build the project
pnpm build

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Development mode
pnpm dev
```

### Setting Up Development Environment

1. **Clone the repository**:
```bash
git clone <repository-url>
cd ssa-inputs-parser
```

2. **Install dependencies**:
```bash
pnpm install
```

3. **Build the project**:
```bash
pnpm build
```

4. **Run tests**:
```bash
pnpm test
```

## Testing

The project follows Test-Driven Development (TDD) principles with comprehensive test coverage.

### Run All Tests

```bash
pnpm test
```

### Run Tests with Coverage

```bash
pnpm test:coverage
```

### Coverage Thresholds

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

### Test Structure

- Unit tests for each module
- Integration tests for end-to-end workflows
- Mocked file system and logger for isolated testing

### Example Test

```typescript
describe('TFVarsParser', () => {
  it('should parse valid JSON and generate TFVars', async () => {
    const parser = new TFVarsParser();
    const result = await parser.parse(
      'input.json',
      'template.tfvars',
      'output.tfvars'
    );
    expect(result.success).toBe(true);
  });
});
```

## API Documentation

### TFVarsParser Class

The main class for parsing and generating TFVars files.

#### Constructor

```typescript
new TFVarsParser(strict?: boolean)
```

- **strict** (optional): Enable strict validation mode. Default: `true`

#### Methods

##### `readInputJson(inputPath: string): Promise<PortSsaInput>`

Reads and validates the Port.io SSA JSON input file.

- **Parameters**:
  - `inputPath`: Path to the JSON input file
- **Returns**: Validated Port SSA input object
- **Throws**: Error if file cannot be read or validation fails

##### `readTemplate(templatePath: string): Promise<string>`

Reads the TFVars template file.

- **Parameters**:
  - `templatePath`: Path to the template file
- **Returns**: Template content as string
- **Throws**: Error if file cannot be read

##### `processTemplate(template: string, inputData: PortSsaInput): Promise<string>`

Processes the template with input data using Handlebars.

- **Parameters**:
  - `template`: Template string
  - `inputData`: Port SSA input data
- **Returns**: Processed template content

##### `writeOutput(outputPath: string, content: string): Promise<void>`

Writes the generated TFVars content to an output file.

- **Parameters**:
  - `outputPath`: Path to the output file
  - `content`: Content to write
- **Throws**: Error if file cannot be written

##### `parse(inputJsonPath: string, templatePath: string, outputPath: string): Promise<ParseResult>`

Main parsing method that orchestrates the entire process.

- **Parameters**:
  - `inputJsonPath`: Path to Port.io SSA JSON file
  - `templatePath`: Path to TFVars template file
  - `outputPath`: Path to output TFVars file
- **Returns**: Parse result with success status and details

### Logger

Winston-based logger with console and file transports.

```typescript
import { logger } from './utils/logger';

logger.info('Information message');
logger.error('Error message', { error: err });
logger.warn('Warning message');
logger.debug('Debug message');
```

### Types

#### PortSsaInput

```typescript
interface PortSsaInput {
  properties?: Record<string, unknown>;
  context?: {
    entity?: string;
    blueprint?: string;
    runId?: string;
  };
  payload?: Record<string, unknown>;
}
```

#### ParseResult

```typescript
interface ParseResult {
  success: boolean;
  outputFile?: string;
  error?: string;
  warnings?: string[];
}
```

## Port.io Integration

This tool is designed to work with [Port.io](https://getport.io) Self-Service Actions. Port.io provides a developer portal platform that allows you to create self-service actions for your infrastructure.

### Typical Workflow

1. **Configure Self-Service Action** in Port.io
2. **Trigger Action** from Port.io UI
3. **Receive JSON Payload** from Port.io webhook
4. **Run SSA Parser** to generate TFVars
5. **Execute Terraform** with generated TFVars
6. **Report Back** to Port.io

### Example Port.io Action Configuration

```json
{
  "identifier": "deploy-azure-app-service",
  "title": "Deploy Azure App Service",
  "icon": "Azure",
  "userInputs": {
    "properties": {
      "baseName": {
        "type": "string",
        "title": "Base Name"
      },
      "location": {
        "type": "string",
        "title": "Azure Region",
        "enum": ["Australia East", "US East", "EU West"]
      }
    }
  }
}
```

## Logging

The application uses Winston for structured logging with multiple transports:

- **Console**: Colored, formatted output for development
- **File (error.log)**: Error-level logs only
- **File (combined.log)**: All logs
- **File (exceptions.log)**: Unhandled exceptions
- **File (rejections.log)**: Unhandled promise rejections

### Log Levels

- `error`: Error messages
- `warn`: Warning messages
- `info`: Informational messages (default)
- `debug`: Debug messages (use `--verbose` flag)

### Log Files Location

```
logs/
├── error.log
├── combined.log
├── exceptions.log
└── rejections.log
```

## Best Practices

### Template Design

1. **Keep templates modular**: Break complex templates into sections
2. **Use comments**: Document template variables and logic
3. **Validate inputs**: Use `ifExists` helper for optional fields
4. **Flatten when needed**: Use `flat` accessor for deeply nested data

### Error Handling

1. **Validate JSON structure**: Ensure Port.io payload matches expected schema
2. **Test templates**: Run with sample data before production use
3. **Check logs**: Review logs for warnings and errors
4. **Use strict mode**: Enable for production deployments

### CI/CD Integration

```yaml
# Example GitHub Actions workflow
- name: Generate TFVars
  run: |
    ssa-parser generate \
      -i ${{ github.event.inputs.port_payload }} \
      -t templates/production.tfvars \
      -o generated.tfvars

- name: Terraform Apply
  run: |
    terraform init
    terraform apply -var-file=generated.tfvars -auto-approve
```

## Troubleshooting

### Common Issues

#### Issue: "Failed to read input JSON"

**Solution**: Verify the JSON file exists and is valid JSON. Use `--verbose` for detailed error messages.

#### Issue: "Template processing failed"

**Solution**: Check template syntax. Ensure all referenced properties exist in the input JSON or use `ifExists` helper.

#### Issue: "Permission denied writing output"

**Solution**: Ensure you have write permissions to the output directory.

### Debug Mode

Enable verbose logging to see detailed execution information:

```bash
ssa-parser generate -i input.json -t template.tfvars -o output.tfvars --verbose
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/my-feature`
3. **Write tests**: Maintain 80%+ coverage
4. **Follow TDD**: Write tests first, then implementation
5. **Lint your code**: `pnpm lint:fix`
6. **Run tests**: `pnpm test`
7. **Commit changes**: Use conventional commit messages
8. **Push to branch**: `git push origin feature/my-feature`
9. **Open Pull Request**

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## License

Apache License 2.0 - see LICENSE file for details

## Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/ssa-inputs-parser/issues)
- **Documentation**: [README.md](README.md)
- **Examples**: See `examples/` directory

## Roadmap

- [ ] Support for additional template engines (EJS, Jinja2)
- [ ] Built-in validation for Terraform syntax
- [ ] Interactive mode for template generation
- [ ] Support for multiple output formats (YAML, JSON)
- [ ] Integration with Port.io API for direct reporting
- [ ] Template marketplace/library

## Acknowledgments

- Built with [Oclif](https://oclif.io)
- Templating by [Handlebars](https://handlebarsjs.com/)
- Validation with [Zod](https://zod.dev)
- Logging with [Winston](https://github.com/winstonjs/winston)
- Inspired by [Port.io](https://getport.io) developer portal platform

---

Made with ❤️ for infrastructure automation

