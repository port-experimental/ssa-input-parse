# API Documentation

## Table of Contents

- [TFVarsParser](#tfvarsparser)
- [Types](#types)
- [Logger](#logger)
- [CLI Commands](#cli-commands)

## TFVarsParser

The main class for parsing Port.io SSA JSON and generating TFVars files.

### Constructor

```typescript
constructor(strict?: boolean)
```

Creates a new TFVarsParser instance.

**Parameters:**
- `strict` (boolean, optional): Enable strict validation mode. Default: `true`

**Example:**
```typescript
import { TFVarsParser } from 'ssa-inputs-parser';

const parser = new TFVarsParser(true);
```

### Methods

#### readInputJson

```typescript
async readInputJson(inputPath: string): Promise<PortSsaInput>
```

Reads and validates the Port.io SSA JSON input file.

**Parameters:**
- `inputPath` (string): Path to the JSON input file

**Returns:**
- `Promise<PortSsaInput>`: Validated Port SSA input object

**Throws:**
- `Error`: If file cannot be read or validation fails

**Example:**
```typescript
const inputData = await parser.readInputJson('./input.json');
console.log(inputData.properties);
```

#### readTemplate

```typescript
async readTemplate(templatePath: string): Promise<string>
```

Reads the TFVars template file.

**Parameters:**
- `templatePath` (string): Path to the template file

**Returns:**
- `Promise<string>`: Template content as string

**Throws:**
- `Error`: If file cannot be read

**Example:**
```typescript
const template = await parser.readTemplate('./template.tfvars');
console.log(template);
```

#### processTemplate

```typescript
async processTemplate(template: string, inputData: PortSsaInput): Promise<string>
```

Processes the template with input data using Handlebars.

**Parameters:**
- `template` (string): Template string
- `inputData` (PortSsaInput): Port SSA input data

**Returns:**
- `Promise<string>`: Processed template content

**Throws:**
- `Error`: If template processing fails

**Example:**
```typescript
const template = await parser.readTemplate('./template.tfvars');
const inputData = await parser.readInputJson('./input.json');
const output = await parser.processTemplate(template, inputData);
```

#### writeOutput

```typescript
async writeOutput(outputPath: string, content: string): Promise<void>
```

Writes the generated TFVars content to an output file.

**Parameters:**
- `outputPath` (string): Path to the output file
- `content` (string): Content to write

**Throws:**
- `Error`: If file cannot be written

**Example:**
```typescript
await parser.writeOutput('./output.tfvars', generatedContent);
```

#### parse

```typescript
async parse(
  inputJsonPath: string,
  templatePath: string,
  outputPath: string
): Promise<ParseResult>
```

Main parsing method that orchestrates the entire process.

**Parameters:**
- `inputJsonPath` (string): Path to Port.io SSA JSON file
- `templatePath` (string): Path to TFVars template file
- `outputPath` (string): Path to output TFVars file

**Returns:**
- `Promise<ParseResult>`: Parse result with success status and details

**Example:**
```typescript
const result = await parser.parse(
  './input.json',
  './template.tfvars',
  './output.tfvars'
);

if (result.success) {
  console.log('Generated:', result.outputFile);
} else {
  console.error('Error:', result.error);
}
```

## Types

### PortSsaInput

Represents the structure of Port.io Self-Service Action JSON input.

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

**Properties:**
- `properties` (optional): User-defined properties from Port.io action
- `context` (optional): Context information about the action
  - `entity`: Entity identifier
  - `blueprint`: Blueprint identifier
  - `runId`: Run identifier
- `payload` (optional): Additional payload data

**Example:**
```typescript
const input: PortSsaInput = {
  properties: {
    name: 'my-app',
    region: 'us-east-1'
  },
  context: {
    entity: 'app-deployment',
    blueprint: 'azure-app',
    runId: 'run-123'
  }
};
```

### ParseResult

Represents the result of a parsing operation.

```typescript
interface ParseResult {
  success: boolean;
  outputFile?: string;
  error?: string;
  warnings?: string[];
}
```

**Properties:**
- `success`: Whether the parsing was successful
- `outputFile` (optional): Path to the generated output file
- `error` (optional): Error message if parsing failed
- `warnings` (optional): Array of warning messages

**Example:**
```typescript
const result: ParseResult = {
  success: true,
  outputFile: './output.tfvars'
};
```

### Config

Configuration options for the parser.

```typescript
interface Config {
  inputJson: string;
  templateFile: string;
  outputFile: string;
  strict?: boolean;
}
```

**Properties:**
- `inputJson`: Path to the Port.io SSA JSON file
- `templateFile`: Path to the TFVars template file
- `outputFile`: Path to the output TFVars file
- `strict` (optional): Enable strict validation (default: `true`)

## Logger

Winston-based logger with multiple transports.

### Usage

```typescript
import { logger } from 'ssa-inputs-parser';

logger.info('Information message');
logger.error('Error message', { error: err });
logger.warn('Warning message');
logger.debug('Debug message');
```

### Methods

#### info

```typescript
logger.info(message: string, metadata?: object): void
```

Logs an informational message.

**Example:**
```typescript
logger.info('Starting process', { inputFile: 'input.json' });
```

#### error

```typescript
logger.error(message: string, metadata?: object): void
```

Logs an error message.

**Example:**
```typescript
logger.error('Failed to read file', { 
  file: 'input.json',
  error: err.message 
});
```

#### warn

```typescript
logger.warn(message: string, metadata?: object): void
```

Logs a warning message.

**Example:**
```typescript
logger.warn('Using default value', { field: 'baseName' });
```

#### debug

```typescript
logger.debug(message: string, metadata?: object): void
```

Logs a debug message (only visible with verbose mode).

**Example:**
```typescript
logger.debug('Processing template', { template: 'app.tfvars' });
```

### Log Levels

- `error`: Error messages
- `warn`: Warning messages
- `info`: Informational messages (default)
- `debug`: Debug messages

### Environment Variables

- `LOG_LEVEL`: Set log level (default: `info`)

**Example:**
```bash
export LOG_LEVEL=debug
ssa-parser generate -i input.json -t template.tfvars -o output.tfvars
```

## CLI Commands

### generate

Parse Port.io Self-Service Action JSON and generate TFVars file from template.

#### Usage

```bash
ssa-parser generate -i <input> -t <template> -o <output> [options]
```

#### Flags

| Flag | Alias | Type | Required | Default | Description |
|------|-------|------|----------|---------|-------------|
| `--input` | `-i` | string | Yes | - | Path to Port.io SSA JSON input file |
| `--template` | `-t` | string | Yes | - | Path to TFVars template file |
| `--output` | `-o` | string | Yes | - | Path to output TFVars file |
| `--strict` | - | boolean | No | `true` | Enable strict validation mode |
| `--no-strict` | - | boolean | No | - | Disable strict validation |
| `--verbose` | `-v` | boolean | No | `false` | Enable verbose logging |

#### Examples

**Basic usage:**
```bash
ssa-parser generate -i input.json -t template.tfvars -o output.tfvars
```

**With verbose logging:**
```bash
ssa-parser generate -i input.json -t template.tfvars -o output.tfvars --verbose
```

**With non-strict validation:**
```bash
ssa-parser generate -i input.json -t template.tfvars -o output.tfvars --no-strict
```

#### Exit Codes

- `0`: Success
- `1`: Error occurred

## Handlebars Helpers

Custom helpers available in templates.

### ifExists

Conditionally render a block if a value exists.

**Syntax:**
```handlebars
{{#ifExists value}}
  <!-- Rendered if value is not null/undefined -->
{{/ifExists}}
```

**Example:**
```handlebars
{{#ifExists properties.optionalField}}
optional_field = "{{properties.optionalField}}"
{{/ifExists}}
```

### lowercase

Convert a string to lowercase.

**Syntax:**
```handlebars
{{lowercase value}}
```

**Example:**
```handlebars
region = "{{lowercase properties.region}}"
# Input: "US-EAST-1" → Output: "us-east-1"
```

### uppercase

Convert a string to uppercase.

**Syntax:**
```handlebars
{{uppercase value}}
```

**Example:**
```handlebars
environment = "{{uppercase properties.environment}}"
# Input: "production" → Output: "PRODUCTION"
```

### eq

Check if two values are equal.

**Syntax:**
```handlebars
{{#if (eq value1 value2)}}
  <!-- Rendered if values are equal -->
{{/if}}
```

**Example:**
```handlebars
{{#if (eq properties.environment "production")}}
production_config = true
{{/if}}
```

## Error Handling

All methods that can fail throw descriptive errors. Always use try-catch blocks:

```typescript
try {
  const result = await parser.parse(inputPath, templatePath, outputPath);
  if (result.success) {
    console.log('Success:', result.outputFile);
  } else {
    console.error('Error:', result.error);
  }
} catch (error) {
  console.error('Unexpected error:', error);
}
```

## TypeScript Support

The package is fully typed and exports all necessary types:

```typescript
import { 
  TFVarsParser,
  PortSsaInput,
  ParseResult,
  Config,
  logger 
} from 'ssa-inputs-parser';
```

