'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import RecentTransfers from '@/components/recent-transfers';
import { MOCK_TRANSACTIONS } from '@/lib/mock';
import { useAccount } from 'wagmi';

export default function ActivityPage() {
  const { isConnected } = useAccount();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'sent' | 'received'>('all');

  const filteredTransactions = MOCK_TRANSACTIONS.filter(tx => {
    const matchesSearch = 
      tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.memo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterType === 'all' || 
      (filterType === 'sent' && true) || // All mock transactions are sent
      (filterType === 'received' && false);

    return matchesSearch && matchesFilter;
  });

  if (!isConnected) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
        <p className="text-white/70 mb-8">
          Please connect your wallet to view your transaction activity.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Activity</h1>
        <p className="text-white/70">Track all your $CIK transfers</p>
      </motion.div>

      {/* Filters */}
      <Card className="glass-card border-white/10 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
            <Input
              placeholder="Search by hash, address, or memo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass-card border-white/10 text-white placeholder:text-white/50 focus:border-primary focus:ring-primary"
            />
          </div>
          
          <div className="flex gap-2">
            {(['all', 'sent', 'received'] as const).map((type) => (
              <Button
                key={type}
                variant={filterType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType(type)}
                className={
                  filterType === type 
                    ? 'bg-primary text-primary-foreground' 
                    : 'border-white/20 hover:border-white/40'
                }
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card border-white/10 p-6 text-center">
            <p className="text-2xl font-bold tabular-nums">2</p>
            <p className="text-white/50 text-sm">Total Transfers</p>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card border-white/10 p-6 text-center">
            <p className="text-2xl font-bold tabular-nums">150.75</p>
            <p className="text-white/50 text-sm">$CIK Sent</p>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card border-white/10 p-6 text-center">
            <p className="text-2xl font-bold tabular-nums">1</p>
            <p className="text-white/50 text-sm">Pending</p>
          </Card>
        </motion.div>
      </div>

      {/* Transaction List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Transfers</h2>
          <Button
            variant="outline"
            size="sm"
            className="border-white/20"
            onClick={() => window.open('https://basescan.org', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View on BaseScan
          </Button>
        </div>
        
        {filteredTransactions.length > 0 ? (
          <RecentTransfers limit={filteredTransactions.length} />
        ) : (
          <Card className="glass-card border-white/10 p-12 text-center">
            <p className="text-white/50">No transactions found</p>
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="mt-2"
              >
                Clear search
              </Button>
            )}
          </Card>
        )}
      </motion.div>
    </div>
  );
}