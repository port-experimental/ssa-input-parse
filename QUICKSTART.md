# Quick Start Guide

Get started with SSA Inputs Parser in 5 minutes!

## Installation

### Step 1: Install Dependencies

```bash
pnpm install
```

### Step 2: Build the Project

```bash
pnpm build
```

### Step 3: Link CLI Globally (Optional)

```bash
pnpm link --global
```

Or use it directly:

```bash
./bin/run.js generate --help
```

## Your First TFVars Generation

### 1. Create an Input JSON File

Create `my-input.json`:

```json
{
  "properties": {
    "projectName": "my-awesome-app",
    "environment": "production",
    "region": "us-east-1"
  }
}
```

### 2. Create a Template File

Create `my-template.tfvars`:

```hcl
# Project Configuration
project_name = "{{properties.projectName}}"
environment  = "{{properties.environment}}"
region       = "{{properties.region}}"

# Generated metadata
# Timestamp: {{timestamp}}
```

### 3. Generate Your TFVars

```bash
ssa-parser generate \
  -i my-input.json \
  -t my-template.tfvars \
  -o my-output.tfvars
```

### 4. View the Result

```bash
cat my-output.tfvars
```

Output:
```hcl
# Project Configuration
project_name = "my-awesome-app"
environment  = "production"
region       = "us-east-1"
```

## Try the Examples

The project includes ready-to-use examples:

### Simple Example

```bash
ssa-parser generate \
  -i examples/simple-input.json \
  -t examples/simple-template.tfvars \
  -o output/simple.tfvars
```

### Azure App Service Example

```bash
ssa-parser generate \
  -i examples/port-ssa-input.json \
  -t examples/template.tfvars \
  -o output/azure.tfvars
```

## Development Workflow

### Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

### Lint Code

```bash
# Check for linting errors
pnpm lint

# Auto-fix linting issues
pnpm lint:fix
```

### Development Mode

Make changes and rebuild:

```bash
# Make your changes in src/
# Then rebuild
pnpm build

# Test your changes
./bin/run.js generate -i input.json -t template.tfvars -o output.tfvars
```

## CLI Options Reference

| Flag | Alias | Description |
|------|-------|-------------|
| `--input` | `-i` | Input JSON file path |
| `--template` | `-t` | Template file path |
| `--output` | `-o` | Output file path |
| `--verbose` | `-v` | Enable verbose logging |
| `--strict` | - | Enable strict validation (default) |
| `--no-strict` | - | Disable strict validation |
| `--help` | `-h` | Show help |

## Common Commands

```bash
# Show help
ssa-parser --help
ssa-parser generate --help

# Basic generation
ssa-parser generate -i input.json -t template.tfvars -o output.tfvars

# With verbose output
ssa-parser generate -i input.json -t template.tfvars -o output.tfvars --verbose

# Non-strict mode
ssa-parser generate -i input.json -t template.tfvars -o output.tfvars --no-strict
```

## Template Helpers

### Available Helpers

- `{{#ifExists value}}...{{/ifExists}}` - Conditional rendering
- `{{lowercase value}}` - Convert to lowercase
- `{{uppercase value}}` - Convert to uppercase
- `{{#if (eq a b)}}...{{/if}}` - Equality check

### Example Usage

```hcl
# Conditional
{{#ifExists properties.optional}}
optional_field = "{{properties.optional}}"
{{/ifExists}}

# Case conversion
region = "{{lowercase properties.region}}"

# Equality check
{{#if (eq properties.env "prod")}}
high_availability = true
{{/if}}
```

## Accessing Nested Data

### Direct Access

```hcl
name = "{{properties.database.name}}"
```

### Flattened Access (for deep nesting)

```hcl
value = "{{flat.properties.level1.level2.level3}}"
```

## Next Steps

1. **Read the full documentation**: [README.md](README.md)
2. **Learn advanced techniques**: [EXAMPLES.md](EXAMPLES.md)
3. **Explore the API**: [API.md](API.md)
4. **Contribute**: [CONTRIBUTING.md](CONTRIBUTING.md)

## Getting Help

- Check the [README.md](README.md) for detailed information
- Review [EXAMPLES.md](EXAMPLES.md) for more use cases
- Open an issue on GitHub for bugs or questions

## Common Issues

### "Command not found: ssa-parser"

**Solution**: Either link globally (`pnpm link --global`) or use direct path:

```bash
./bin/run.js generate -i input.json -t template.tfvars -o output.tfvars
```

### "Failed to read input JSON"

**Solution**: Check that the file exists and contains valid JSON:

```bash
cat input.json | jq .
```

### Template not rendering

**Solution**: Enable verbose mode to debug:

```bash
ssa-parser generate -i input.json -t template.tfvars -o output.tfvars --verbose
```

## Support

For issues, questions, or contributions, visit the GitHub repository.

Happy parsing! 🚀

