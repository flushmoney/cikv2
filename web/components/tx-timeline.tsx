'use client';

import { motion } from 'framer-motion';
import { Check, Clock, Loader } from 'lucide-react';
import { TxStatus } from '@/hooks/useTxStatus';
import { cn } from '@/lib/utils';

interface TxTimelineProps {
  status: TxStatus;
  className?: string;
}

const steps = [
  { id: 'submitted', label: 'Transaction Submitted', icon: Clock },
  { id: 'confirmed', label: 'Transaction Confirmed', icon: Check },
];

export default function TxTimeline({ status, className }: TxTimelineProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {steps.map((step, index) => {
        const isActive = 
          (step.id === 'submitted' && ['submitted', 'confirmed'].includes(status)) ||
          (step.id === 'confirmed' && status === 'confirmed');
        
        const isLoading = step.id === 'submitted' && status === 'submitted';
        const isCompleted = 
          (step.id === 'submitted' && status === 'confirmed') ||
          (step.id === 'confirmed' && status === 'confirmed');

        const Icon = isLoading ? Loader : step.icon;

        return (
          <motion.div
            key={step.id}
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center',
                isCompleted && 'bg-green-500/20',
                isLoading && 'bg-blue-500/20',
                !isActive && 'bg-white/5'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4',
                  isCompleted && 'text-green-400',
                  isLoading && 'text-blue-400 animate-spin',
                  !isActive && 'text-white/30'
                )}
              />
            </div>
            
            <div>
              <p
                className={cn(
                  'text-sm font-medium',
                  isActive ? 'text-white' : 'text-white/50'
                )}
              >
                {step.label}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}