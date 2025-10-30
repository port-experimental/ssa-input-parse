# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       SSA Inputs Parser                         │
│                    Enterprise CLI Tool                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         INPUT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐        ┌──────────────────┐               │
│  │  Port.io SSA     │        │  TFVars          │               │
│  │  JSON Input      │        │  Template        │               │ 
│  │                  │        │                  │               │
│  │ • properties     │        │ • Handlebars     │               │
│  │ • context        │        │ • Variables      │               │
│  │ • payload        │        │ • Conditionals   │               │
│  └──────────────────┘        └──────────────────┘               │
│         │                             │                         │
│         └─────────────┬───────────────┘                         │
└───────────────────────┼─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CLI LAYER (Oclif)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Generate Command                           │    │
│  │  • Parse CLI arguments                                  │    │
│  │  • Validate inputs                                      │    │
│  │  • Handle errors                                        │    │
│  │  • Display progress                                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                        │                                        │
└────────────────────────┼────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VALIDATION LAYER (Zod)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐        ┌──────────────────┐               │
│  │ PortSsaInput     │        │  Config          │               │
│  │ Schema           │        │  Schema          │               │
│  │                  │        │                  │               │
│  │ • Type checking  │        │ • Option         │               │
│  │ • Structure      │        │   validation     │               │
│  │   validation     │        │ • Defaults       │               │
│  └──────────────────┘        └──────────────────┘               │
│         │                             │                         │
│         └─────────────┬───────────────┘                         │
└───────────────────────┼─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CORE PROCESSING LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              TFVarsParser                               │    │
│  │                                                         │    │
│  │  1. Read Input JSON    ──────────┐                      │    │
│  │                                   │                     │    │
│  │  2. Read Template       ──────────┤                     │    │
│  │                                   │                     │    │
│  │  3. Process Template    ──────────┤──► Parse Result     │    │
│  │     • Compile Handlebars          │                     │    │
│  │     • Register helpers            │                     │    │
│  │     • Flatten data                │                     │    │
│  │     • Execute template            │                     │    │
│  │                                   │                     │    │
│  │  4. Write Output       ──────────┘                      │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                        │                                        │
└────────────────────────┼────────────────────────────────────────┘
                         │
           ┌─────────────┴─────────────┐
           │                           │
           ▼                           ▼
┌──────────────────────┐    ┌──────────────────────┐
│  LOGGING LAYER       │    │  OUTPUT LAYER        │
│  (Winston)           │    │                      │
├──────────────────────┤    ├──────────────────────┤
│                      │    │                      │
│ • Console output     │    │  ┌────────────────┐  │
│ • File logs          │    │  │  Generated     │  │
│   - error.log        │    │  │  TFVars File   │  │
│   - combined.log     │    │  │                │  │
│   - exceptions.log   │    │  │ • Formatted    │  │ 
│   - rejections.log   │    │  │ • Valid        │  │
│ • Structured logging │    │  │ • Ready to use │  │
│ • Multi-level        │    │  └────────────────┘  │
│                      │    │                      │
└──────────────────────┘    └──────────────────────┘
```

## Data Flow

```
User Command
     │
     ├──> CLI Arguments (input, template, output)
     │
     ├──> Validation (Zod schemas)
     │
     ├──> Read Input JSON
     │         │
     │         ├──> Parse JSON
     │         └──> Validate against schema
     │
     ├──> Read Template
     │         │
     │         └──> Load Handlebars template
     │
     ├──> Process Template
     │         │
     │         ├──> Compile template
     │         ├──> Register custom helpers
     │         ├──> Flatten nested data
     │         └──> Execute template with data
     │
     ├──> Write Output
     │         │
     │         ├──> Create directory if needed
     │         └──> Write TFVars file
     │
     └──> Return Result
           │
           ├──> Success: Display output path
           └──> Error: Display error message
```

## Component Relationships

```
┌─────────────────────────────────────────────────────────┐
│                       Commands                          │
│  (CLI Interface - User Interaction)                     │
│                                                         │
│  • generate.ts  - Main command                         │
│  • index.ts     - Root command                         │
└─────────────────────┬───────────────────────────────────┘
                      │
                      │ uses
                      ▼
┌─────────────────────────────────────────────────────────┐
│                       Parser                            │
│  (Core Logic - Business Rules)                          │
│                                                         │
│  • TFVarsParser.ts - Main parser class                 │
│    - readInputJson()                                   │
│    - readTemplate()                                    │
│    - processTemplate()                                 │
│    - writeOutput()                                     │
│    - parse() [orchestrator]                            │
└─────────────────────┬───────────────────────────────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
         │ uses       │ uses       │ uses
         ▼            ▼            ▼
┌─────────────┐ ┌──────────┐ ┌──────────────┐
│   Types     │ │  Utils   │ │  External    │
│             │ │          │ │  Libraries   │
├─────────────┤ ├──────────┤ ├──────────────┤
│• Schemas    │ │• Logger  │ │• Handlebars  │
│• Interfaces │ │• Helpers │ │• Zod         │
│• Types      │ │          │ │• Winston     │
└─────────────┘ └──────────┘ └──────────────┘
```

## Template Processing Pipeline

```
Input JSON                    Template File
    │                              │
    ├──► Parse JSON                │
    │    Validate Schema            │
    │                               │
    └──────┬────────────────────────┘
           │
           ▼
    ┌──────────────┐
    │ Flatten Data │  ← Creates dot-notation access
    └──────┬───────┘
           │
           ▼
    ┌──────────────────┐
    │ Register Helpers │
    │                  │
    │ • ifExists       │
    │ • lowercase      │
    │ • uppercase      │
    │ • eq             │
    └──────┬───────────┘
           │
           ▼
    ┌──────────────────┐
    │ Compile Template │ ← Handlebars compilation
    └──────┬───────────┘
           │
           ▼
    ┌──────────────────┐
    │ Execute Template │ ← Replace placeholders
    └──────┬───────────┘
           │
           ▼
    Generated TFVars File
