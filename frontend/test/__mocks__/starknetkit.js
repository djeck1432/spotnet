module.exports = {
  connect: jest.fn(() =>
    Promise.resolve({
      address: '0xMockedAddress12345',
      chainId: 'mocked-chain-id',
    })
  ),

  disconnect: jest.fn(() => Promise.resolve(true)),

  getNetwork: jest.fn(() =>
    Promise.resolve({
      network: 'MockedNetwork',
      rpcUrl: 'https://mocked.rpc.url',
    })
  ),
};
