'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Loader, Check, X, Clock } from 'lucide-react';
import { TxStatus } from '@/hooks/useTxStatus';
import { cn } from '@/lib/utils';

interface StatusPillProps {
  status: TxStatus;
  className?: string;
}

type PillConfig = {
  label: string;
  icon: LucideIcon;
  className: string;
  animate: boolean;
};

// Strongly type the map to your TxStatus union
const statusConfig: Record<TxStatus, PillConfig> = {
  idle: {
    label: 'Idle',
    icon: Clock,
    className: 'bg-white/5 text-white/50',
    animate: false,
  },
  submitted: {
    label: 'Submitted',
    icon: Loader,
    className: 'bg-blue-500/20 text-blue-400',
    animate: true,
  },
  confirming: {
    label: 'Confirming',
    icon: Loader,
    className: 'bg-yellow-500/20 text-yellow-400',
    animate: true,
  },
  confirmed: {
    label: 'Confirmed',
    icon: Check,
    className: 'bg-green-500/20 text-green-400',
    animate: false,
  },
  failed: {
    label: 'Failed',
    icon: X,
    className: 'bg-red-500/20 text-red-400',
    animate: false,
  },
};

export default function StatusPill({ status, className }: StatusPillProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      className={cn(
        'inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium',
        config.className,
        className,
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Icon className={cn('w-4 h-4', config.animate && 'animate-spin')} />
      <span>{config.label}</span>
    </motion.div>
  );
}
