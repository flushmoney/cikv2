import '@testing-library/jest-dom';

// Mock wagmi hooks
vi.mock('wagmi', () => ({
  useAccount: () => ({ isConnected: false, address: undefined }),
  useBalance: () => ({ data: undefined }),
  useContractRead: () => ({ data: undefined }),
  useContractWrite: () => ({ writeAsync: vi.fn() }),
  useSendTransaction: () => ({ sendTransactionAsync: vi.fn() }),
  useWaitForTransaction: () => ({ 
    isLoading: false, 
    isSuccess: false, 
    isError: false 
  }),
}));

// Mock RainbowKit
vi.mock('@rainbow-me/rainbowkit', () => ({
  ConnectButton: {
    Custom: ({ children }: any) => children({
      account: null,
      chain: null,
      openConnectModal: vi.fn(),
      mounted: true,
    }),
  },
  RainbowKitProvider: ({ children }: any) => children,
  darkTheme: () => ({}),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button',
  },
}));