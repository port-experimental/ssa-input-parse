import { Command } from '@oclif/core';

/**
 * Index command - Entry point for the CLI
 * Displays help information when no command is specified
 */
export default class Index extends Command {
  static description = 'SSA Inputs Parser - Parse Port.io Self-Service Action JSON and generate TFVars files';

  async run(): Promise<void> {
    this.log('SSA Inputs Parser');
    this.log('=================\n');
    this.log('Enterprise-grade CLI tool to parse Port.io Self-Service Action JSON');
    this.log('and generate Terraform variable files from templates.\n');
    this.log('Usage:');
    this.log('  ssa-parser generate -i <input.json> -t <template.tfvars> -o <output.tfvars>\n');
    this.log('For more information, run:');
    this.log('  ssa-parser generate --help\n');
  }
}

