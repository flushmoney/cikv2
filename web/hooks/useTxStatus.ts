'use client';

import { useEffect, useState } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';

export type TxStatus = 'idle' | 'submitted' | 'confirming' | 'confirmed' | 'failed';

export function useTxStatus(hash?: `0x${string}`) {
  const [status, setStatus] = useState<TxStatus>('idle');

  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    hash,
    query: { enabled: !!hash },
  });

  useEffect(() => {
    if (!hash) return setStatus('idle');
    setStatus('submitted');
    if (isLoading) setStatus('confirming');
    if (isSuccess) setStatus('confirmed');
    if (isError) setStatus('failed');
  }, [hash, isLoading, isSuccess, isError]);

  return status;
}
