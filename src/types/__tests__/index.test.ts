import { PortSsaInputSchema, ConfigSchema } from '../index';

describe('Type Schemas', () => {
  describe('PortSsaInputSchema', () => {
    it('should validate valid Port SSA input with all fields', () => {
      const validInput = {
        properties: {
          name: 'test',
          value: 123,
        },
        context: {
          entity: 'entity1',
          blueprint: 'blueprint1',
          runId: 'run123',
        },
        payload: {
          key: 'value',
        },
      };

      const result = PortSsaInputSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should validate valid input with only properties', () => {
      const validInput = {
        properties: {
          name: 'test',
        },
      };

      const result = PortSsaInputSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should validate empty object', () => {
      const validInput = {};

      const result = PortSsaInputSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should allow nested properties', () => {
      const validInput = {
        properties: {
          nested: {
            deep: {
              value: 'test',
            },
          },
        },
      };

      const result = PortSsaInputSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should validate context structure', () => {
      const validInput = {
        context: {
          entity: 'entity1',
          blueprint: 'bp1',
          runId: 'run123',
        },
      };

      const result = PortSsaInputSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.context?.entity).toBe('entity1');
      }
    });
  });

  describe('ConfigSchema', () => {
    it('should validate valid config with all required fields', () => {
      const validConfig = {
        inputJson: 'input.json',
        templateFile: 'template.tfvars',
        outputFile: 'output.tfvars',
      };

      const result = ConfigSchema.safeParse(validConfig);
      expect(result.success).toBe(true);
    });

    it('should apply default values', () => {
      const config = {
        inputJson: 'input.json',
        templateFile: 'template.tfvars',
        outputFile: 'output.tfvars',
      };

      const result = ConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.strict).toBe(true); // Default value
      }
    });

    it('should allow overriding strict mode', () => {
      const config = {
        inputJson: 'input.json',
        templateFile: 'template.tfvars',
        outputFile: 'output.tfvars',
        strict: false,
      };

      const result = ConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.strict).toBe(false);
      }
    });

    it('should fail validation without required fields', () => {
      const invalidConfig = {
        inputJson: 'input.json',
        // missing templateFile and outputFile
      };

      const result = ConfigSchema.safeParse(invalidConfig);
      expect(result.success).toBe(false);
    });
  });
});

