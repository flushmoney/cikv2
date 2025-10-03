'use client';

import { motion } from 'framer-motion';
import { Copy, ExternalLink, Check, Shield } from 'lucide-react';
import { useState } from 'react';
import { CIK_TOKEN_ADDRESS } from '@/lib/contracts';

export default function ContractChip() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CIK_TOKEN_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const openBaseScan = () => {
    window.open(`https://basescan.org/address/${CIK_TOKEN_ADDRESS}`, '_blank');
  };

  return (
    <motion.div
      className="holy-card rounded-2xl p-6 max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
              Sacred Contract
            </h3>
          </div>
          <p className="font-mono text-sm tabular-nums text-white/90">
            {CIK_TOKEN_ADDRESS?.slice(0, 6)}...{CIK_TOKEN_ADDRESS?.slice(-4)}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={handleCopy}
            className="p-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors focus-ring group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Copy contract address"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
            )}
          </motion.button>
          
          <motion.button
            onClick={openBaseScan}
            className="p-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors focus-ring group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="View on BaseScan"
          >
            <ExternalLink className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}