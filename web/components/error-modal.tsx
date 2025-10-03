'use client';

import { motion } from 'framer-motion';
import { X, TriangleAlert as AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  error: string;
  onRetry?: () => void;
}

export default function ErrorModal({
  isOpen,
  onClose,
  error,
  onRetry
}: ErrorModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <Card className="glass-card border-red-500/20 p-6 w-full max-w-md text-center">
          {/* Error Icon */}
          <motion.div
            className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </motion.div>

          <h2 className="text-2xl font-semibold mb-2 text-red-400">Transfer Failed</h2>
          
          <p className="text-white/70 mb-6 text-sm">
            {error || 'An unexpected error occurred. Please try again.'}
          </p>

          <div className="space-y-3">
            {onRetry && (
              <Button onClick={onRetry} className="w-full" size="lg">
                Try Again
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full border-white/20"
            >
              Close
            </Button>
          </div>
        </Card>
      </motion.div>
    </>
  );
}