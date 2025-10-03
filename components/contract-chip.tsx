'use client';

import { motion } from 'framer-motion';
import { Copy, ExternalLink, Check, Crown } from 'lucide-react';
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

  const openEtherscan = () => {
    window.open(`https://basescan.org/address/${CIK_TOKEN_ADDRESS}`, '_blank');
  };

  return (
    <motion.div
      className="glass-card sacred-border rounded-2xl p-6 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-primary">Sacred $CIK Contract</h3>
          </div>
          <p className="font-mono text-sm tabular-nums text-white/90 font-medium">
            {CIK_TOKEN_ADDRESS?.slice(0, 6)}...{CIK_TOKEN_ADDRESS?.slice(-4)}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={handleCopy}
            className="p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-all duration-200 focus-ring border border-primary/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Copy contract address"
          >
            {copied ? (
              <Check className="w-4 h-4 text-primary" />
            ) : (
              <Copy className="w-4 h-4 text-primary" />
            )}
          </motion.button>
          
          <motion.button
            onClick={openEtherscan}
            className="p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-all duration-200 focus-ring border border-primary/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="View on BaseScan"
          >
            <ExternalLink className="w-4 h-4 text-primary" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}