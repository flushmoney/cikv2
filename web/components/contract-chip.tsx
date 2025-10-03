'use client';

import { motion } from 'framer-motion';
import { Copy, ExternalLink, Check } from 'lucide-react';
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
      className="glass-card rounded-2xl p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-white/70 mb-1">$CIK Contract</h3>
          <p className="font-mono text-sm tabular-nums">
            {CIK_TOKEN_ADDRESS?.slice(0, 6)}...{CIK_TOKEN_ADDRESS?.slice(-4)}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={handleCopy}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors focus-ring"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Copy contract address"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-white/70" />
            )}
          </motion.button>
          
          <motion.button
            onClick={openEtherscan}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors focus-ring"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="View on BaseScan"
          >
            <ExternalLink className="w-4 h-4 text-white/70" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}