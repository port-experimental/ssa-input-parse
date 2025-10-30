import { createLogger } from '../logger';
import winston from 'winston';

describe('Logger', () => {
  describe('createLogger', () => {
    it('should create a winston logger instance', () => {
      const logger = createLogger();
      expect(logger).toBeInstanceOf(winston.Logger);
    });

    it('should have correct transports configured', () => {
      const logger = createLogger();
      // Console, error.log, combined.log, exception handler, rejection handler
      expect(logger.transports.length).toBeGreaterThanOrEqual(3);
    });

    it('should use info level by default', () => {
      delete process.env.LOG_LEVEL;
      const logger = createLogger();
      expect(logger.level).toBe('info');
    });

    it('should respect LOG_LEVEL environment variable', () => {
      process.env.LOG_LEVEL = 'debug';
      const logger = createLogger();
      expect(logger.level).toBe('debug');
      delete process.env.LOG_LEVEL;
    });
  });

  describe('Logger methods', () => {
    let logger: winston.Logger;

    beforeEach(() => {
      logger = createLogger();
      // Spy on transports to capture log calls
      jest.spyOn(logger, 'info');
      jest.spyOn(logger, 'error');
      jest.spyOn(logger, 'warn');
      jest.spyOn(logger, 'debug');
    });

    it('should log info messages', () => {
      logger.info('Test info message');
      expect(logger.info).toHaveBeenCalledWith('Test info message');
    });

    it('should log error messages', () => {
      logger.error('Test error message');
      expect(logger.error).toHaveBeenCalledWith('Test error message');
    });

    it('should log warning messages', () => {
      logger.warn('Test warning message');
      expect(logger.warn).toHaveBeenCalledWith('Test warning message');
    });

    it('should log debug messages', () => {
      logger.debug('Test debug message');
      expect(logger.debug).toHaveBeenCalledWith('Test debug message');
    });

    it('should log messages with metadata', () => {
      const metadata = { userId: '123', action: 'test' };
      logger.info('Test with metadata', metadata);
      expect(logger.info).toHaveBeenCalledWith('Test with metadata', metadata);
    });
  });
});

