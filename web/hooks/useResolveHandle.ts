'use client';

import { useState, useEffect } from 'react';
import { Address } from 'viem';
import { HANDLE_TO_ADDRESS } from '@/lib/mock';
import { isAddress, isValidHandle } from '@/lib/validators';

export interface ResolvedAddress {
  address: Address | null;
  isLoading: boolean;
  error: string | null;
  isHandle: boolean;
}

export function useResolveHandle(input: string): ResolvedAddress {
  const [result, setResult] = useState<ResolvedAddress>({
    address: null,
    isLoading: false,
    error: null,
    isHandle: false,
  });

  useEffect(() => {
    if (!input?.trim()) {
      setResult({
        address: null,
        isLoading: false,
        error: null,
        isHandle: false,
      });
      return;
    }

    const cleanInput = input.trim();

    // Check if it's a valid Ethereum address
    if (isAddress(cleanInput)) {
      setResult({
        address: cleanInput as Address,
        isLoading: false,
        error: null,
        isHandle: false,
      });
      return;
    }

    // Check if it's a handle
    if (isValidHandle(cleanInput)) {
      setResult(prev => ({ ...prev, isLoading: true, isHandle: true }));

      // Simulate async resolution
      setTimeout(() => {
        const resolvedAddress = HANDLE_TO_ADDRESS[cleanInput];
        if (resolvedAddress) {
          setResult({
            address: resolvedAddress,
            isLoading: false,
            error: null,
            isHandle: true,
          });
        } else {
          setResult({
            address: null,
            isLoading: false,
            error: 'Handle not found',
            isHandle: true,
          });
        }
      }, 500);

      return;
    }

    // Invalid input
    setResult({
      address: null,
      isLoading: false,
      error: 'Invalid address or handle',
      isHandle: false,
    });
  }, [input]);

  return result;
}