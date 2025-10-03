import { Address } from 'viem';

// Mock handle to address mapping
export const HANDLE_TO_ADDRESS: Record<string, Address> = {
  '@adi': '0x1234567890123456789012345678901234567890' as Address,
  '@umar': '0x2345678901234567890123456789012345678901' as Address,
  '@shad': '0x3456789012345678901234567890123456789012' as Address,
};

// Mock contacts
export const MOCK_CONTACTS = [
  { name: 'Adi', handle: '@adi', address: HANDLE_TO_ADDRESS['@adi'] },
  { name: 'Umar', handle: '@umar', address: HANDLE_TO_ADDRESS['@umar'] },
  { name: 'Shad', handle: '@shad', address: HANDLE_TO_ADDRESS['@shad'] },
];

// Mock transaction history
export const MOCK_TRANSACTIONS = [
  {
    id: '1',
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
    from: '0x1111111111111111111111111111111111111111' as Address,
    to: '@adi',
    amount: '100.5',
    symbol: 'CIK',
    status: 'confirmed' as const,
    timestamp: Date.now() - 300000,
    memo: 'Payment for services',
  },
  {
    id: '2',
    hash: '0x2345678901bcdef02345678901bcdef02345678901bcdef02345678901bcdef023',
    from: '0x1111111111111111111111111111111111111111' as Address,
    to: '@umar',
    amount: '50.25',
    symbol: 'CIK',
    status: 'submitted' as const,
    timestamp: Date.now() - 120000,
    memo: '',
  },
];