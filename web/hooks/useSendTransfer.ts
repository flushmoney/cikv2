'use client';

import { useState } from 'react';
import {
  useAccount,
  useWriteContract,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi';
import type { Address } from 'viem';
import { parseEther, parseUnits } from 'viem';
import { ERC20_ABI } from '@/lib/contracts';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as const;

export interface TransferParams {
  to: Address;
  amount: string;           // "1.23"
  tokenAddress?: Address;   // omit or ZERO_ADDRESS => native
  tokenDecimals?: number;   // default 18
  memo?: string;
}

export function useSendTransfer() {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  const { writeContractAsync } = useWriteContract();
  const { sendTransactionAsync } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess, isError } = useWaitForTransactionReceipt({
    hash: txHash ?? undefined,
    query: { enabled: !!txHash },
  });

  const sendTransfer = async (params: TransferParams): Promise<`0x${string}`> => {
    if (!address) throw new Error('Wallet not connected');
    setIsLoading(true);
    setTxHash(null);

    try {
      const isNative =
        !params.tokenAddress || params.tokenAddress.toLowerCase() === ZERO_ADDRESS.toLowerCase();

      let hash: `0x${string}`;

      if (isNative) {
        hash = await sendTransactionAsync({
          to: params.to,
          value: parseEther(params.amount),
          // chainId: 8453, // uncomment to force Base mainnet
        });
      } else {
        const decimals = params.tokenDecimals ?? 18;
        const value = parseUnits(params.amount, decimals);
        hash = await writeContractAsync({
          abi: ERC20_ABI,
          address: params.tokenAddress!,
          functionName: 'transfer',
          args: [params.to, value],
          // chainId: 8453,
        });
      }

      setTxHash(hash);
      return hash;
    } catch (e: any) {
      throw new Error(e?.shortMessage || e?.message || 'Transfer failed');
    } finally {
      setIsLoading(false);
    }
  };

  return { sendTransfer, isLoading, isConfirming, isSuccess, isError, txHash };
}
