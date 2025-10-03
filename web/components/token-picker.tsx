'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TOKENS } from '@/lib/contracts';
import { useBalances } from '@/hooks/useBalances';
import { cn } from '@/lib/utils';

interface TokenPickerProps {
  selectedToken: string;
  onSelectToken: (symbol: string) => void;
  className?: string;
}

export default function TokenPicker({
  selectedToken,
  onSelectToken,
  className
}: TokenPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { balances } = useBalances();

  const selectedTokenData = TOKENS.find(token => token.symbol === selectedToken);
  const selectedBalance = balances.find(balance => balance.symbol === selectedToken);

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="glass-card border-white/10 hover:border-white/20 w-full justify-between"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-bold">
              {selectedToken === 'ETH' ? 'Ξ' : selectedToken.slice(0, 1)}
            </span>
          </div>
          <div className="text-left">
            <p className="font-medium">{selectedToken}</p>
            <p className="text-xs text-white/50">
              {selectedBalance ? `${parseFloat(selectedBalance.formatted).toFixed(6)}` : '0.000000'}
            </p>
          </div>
        </div>
        <ChevronDown className={cn(
          'w-4 h-4 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </Button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 z-50"
        >
          <Card className="glass-card border-white/10 p-2">
            {TOKENS.map((token) => {
              const balance = balances.find(b => b.symbol === token.symbol);
              const isSelected = token.symbol === selectedToken;
              
              return (
                <Button
                  key={token.symbol}
                  variant="ghost"
                  onClick={() => {
                    onSelectToken(token.symbol);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full justify-between p-3 h-auto hover:bg-white/5',
                    isSelected && 'bg-white/5'
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold">
                        {token.symbol === 'ETH' ? 'Ξ' : token.symbol.slice(0, 1)}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{token.symbol}</p>
                      <p className="text-xs text-white/50">{token.name}</p>
                    </div>
                  </div>
                  
                  <div className="text-right flex items-center space-x-2">
                    <div>
                      <p className="text-sm font-mono tabular-nums">
                        {balance ? parseFloat(balance.formatted).toFixed(6) : '0.000000'}
                      </p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-primary" />}
                  </div>
                </Button>
              );
            })}
          </Card>
        </motion.div>
      )}
    </div>
  );
}