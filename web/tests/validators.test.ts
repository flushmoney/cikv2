import { describe, it, expect } from 'vitest';
import { isAddress, validAmount, formatAmount, isValidHandle } from '@/lib/validators';

describe('validators', () => {
  describe('isAddress', () => {
    it('validates Ethereum addresses correctly', () => {
      expect(isAddress('0x1234567890123456789012345678901234567890')).toBe(true);
      expect(isAddress('0x0000000000000000000000000000000000000000')).toBe(true);
      expect(isAddress('invalid-address')).toBe(false);
      expect(isAddress('0x123')).toBe(false);
      expect(isAddress('')).toBe(false);
    });
  });

  describe('validAmount', () => {
    it('validates positive amounts', () => {
      const result = validAmount('100', 18);
      expect(result.isValid).toBe(true);
      expect(result.value).toBeDefined();
    });

    it('rejects negative amounts', () => {
      const result = validAmount('-100', 18);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('greater than 0');
    });

    it('rejects zero amounts', () => {
      const result = validAmount('0', 18);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('greater than 0');
    });

    it('rejects empty amounts', () => {
      const result = validAmount('', 18);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('handles decimal amounts', () => {
      const result = validAmount('100.5', 18);
      expect(result.isValid).toBe(true);
      expect(result.value).toBeDefined();
    });
  });

  describe('formatAmount', () => {
    it('formats amounts correctly', () => {
      const amount = BigInt('1000000000000000000'); // 1 token with 18 decimals
      expect(formatAmount(amount, 18)).toBe('1');
    });

    it('handles decimal places', () => {
      const amount = BigInt('1500000000000000000'); // 1.5 tokens
      expect(formatAmount(amount, 18)).toBe('1.5');
    });
  });

  describe('isValidHandle', () => {
    it('validates handles correctly', () => {
      expect(isValidHandle('@adi')).toBe(true);
      expect(isValidHandle('@user123')).toBe(true);
      expect(isValidHandle('adi')).toBe(false);
      expect(isValidHandle('@')).toBe(false);
      expect(isValidHandle('@user-name')).toBe(false);
      expect(isValidHandle('')).toBe(false);
    });
  });
});