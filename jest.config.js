// jest.config.js
module.exports = {
    preset: 'ts-jest', // Use ts-jest to transform TypeScript files
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.tsx?$': 'ts-jest', // Transform TypeScript files
    },
    moduleFileExtensions: ['ts', 'js', 'tsx', 'jsx'], // Recognize TypeScript and JavaScript files
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1', // If you use custom paths in tsconfig
    },
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    transformIgnorePatterns: [
      'node_modules/(?!@catcode/core-plugin)' 
    ]
  };