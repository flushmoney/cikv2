'use client';

import { motion } from 'framer-motion';
import { Check, ExternalLink, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  txHash: string;
  amount: string;
  symbol: string;
  to: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  txHash,
  amount,
  symbol,
  to
}: SuccessModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(txHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const openBaseScan = () => {
    window.open(`https://basescan.org/tx/${txHash}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <Card className="glass-card border-white/10 p-6 w-full max-w-md text-center">
          {/* Success Icon */}
          <motion.div
            className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Check className="w-8 h-8 text-green-400" />
          </motion.div>

          <h2 className="text-2xl font-semibold mb-2">Transfer Successful!</h2>
          
          <p className="text-white/70 mb-6">
            Successfully sent <span className="font-bold tabular-nums">{amount} {symbol}</span> to{' '}
            <span className="font-mono">
              {to.startsWith('@') ? to : `${to.slice(0, 6)}...${to.slice(-4)}`}
            </span>
          </p>

          {/* Transaction Hash */}
          <div className="glass-card rounded-xl p-4 mb-6">
            <p className="text-sm text-white/50 mb-2">Transaction Hash</p>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm tabular-nums">
                {txHash.slice(0, 6)}...{txHash.slice(-4)}
              </span>
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopy}
                  className="h-8 w-8 p-0"
                  aria-label="Copy transaction hash"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={openBaseScan}
                  className="h-8 w-8 p-0"
                  aria-label="View on BaseScan"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <Button onClick={onClose} className="w-full" size="lg">
            Close
          </Button>
        </Card>
      </motion.div>
    </>
  );
}