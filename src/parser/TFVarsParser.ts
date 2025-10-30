import * as fs from 'fs/promises';
import * as path from 'path';
import Handlebars from 'handlebars';
import { logger } from '../utils/logger';
import { PortSsaInput, PortSsaInputSchema, ParseResult } from '../types';

/**
 * TFVarsParser class handles the parsing of Port.io SSA JSON
 * and generation of TFVars files using templates
 */
export class TFVarsParser {
  private readonly strict: boolean;

  /**
   * Creates a new TFVarsParser instance
   * @param strict - Enable strict validation mode
   */
  constructor(strict: boolean = true) {
    this.strict = strict;
    logger.info('TFVarsParser initialized', { strict: this.strict });
  }

  /**
   * Reads and validates the Port.io SSA JSON input file
   * @param inputPath - Path to the JSON input file
   * @returns Validated Port SSA input object
   * @throws Error if file cannot be read or validation fails
   */
  async readInputJson(inputPath: string): Promise<PortSsaInput> {
    logger.info('Reading input JSON file', { inputPath });

    try {
      const fileContent = await fs.readFile(inputPath, 'utf-8');
      const jsonData = JSON.parse(fileContent);

      // Validate against schema
      const validatedData = PortSsaInputSchema.parse(jsonData);
      logger.info('Input JSON validated successfully', { inputPath });

      return validatedData;
    } catch (error) {
      logger.error('Failed to read or validate input JSON', {
        inputPath,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new Error(`Failed to read input JSON from ${inputPath}: ${error}`);
    }
  }

  /**
   * Reads the TFVars template file
   * @param templatePath - Path to the template file
   * @returns Template content as string
   * @throws Error if file cannot be read
   */
  async readTemplate(templatePath: string): Promise<string> {
    logger.info('Reading template file', { templatePath });

    try {
      const templateContent = await fs.readFile(templatePath, 'utf-8');
      logger.info('Template file read successfully', { templatePath });
      return templateContent;
    } catch (error) {
      logger.error('Failed to read template file', {
        templatePath,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new Error(`Failed to read template from ${templatePath}: ${error}`);
    }
  }

  /**
   * Registers custom Handlebars helpers for template processing
   */
  private registerHelpers(): void {
    // Helper to check if a value exists
    Handlebars.registerHelper('ifExists', function (this: unknown, value: unknown, options: Handlebars.HelperOptions) {
      return value !== null && value !== undefined ? options.fn(this) : options.inverse(this);
    });

    // Helper to convert to lowercase
    Handlebars.registerHelper('lowercase', function (str: string) {
      return str ? str.toLowerCase() : '';
    });

    // Helper to convert to uppercase
    Handlebars.registerHelper('uppercase', function (str: string) {
      return str ? str.toUpperCase() : '';
    });

    // Helper for equality check
    Handlebars.registerHelper('eq', function (a: unknown, b: unknown) {
      return a === b;
    });

    logger.debug('Custom Handlebars helpers registered');
  }

  /**
   * Flattens nested JSON object into a single-level object with dot notation keys
   * @param obj - Object to flatten
   * @param prefix - Prefix for keys (used in recursion)
   * @returns Flattened object
   */
  private flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, unknown> {
    const flattened: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(flattened, this.flattenObject(value as Record<string, unknown>, newKey));
      } else {
        flattened[newKey] = value;
      }
    }

    return flattened;
  }

  /**
   * Processes the template with input data using Handlebars
   * @param template - Template string
   * @param inputData - Port SSA input data
   * @returns Processed template content
   */
  async processTemplate(template: string, inputData: PortSsaInput): Promise<string> {
    logger.info('Processing template with input data');

    try {
      this.registerHelpers();

      // Compile template
      const compiledTemplate = Handlebars.compile(template);

      // Flatten the input data for easier access in templates
      const flattenedData = this.flattenObject(inputData as Record<string, unknown>);

      // Create context with both original and flattened data
      const context = {
        ...inputData,
        flat: flattenedData,
      };

      // Process template
      const result = compiledTemplate(context);
      logger.info('Template processed successfully');

      return result;
    } catch (error) {
      logger.error('Failed to process template', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new Error(`Failed to process template: ${error}`);
    }
  }

  /**
   * Writes the generated TFVars content to an output file
   * @param outputPath - Path to the output file
   * @param content - Content to write
   * @throws Error if file cannot be written
   */
  async writeOutput(outputPath: string, content: string): Promise<void> {
    logger.info('Writing output file', { outputPath });

    try {
      // Ensure directory exists
      const directory = path.dirname(outputPath);
      await fs.mkdir(directory, { recursive: true });

      // Write file
      await fs.writeFile(outputPath, content, 'utf-8');
      logger.info('Output file written successfully', { outputPath });
    } catch (error) {
      logger.error('Failed to write output file', {
        outputPath,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new Error(`Failed to write output to ${outputPath}: ${error}`);
    }
  }

  /**
   * Main parsing method that orchestrates the entire process
   * @param inputJsonPath - Path to Port.io SSA JSON file
   * @param templatePath - Path to TFVars template file
   * @param outputPath - Path to output TFVars file
   * @returns Parse result with success status and details
   */
  async parse(
    inputJsonPath: string,
    templatePath: string,
    outputPath: string
  ): Promise<ParseResult> {
    logger.info('Starting TFVars parsing process', {
      inputJsonPath,
      templatePath,
      outputPath,
    });

    try {
      // Read input JSON
      const inputData = await this.readInputJson(inputJsonPath);

      // Read template
      const template = await this.readTemplate(templatePath);

      // Process template
      const output = await this.processTemplate(template, inputData);

      // Write output
      await this.writeOutput(outputPath, output);

      logger.info('TFVars parsing completed successfully', { outputPath });

      return {
        success: true,
        outputFile: outputPath,
      };
    } catch (error) {
      logger.error('TFVars parsing failed', {
        error: error instanceof Error ? error.message : String(error),
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

