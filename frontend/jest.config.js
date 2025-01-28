module.exports = {
  setupFiles: ['./jest.setup.js'],
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.svg\\?react$': '<rootDir>/test/__mocks__/svgMock.js', // Add this line
    '\\.svg$': '<rootDir>/test/__mocks__/svgMock.js',
    '\\.css$': '<rootDir>/test/__mocks__/styleMock.js',
    '^src/(.*)$': ['<rootDir>/src/$1'],
  },
  transformIgnorePatterns: ['node_modules/(?!(axios|starknetkit)/)'],
  testEnvironment: 'jsdom',
};
