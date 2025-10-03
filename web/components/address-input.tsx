'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Users, Loader } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useResolveHandle } from '@/hooks/useResolveHandle';
import { cn } from '@/lib/utils';

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  onQrScan?: () => void;
  onContactsOpen?: () => void;
  className?: string;
}

export default function AddressInput({
  value,
  onChange,
  onQrScan,
  onContactsOpen,
  className
}: AddressInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const { address, isLoading, error, isHandle } = useResolveHandle(inputValue);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (address) {
      onChange(address);
    }
  }, [address, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (!newValue.trim()) {
      onChange('');
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="relative">
        <Input
          type="text"
          placeholder="Enter address or @handle"
          value={inputValue}
          onChange={handleInputChange}
          className={cn(
            'glass-card border-white/10 text-white placeholder:text-white/50 focus:border-primary focus:ring-primary pr-24',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            address && !error && 'border-green-500/50 focus:border-green-500 focus:ring-green-500'
          )}
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {isLoading && (
            <Loader className="w-4 h-4 text-white/50 animate-spin" />
          )}
          
          {onContactsOpen && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onContactsOpen}
              className="h-8 w-8 p-0 hover:bg-white/10"
              aria-label="Open contacts"
            >
              <Users className="w-4 h-4" />
            </Button>
          )}
          
          {onQrScan && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onQrScan}
              className="h-8 w-8 p-0 hover:bg-white/10"
              aria-label="Scan QR code"
            >
              <QrCode className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      
      {error && (
        <motion.p
          className="text-sm text-red-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}
      
      {address && !error && isHandle && (
        <motion.p
          className="text-sm text-green-400 font-mono tabular-nums"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          → {address.slice(0, 6)}...{address.slice(-4)}
        </motion.p>
      )}
    </div>
  );
}