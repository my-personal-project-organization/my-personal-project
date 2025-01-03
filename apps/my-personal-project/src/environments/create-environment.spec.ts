/* eslint-disable @typescript-eslint/no-require-imports */

/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = require('fs');
const path = require('path');
const { createEnvironments } = require('./create-environments'); // Assuming you've exported the main function
// Mock the fs.writeFile function to avoid actual file writes during testing
jest.mock('fs', () => ({
  writeFile: jest.fn(),
}));

describe('create-environments', () => {
  afterEach(() => {
    // Reset the mock after each test
    fs.writeFile.mockClear();
  });

  it('should generate environment files correctly for local and prod', () => {
    // Arrange:  Set up environment variables (if any are used)  for testing purposes
    process.env['FIREBASE_API_KEY'] = 'test-api-key';
    process.env['FIREBASE_MESSAGING_SENDER_ID'] = 'test-sender-id';
    process.env['FIREBASE_APP_ID'] = 'test-app-id';
    process.env['FIREBASE_MEASUREMENT_ID'] = 'test-measurement-id';

    // Act: Call the function
    createEnvironments();

    // Assert: Check if writeFile was called with the correct parameters for each environment

    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join(__dirname, '../environments/environment.ts'),
      expect.stringContaining('local'),
      expect.any(Function),
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join(__dirname, '../environments/environment.prod.ts'),
      expect.stringContaining('prod'),
      expect.any(Function),
    );

    // Add more specific assertions to validate the content of generated files if needed.  For example, using toMatch
    expect(fs.writeFile.mock.calls[2][1]).toMatch('local');
    expect(fs.writeFile.mock.calls[3][1]).toMatch('prod');
    expect(fs.writeFile.mock.calls[2][1]).toMatch(
      process.env['FIREBASE_API_KEY'],
    );
    expect(fs.writeFile.mock.calls[3][1]).toMatch(
      process.env['FIREBASE_API_KEY'],
    );
  });

  it('should handle errors during file writing', () => {
    // Arrange: Mock writeFile to throw an error.
    const mockError = new Error('Test Error');
    fs.writeFile.mockImplementation((_: any, __: any, callback: any) =>
      callback(mockError),
    );

    // Act & Assert: Expect an error to be thrown.  Use a try/catch block if you need more details on the error
    expect(() => createEnvironments()).toThrow(mockError);
  });
});
