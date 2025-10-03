'use client';

import { motion } from 'framer-motion';
import { X, ArrowRight, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface TransferDetails {
  to: string;
  amount: string;
  symbol: string;
  memo?: string;
  fee?: string;
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  details: TransferDetails;
  isLoading?: boolean;
}

export default function ReviewModal({
  isOpen,
  onClose,
  onConfirm,
  details,
  isLoading = false
}: ReviewModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <Card className="glass-card border-white/10 p-6 w-full max-w-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Review Transfer</h2>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="h-8 w-8 p-0"
              aria-label="Close review modal"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4 mb-6">
            {/* Amount */}
            <div className="text-center py-4">
              <p className="text-3xl font-bold tabular-nums">
                {details.amount} {details.symbol}
              </p>
            </div>

            {/* Recipient */}
            <div className="glass-card rounded-xl p-4">
              <p className="text-sm text-white/50 mb-1">To</p>
              <p className="font-mono text-sm">
                {details.to.startsWith('@') 
                  ? details.to 
                  : `${details.to.slice(0, 6)}...${details.to.slice(-4)}`
                }
              </p>
            </div>

            {/* Memo */}
            {details.memo && (
              <div className="glass-card rounded-xl p-4">
                <p className="text-sm text-white/50 mb-1">Memo</p>
                <p className="text-sm">{details.memo}</p>
              </div>
            )}

            {/* Fee */}
            <div className="glass-card rounded-xl p-4 flex justify-between">
              <span className="text-sm text-white/50">Network Fee</span>
              <span className="text-sm font-mono tabular-nums">
                {details.fee || '~0.001 ETH'}
              </span>
            </div>

            {/* Total */}
            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-white/50">You'll send</span>
                <span className="font-bold tabular-nums">
                  {details.amount} {details.symbol}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full glow-button"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                  Confirming...
                </>
              ) : (
                <>
                  Confirm Transfer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="w-full border-white/20"
            >
              Cancel
            </Button>
          </div>
        </Card>
      </motion.div>
    </>
  );
}