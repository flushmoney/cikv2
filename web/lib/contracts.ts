import { Address } from 'viem';

export const CIK_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_CIK_TOKEN as Address;
export const CIK_DECIMALS = parseInt(process.env.NEXT_PUBLIC_CIK_DECIMALS || '18');
export const CIK_SYMBOL = process.env.NEXT_PUBLIC_CIK_SYMBOL || 'CIK';

export const ERC20_ABI = [
  {
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

export const TOKENS = [
  {
    address: CIK_TOKEN_ADDRESS,
    symbol: CIK_SYMBOL,
    decimals: CIK_DECIMALS,
    name: 'Christ is King',
  },
  {
    address: '0x0000000000000000000000000000000000000000' as Address,
    symbol: 'ETH',
    decimals: 18,
    name: 'Ethereum',
  }
];