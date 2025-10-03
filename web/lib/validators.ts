import { isAddress as viemIsAddress } from 'viem';

export function isAddress(value: string): boolean {
  return viemIsAddress(value);
}

export function validAmount(
  input: string,
  decimals: number = 18
): { isValid: boolean; value?: bigint; error?: string } {
  if (!input || input.trim() === '') {
    return { isValid: false, error: 'Amount is required' };
  }

  const cleanInput = input.replace(/,/g, '');
  const num = parseFloat(cleanInput);

  if (isNaN(num)) {
    return { isValid: false, error: 'Invalid amount format' };
  }

  if (num <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' };
  }

  try {
    const value = BigInt(Math.floor(num * Math.pow(10, decimals)));
    return { isValid: true, value };
  } catch (error) {
    return { isValid: false, error: 'Amount too large' };
  }
}

export function formatAmount(
  amount: bigint,
  decimals: number = 18,
  displayDecimals: number = 6
): string {
  const divisor = BigInt(Math.pow(10, decimals));
  const quotient = amount / divisor;
  const remainder = amount % divisor;
  
  let result = quotient.toString();
  
  if (remainder > 0n) {
    const remainderStr = remainder.toString().padStart(decimals, '0');
    const trimmed = remainderStr.slice(0, displayDecimals).replace(/0+$/, '');
    if (trimmed) {
      result += '.' + trimmed;
    }
  }
  
  return result;
}

export function isValidHandle(handle: string): boolean {
  return handle.startsWith('@') && handle.length > 1 && /^@[a-zA-Z0-9_]+$/.test(handle);
}