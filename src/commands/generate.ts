import { Command, Flags } from '@oclif/core';
import * as path from 'path';
import { TFVarsParser } from '../parser/TFVarsParser';
import { logger } from '../utils/logger';

/**
 * Generate command - Main CLI command to parse Port.io SSA JSON and generate TFVars files
 * 
 * Usage:
 *   ssa-parser generate -i input.json -t template.tfvars -o output.tfvars
 * 
 * Example:
 *   ssa-parser generate \
 *     --input examples/port-ssa-input.json \
 *     --template examples/template.tfvars \
 *     --output generated.tfvars
 */
export default class Generate extends Command {
  static description = 'Parse Port.io Self-Service Action JSON and generate TFVars file from template';

  static examples = [
    {
      description: 'Generate TFVars file from Port.io SSA JSON input',
      command: '<%= config.bin %> <%= command.id %> -i input.json -t template.tfvars -o output.tfvars',
    },
    {
      description: 'Generate with verbose logging',
      command: '<%= config.bin %> <%= command.id %> -i input.json -t template.tfvars -o output.tfvars --verbose',
    },
    {
      description: 'Generate with non-strict validation',
      command: '<%= config.bin %> <%= command.id %> -i input.json -t template.tfvars -o output.tfvars --no-strict',
    },
  ];

  static flags = {
    input: Flags.string({
      char: 'i',
      description: 'Path to the Port.io Self-Service Action JSON input file',
      required: true,
    }),
    template: Flags.string({
      char: 't',
      description: 'Path to the TFVars template file',
      required: true,
    }),
    output: Flags.string({
      char: 'o',
      description: 'Path to the output TFVars file',
      required: true,
    }),
    strict: Flags.boolean({
      description: 'Enable strict validation mode',
      default: true,
      allowNo: true,
    }),
    verbose: Flags.boolean({
      char: 'v',
      description: 'Enable verbose logging',
      default: false,
    }),
  };

  /**
   * Runs the generate command
   */
  async run(): Promise<void> {
    let flags;
    
    try {
      const parsed = await this.parse(Generate);
      flags = parsed.flags;
    } catch (error) {
      // If parsing fails due to missing flags, show friendly error and help
      if (error instanceof Error && error.message.includes('Missing required flag')) {
        this.log('\n❌ Oops! You forgot to provide some required information.\n');
        this.log('The generate command requires three things:\n');
        this.log('  📄 --input     (-i)  Your Port.io SSA JSON input file');
        this.log('  📋 --template  (-t)  Your TFVars template file');
        this.log('  📝 --output    (-o)  Where to save the generated file\n');
        this.log('📖 Quick example:\n');
        this.log('  ssa-parser generate -i input.json -t template.tfvars -o output.tfvars\n');
        this.log('💡 Try one of our examples:\n');
        this.log('  ssa-parser generate \\');
        this.log('    -i examples/simple-input.json \\');
        this.log('    -t examples/simple-template.tfvars \\');
        this.log('    -o my-output.tfvars\n');
        this.log('📚 For more information, run: ssa-parser generate --help\n');
        process.exit(1);
      }
      throw error;
    }

    // Set log level based on verbose flag
    if (flags.verbose) {
      process.env.LOG_LEVEL = 'debug';
      logger.level = 'debug';
    }

    this.log('🚀 Starting TFVars generation...\n');

    // Resolve paths
    const inputPath = path.resolve(flags.input);
    const templatePath = path.resolve(flags.template);
    const outputPath = path.resolve(flags.output);

    this.log(`📄 Input JSON:    ${inputPath}`);
    this.log(`📋 Template:      ${templatePath}`);
    this.log(`📝 Output:        ${outputPath}`);
    this.log(`🔒 Strict mode:   ${flags.strict ? 'enabled' : 'disabled'}\n`);

    try {
      // Create parser instance
      const parser = new TFVarsParser(flags.strict);

      // Execute parsing
      const result = await parser.parse(inputPath, templatePath, outputPath);

      if (result.success) {
        this.log('✅ TFVars file generated successfully!');
        this.log(`📁 Output file: ${result.outputFile}\n`);

        if (result.warnings && result.warnings.length > 0) {
          this.warn('⚠️  Warnings:');
          for (const warning of result.warnings) {
            this.warn(`   - ${warning}`);
          }
          this.log('');
        }

        process.exit(0);
      } else {
        this.error(`❌ Failed to generate TFVars file: ${result.error}`);
      }
    } catch (error) {
      this.error(`❌ Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