```

## Error Handling Flow

```
Operation
    │
    ├──> Try Operation
    │         │
    │         ├──> Success ──> Log Info ──> Continue
    │         │
    │         └──> Error
    │                │
    │                ├──> Catch Error
    │                │
    │                ├──> Log Error (Winston)
    │                │    • Console
    │                │    • error.log
    │                │    • combined.log
    │                │
    │                ├──> Create Error Result
    │                │    • success: false
    │                │    • error: message
    │                │
    │                └──> Return/Throw
    │                         │
    │                         ├──> CLI handles
    │                         │    • Display message
    │                         │    • Exit code 1
    │                         │
    │                         └──> User sees error
```

## Testing Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Test Suites                         │
└─────────────────────────────────────────────────────────┘
           │
           ├──> Parser Tests (TFVarsParser.test.ts)
           │    • Constructor tests
           │    • readInputJson tests
           │    • readTemplate tests
           │    • processTemplate tests
           │    • writeOutput tests
           │    • parse integration tests
           │    • Complex scenario tests
           │
           ├──> Type Tests (index.test.ts)
           │    • PortSsaInputSchema validation
           │    • ConfigSchema validation
           │    • Type inference tests
           │
           └──> Utils Tests (logger.test.ts)
                • Logger creation
                • Log level tests
                • Transport tests
                • Metadata tests

┌─────────────────────────────────────────────────────────┐
│                    Test Infrastructure                   │
└─────────────────────────────────────────────────────────┘
           │
           ├──> Jest Configuration
           │    • ts-jest preset
           │    • Coverage thresholds (80%)
           │    • Test environment
           │
           ├──> Mocking Strategy
           │    • fs/promises mocked
           │    • Logger mocked
           │    • Isolated unit tests
           │
           └──> Coverage Reports
                • HTML report
                • Console output
                • CI/CD integration
```

## Deployment Architecture

```
Development                Production
     │                          │
     ├──> Source Code           ├──> npm Package
     │    (src/)                │    (dist/)
     │                          │
     ├──> TypeScript            ├──> Compiled JS
     │                          │
     ├──> Tests                 ├──> No tests
     │    (jest)                │    (smaller size)
     │                          │
     └──> Build ────────────────┘
          (pnpm build)

User Environment
     │
     ├──> Install (pnpm install)
     │
     ├──> Link globally (optional)
     │    ssa-parser command
     │
     └──> Run CLI
          • ./bin/run.js
          • ssa-parser (if linked)
```

## Integration Points

```
┌──────────────────────────────────────────────────────┐
│                   Port.io Platform                    │
│                                                       │
│  User triggers Self-Service Action                   │
│       │                                               │
│       ├──> Generate JSON payload                     │
│       │                                               │
│       └──> Send to webhook/CI                        │
└───────────────────────┬──────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│                    CI/CD Pipeline                     │
│   (GitHub Actions / GitLab CI / Jenkins)             │
│                                                       │
│   1. Receive Port.io payload                         │
│   2. Save as JSON file                               │
│   3. Run SSA Parser                                  │
│   4. Generate TFVars                                 │
└───────────────────────┬──────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│                 SSA Inputs Parser                     │
│                                                       │
│   Parse JSON + Template → Generate TFVars            │
└───────────────────────┬──────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│                    Terraform                          │
│                                                       │
│   terraform apply -var-file=generated.tfvars         │
└───────────────────────┬──────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│              Infrastructure Deployed                  │
└──────────────────────────────────────────────────────┘
```

## Technology Stack Layers

```
┌─────────────────────────────────────────────────┐
│         Presentation Layer                      │
│  • Oclif (CLI Framework)                       │
│  • Colored console output                      │
│  • Progress indicators                         │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│         Business Logic Layer                    │
│  • TFVarsParser (core logic)                   │
│  • Template processing                         │
│  • Data transformation                         │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│         Data Access Layer                       │
│  • File system operations                      │
│  • JSON parsing                                │
│  • File writing                                │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│         Cross-Cutting Concerns                  │
│  • Logging (Winston)                           │
│  • Validation (Zod)                            │
│  • Error handling                              │
│  • Type safety (TypeScript)                    │
└─────────────────────────────────────────────────┘
```

## Key Design Patterns

1. **Command Pattern**: CLI commands encapsulate operations
2. **Strategy Pattern**: Template engine can be swapped
3. **Factory Pattern**: Logger creation
4. **Facade Pattern**: TFVarsParser simplifies complex operations
5. **Dependency Injection**: Logger and config passed to components

## Scalability Considerations

- **Modular architecture**: Easy to add new template engines
- **Plugin system**: Handlebars helpers are extensible
- **Async operations**: All I/O operations are async
- **Error isolation**: Errors don't crash the application
- **Testability**: Mocked dependencies for unit tests

