import { TFVarsParser } from '../TFVarsParser';
import * as fs from 'fs/promises';

// Mock dependencies
jest.mock('fs/promises');
jest.mock('../../utils/logger');

const mockedFs = fs as jest.Mocked<typeof fs>;

describe('TFVarsParser', () => {
  let parser: TFVarsParser;

  beforeEach(() => {
    parser = new TFVarsParser(true);
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create an instance with strict mode enabled by default', () => {
      const strictParser = new TFVarsParser();
      expect(strictParser).toBeInstanceOf(TFVarsParser);
    });

    it('should create an instance with strict mode disabled', () => {
      const nonStrictParser = new TFVarsParser(false);
      expect(nonStrictParser).toBeInstanceOf(TFVarsParser);
    });
  });

  describe('readInputJson', () => {
    it('should successfully read and parse valid JSON input', async () => {
      const mockJson = {
        properties: { key: 'value' },
        context: { entity: 'test' },
      };

      mockedFs.readFile.mockResolvedValue(JSON.stringify(mockJson));

      const result = await parser.readInputJson('test.json');

      expect(result).toEqual(mockJson);
      expect(mockedFs.readFile).toHaveBeenCalledWith('test.json', 'utf-8');
    });

    it('should throw error for invalid JSON', async () => {
      mockedFs.readFile.mockResolvedValue('invalid json {');

      await expect(parser.readInputJson('test.json')).rejects.toThrow();
    });

    it('should throw error when file cannot be read', async () => {
      mockedFs.readFile.mockRejectedValue(new Error('File not found'));

      await expect(parser.readInputJson('nonexistent.json')).rejects.toThrow(
        /Failed to read input JSON/
      );
    });

    it('should validate JSON structure against schema', async () => {
      const validJson = {
        properties: { name: 'test', value: 123 },
        context: {
          entity: 'entity1',
          blueprint: 'bp1',
          runId: 'run123',
        },
      };

      mockedFs.readFile.mockResolvedValue(JSON.stringify(validJson));

      const result = await parser.readInputJson('test.json');

      expect(result).toHaveProperty('properties');
      expect(result).toHaveProperty('context');
    });
  });

  describe('readTemplate', () => {
    it('should successfully read template file', async () => {
      const mockTemplate = 'base_name = "{{properties.baseName}}"';
      mockedFs.readFile.mockResolvedValue(mockTemplate);

      const result = await parser.readTemplate('template.tfvars');

      expect(result).toBe(mockTemplate);
      expect(mockedFs.readFile).toHaveBeenCalledWith('template.tfvars', 'utf-8');
    });

    it('should throw error when template file cannot be read', async () => {
      mockedFs.readFile.mockRejectedValue(new Error('File not found'));

      await expect(parser.readTemplate('nonexistent.tfvars')).rejects.toThrow(
        /Failed to read template/
      );
    });
  });

  describe('processTemplate', () => {
    it('should process simple template with input data', async () => {
      const template = 'base_name = "{{properties.baseName}}"';
      const inputData = {
        properties: { baseName: 'test' },
      };

      const result = await parser.processTemplate(template, inputData);

      expect(result).toContain('base_name = "test"');
    });

    it('should process template with nested data', async () => {
      const template = 'entity = "{{context.entity}}"';
      const inputData = {
        context: { entity: 'myEntity' },
      };

      const result = await parser.processTemplate(template, inputData);

      expect(result).toContain('entity = "myEntity"');
    });

    it('should handle missing properties gracefully', async () => {
      const template = 'value = "{{properties.missing}}"';
      const inputData = {
        properties: {},
      };

      const result = await parser.processTemplate(template, inputData);

      expect(result).toContain('value = ""');
    });

    it('should support custom helpers - lowercase', async () => {
      const template = 'name = "{{lowercase properties.name}}"';
      const inputData = {
        properties: { name: 'TEST' },
      };

      const result = await parser.processTemplate(template, inputData);

      expect(result).toContain('name = "test"');
    });

    it('should support custom helpers - uppercase', async () => {
      const template = 'name = "{{uppercase properties.name}}"';
      const inputData = {
        properties: { name: 'test' },
      };

      const result = await parser.processTemplate(template, inputData);

      expect(result).toContain('name = "TEST"');
    });

    it('should support ifExists helper', async () => {
      const template = '{{#ifExists properties.value}}value = "{{properties.value}}"{{/ifExists}}';
      const inputData = {
        properties: { value: 'exists' },
      };

      const result = await parser.processTemplate(template, inputData);

      expect(result).toContain('value = "exists"');
    });

    it('should support flattened data access', async () => {
      const template = 'nested_value = "{{properties.nested.deep}}"';
      const inputData = {
        properties: { nested: { deep: 'value' } },
      };

      const result = await parser.processTemplate(template, inputData);

      expect(result).toContain('nested_value = "value"');
    });
  });

  describe('writeOutput', () => {
    it('should successfully write output file', async () => {
      mockedFs.mkdir.mockResolvedValue(undefined);
      mockedFs.writeFile.mockResolvedValue(undefined);

      const content = 'base_name = "test"';
      await parser.writeOutput('output/test.tfvars', content);

      expect(mockedFs.mkdir).toHaveBeenCalledWith('output', { recursive: true });
      expect(mockedFs.writeFile).toHaveBeenCalledWith(
        'output/test.tfvars',
        content,
        'utf-8'
      );
    });

    it('should create directory if it does not exist', async () => {
      mockedFs.mkdir.mockResolvedValue(undefined);
      mockedFs.writeFile.mockResolvedValue(undefined);

      await parser.writeOutput('new/dir/output.tfvars', 'content');

      expect(mockedFs.mkdir).toHaveBeenCalledWith('new/dir', { recursive: true });
    });

    it('should throw error when file cannot be written', async () => {
      mockedFs.mkdir.mockResolvedValue(undefined);
      mockedFs.writeFile.mockRejectedValue(new Error('Permission denied'));

      await expect(parser.writeOutput('output.tfvars', 'content')).rejects.toThrow(
        /Failed to write output/
      );
    });
  });

  describe('parse', () => {
    it('should successfully complete full parsing workflow', async () => {
      const mockInputJson = {
        properties: { baseName: 'test' },
        context: { entity: 'entity1' },
      };
      const mockTemplate = 'base_name = "{{properties.baseName}}"';

      mockedFs.readFile
        .mockResolvedValueOnce(JSON.stringify(mockInputJson)) // Input JSON
        .mockResolvedValueOnce(mockTemplate); // Template

      mockedFs.mkdir.mockResolvedValue(undefined);
      mockedFs.writeFile.mockResolvedValue(undefined);

      const result = await parser.parse('input.json', 'template.tfvars', 'output.tfvars');

      expect(result.success).toBe(true);
      expect(result.outputFile).toBe('output.tfvars');
      expect(result.error).toBeUndefined();
    });

    it('should return error result when input reading fails', async () => {
      mockedFs.readFile.mockRejectedValue(new Error('File not found'));

      const result = await parser.parse('invalid.json', 'template.tfvars', 'output.tfvars');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.outputFile).toBeUndefined();
    });

    it('should return error result when template reading fails', async () => {
      const mockInputJson = { properties: {} };
      mockedFs.readFile
        .mockResolvedValueOnce(JSON.stringify(mockInputJson))
        .mockRejectedValueOnce(new Error('Template not found'));

      const result = await parser.parse('input.json', 'invalid.tfvars', 'output.tfvars');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should return error result when writing fails', async () => {
      const mockInputJson = { properties: { name: 'test' } };
      const mockTemplate = 'name = "{{properties.name}}"';

      mockedFs.readFile
        .mockResolvedValueOnce(JSON.stringify(mockInputJson))
        .mockResolvedValueOnce(mockTemplate);

      mockedFs.mkdir.mockResolvedValue(undefined);
      mockedFs.writeFile.mockRejectedValue(new Error('Write failed'));

      const result = await parser.parse('input.json', 'template.tfvars', 'output.tfvars');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Integration Tests', () => {
    it('should handle complex nested JSON with multiple template variables', async () => {
      const complexJson = {
        properties: {
          baseName: 'production',
          region: 'us-east-1',
          config: {
            instanceType: 't3.large',
            count: 3,
          },
        },
        context: {
          entity: 'app-service',
          blueprint: 'azure-app',
          runId: 'run-12345',
        },
      };

      const complexTemplate = `
base_name = "{{properties.baseName}}"
region = "{{properties.region}}"
instance_type = "{{properties.config.instanceType}}"
instance_count = {{properties.config.count}}
entity = "{{context.entity}}"
`;

      mockedFs.readFile
        .mockResolvedValueOnce(JSON.stringify(complexJson))
        .mockResolvedValueOnce(complexTemplate);

      mockedFs.mkdir.mockResolvedValue(undefined);
      mockedFs.writeFile.mockResolvedValue(undefined);

      const result = await parser.parse('input.json', 'template.tfvars', 'output.tfvars');

      expect(result.success).toBe(true);
      expect(mockedFs.writeFile).toHaveBeenCalled();

      const writtenContent = (mockedFs.writeFile.mock.calls[0][1] as string);
      expect(writtenContent).toContain('base_name = "production"');
      expect(writtenContent).toContain('region = "us-east-1"');
      expect(writtenContent).toContain('instance_type = "t3.large"');
      expect(writtenContent).toContain('instance_count = 3');
      expect(writtenContent).toContain('entity = "app-service"');
    });
  });
});

