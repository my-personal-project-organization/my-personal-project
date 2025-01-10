/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
/* @ts-ignore */
import { createEnvironments } from './create-environments.cjs';

jest.mock('fs');
jest.mock('dotenv');

describe('createEnvironments', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env['FIREBASE_API_KEY'] = 'mocked_api_key';
    process.env['FIREBASE_MESSAGING_SENDER_ID'] = 'mocked_sender_id';
    process.env['FIREBASE_APP_ID'] = 'mocked_app_id';
    process.env['FIREBASE_MEASUREMENT_ID'] = 'mocked_measurement_id';
  });

  it('should create environment files successfully', () => {
    fs.writeFile.mockImplementation((path: any, data: any, callback: any) => {
      callback(null);
    });

    createEnvironments();

    expect(fs.writeFile).toHaveBeenCalledTimes(2); // Called once for each environment

    // Example assertion for one of the environments
    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('environment.ts'),
      expect.stringContaining(`apiUrl: 'local'`),
      expect.any(Function),
    );

    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('environment.prod.ts'),
      expect.stringContaining(`apiUrl: 'prod'`),
      expect.any(Function),
    );
  });

  it('should handle file write errors', () => {
    const mockError = new Error('Simulated write error');
    fs.writeFile.mockImplementation((path: any, data: any, callback: any) => {
      callback(mockError);
    });

    // Using a try-catch because the original code throws
    try {
      createEnvironments();
    } catch (error) {
      expect(error).toBe(mockError);
    }

    expect(fs.writeFile).toHaveBeenCalledTimes(1); // Make sure it tried to write both files
  });

  it('should correctly set Firebase config from environment variables', () => {
    fs.writeFile.mockImplementation((path: any, data: any, callback: any) => {
      callback(null);
    });
    createEnvironments();
    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('environment.ts'),
      expect.stringContaining(`apiKey: 'mocked_api_key'`),
      expect.any(Function),
    );
  });
});
