module.exports = {
  setupFiles: ['./jest.setup.js'],
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest', // Using Babel for transforming JS, JSX, TS, and TSX
  },
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/test/__mocks__/svgMock.js',
    '\\.css$': '<rootDir>/test/__mocks__/styleMock.js',
    '^src/(.*)$': ['<rootDir>/src/$1'],
  },
  transformIgnorePatterns: [
          "node_modules/(?!(@starknet-react|starknet|eventemitter3|axios)/)"
  ],

  testEnvironment: 'jsdom', // Use node as the test environment
};
