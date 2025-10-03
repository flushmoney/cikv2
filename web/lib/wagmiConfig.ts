'use client';

import { http } from 'viem';
import { base, baseSepolia } from 'wagmi/chains';
import { createConfig } from 'wagmi';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 8453);
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.base.org';
const WC_PROJECT_ID = process.env.NEXT_PUBLIC_WC_PROJECT_ID || '';

export const chains = [base, baseSepolia] as const;

export const transports = {
  [base.id]: http(RPC_URL),
  [baseSepolia.id]: http(), // ok for testing if you switch chain id to 84532
} as const;

export const wagmiConfig = createConfig({
  chains,
  transports,
  ssr: true,
  connectors: [
    // Use injected instead of metaMask() to avoid the RN SDK dependency.
    injected({ shimDisconnect: true }),

    walletConnect({
      projectId: WC_PROJECT_ID,
      showQrModal: true, // RainbowKit's modal will open
    }),

    coinbaseWallet({
      appName: 'CIK Transfer Bot',
    }),
  ],
});

export const defaultChain = CHAIN_ID === baseSepolia.id ? baseSepolia : base;
