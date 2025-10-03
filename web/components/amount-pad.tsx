'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Backpack as Backspace } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { validAmount } from '@/lib/validators';
import { cn } from '@/lib/utils';

interface AmountPadProps {
  value: string;
  onChange: (value: string) => void;
  decimals?: number;
  maxBalance?: string;
  className?: string;
}

const keypadNumbers = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', 'backspace'],
];

export default function AmountPad({
  value,
  onChange,
  decimals = 18,
  maxBalance,
  className
}: AmountPadProps) {
  const [displayValue, setDisplayValue] = useState(value || '0');

  const handleKeyPress = (key: string) => {
    let newValue = displayValue;

    if (key === 'backspace') {
      newValue = displayValue.length > 1 ? displayValue.slice(0, -1) : '0';
    } else if (key === '.') {
      if (!displayValue.includes('.')) {
        newValue = displayValue + '.';
      }
    } else {
      newValue = displayValue === '0' ? key : displayValue + key;
    }

    // Validate the amount
    const validation = validAmount(newValue, decimals);
    
    // Don't allow invalid amounts, but allow intermediate states
    if (newValue === '0.' || newValue.endsWith('.') || validation.isValid) {
      setDisplayValue(newValue);
      onChange(newValue);
    }
  };

  const handleMaxClick = () => {
    if (maxBalance) {
      const maxValue = parseFloat(maxBalance).toString();
      setDisplayValue(maxValue);
      onChange(maxValue);
    }
  };

  const validation = validAmount(displayValue, decimals);
  const isOverBalance = maxBalance && parseFloat(displayValue) > parseFloat(maxBalance);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Display */}
      <div className="text-center">
        <motion.div
          className={cn(
            'text-6xl font-bold tabular-nums tracking-tight',
            !validation.isValid && displayValue !== '0.' && displayValue !== '' ? 'text-red-400' : 'text-white',
            isOverBalance && 'text-red-400'
          )}
          key={displayValue}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.1 }}
        >
          {displayValue || '0'}
        </motion.div>
        
        {maxBalance && (
          <div className="mt-2 flex items-center justify-center space-x-2">
            <span className="text-sm text-white/50">
              Balance: {parseFloat(maxBalance).toFixed(6)}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleMaxClick}
              className="h-6 px-2 text-xs border-white/20 hover:border-primary hover:text-primary"
            >
              MAX
            </Button>
          </div>
        )}
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        {keypadNumbers.flat().map((key, index) => (
          <motion.div key={key} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => handleKeyPress(key)}
              variant={key === 'backspace' ? 'outline' : 'ghost'}
              className={cn(
                'h-14 w-full text-xl font-medium glass-card border-white/10 hover:bg-white/10',
                key === 'backspace' && 'hover:bg-red-500/10 hover:border-red-500/20'
              )}
              aria-label={key === 'backspace' ? 'Backspace' : key}
            >
              {key === 'backspace' ? (
                <Backspace className="w-5 h-5" />
              ) : (
                key
              )}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}