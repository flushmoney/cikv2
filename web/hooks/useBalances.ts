'use client';

import { useEffect, useState } from 'react';
import { useAccount, useBalance, useContractRead } from 'wagmi';
import { CIK_TOKEN_ADDRESS, ERC20_ABI, TOKENS } from '@/lib/contracts';

export interface TokenBalance {
  symbol: string;
  balance: string;
  formatted: string;
  decimals: number;
  address?: string;
}

export function useBalances() {
  const { address, isConnected } = useAccount();
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ETH balance
  const { data: ethBalance } = useBalance({
    address,
    query: {
      enabled: isConnected,
    },
  });

  // CIK balance
  const { data: cikBalance } = useContractRead({
    address: CIK_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address,
    },
  });

  useEffect(() => {
    if (!isConnected || !address) {
      setBalances([]);
      return;
    }

    setIsLoading(true);
    
    const newBalances: TokenBalance[] = [];

    // Add ETH balance
    if (ethBalance) {
      newBalances.push({
        symbol: 'ETH',
        balance: ethBalance.value.toString(),
        formatted: ethBalance.formatted,
        decimals: 18,
      });
    }

    // Add CIK balance
    if (cikBalance) {
      const token = TOKENS.find(t => t.symbol === 'CIK');
      if (token) {
        const formatted = (Number(cikBalance) / Math.pow(10, token.decimals)).toFixed(6);
        newBalances.push({
          symbol: token.symbol,
          balance: cikBalance.toString(),
          formatted,
          decimals: token.decimals,
          address: token.address,
        });
      }
    }

    setBalances(newBalances);
    setIsLoading(false);
  }, [ethBalance, cikBalance, isConnected, address]);

  return { balances, isLoading };
}