import { z } from 'zod';

/**
 * Schema for Port.io Self-Service Action JSON input
 * This can be extended based on the actual structure of Port.io SSA payloads
 */
export const PortSsaInputSchema = z.object({
  properties: z.record(z.unknown()).optional(),
  context: z.object({
    entity: z.string().optional(),
    blueprint: z.string().optional(),
    runId: z.string().optional(),
  }).optional(),
  payload: z.record(z.unknown()).optional(),
});

export type PortSsaInput = z.infer<typeof PortSsaInputSchema>;

/**
 * Configuration schema for the parser
 */
export const ConfigSchema = z.object({
  inputJson: z.string().describe('Path to the Port.io SSA JSON file'),
  templateFile: z.string().describe('Path to the TFVars template file'),
  outputFile: z.string().describe('Path to the output TFVars file'),
  strict: z.boolean().optional().default(true).describe('Enable strict validation'),
});

export type Config = z.infer<typeof ConfigSchema>;

/**
 * Result of the parsing operation
 */
export interface ParseResult {
  success: boolean;
  outputFile?: string;
  error?: string;
  warnings?: string[];
}

