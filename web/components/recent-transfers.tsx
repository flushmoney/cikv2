'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, Copy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusPill from './status-pill';
import { MOCK_TRANSACTIONS } from '@/lib/mock';
import { TxStatus } from '@/hooks/useTxStatus';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface RecentTransfersProps {
  limit?: number;
  className?: string;
}

export default function RecentTransfers({ limit = 5, className }: RecentTransfersProps) {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const transactions = MOCK_TRANSACTIONS.slice(0, limit);

  const handleCopyHash = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopiedHash(hash);
      setTimeout(() => setCopiedHash(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  if (transactions.length === 0) {
    return (
      <Card className={cn('glass-card border-white/10 p-6 text-center', className)}>
        <p className="text-white/50">No recent transfers</p>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {transactions.map((tx, index) => (
        <motion.div
          key={tx.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="glass-card border-white/10 p-4 hover:border-white/20 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-primary" />
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">
                      {tx.amount} {tx.symbol}
                    </p>
                    <StatusPill status={tx.status as TxStatus} />
                  </div>
                  
                  <p className="text-sm text-white/50">
                    To {tx.to} • {formatTime(tx.timestamp)}
                  </p>
                  
                  {tx.memo && (
                    <p className="text-xs text-white/40 mt-1">"{tx.memo}"</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="text-right text-sm text-white/50">
                  <p className="font-mono tabular-nums">
                    {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                  </p>
                </div>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopyHash(tx.hash)}
                  className="h-8 w-8 p-0"
                  aria-label="Copy transaction hash"
                >
                  {copiedHash === tx.hash ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center"
                    >
                      ✓
                    </motion.div>
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}