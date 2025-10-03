'use client';

import { motion } from 'framer-motion';
import { X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MOCK_CONTACTS } from '@/lib/mock';

interface ContactsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContact: (address: string, handle: string) => void;
}

export default function ContactsDrawer({
  isOpen,
  onClose,
  onSelectContact
}: ContactsDrawerProps) {
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

      {/* Drawer */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-white/10"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Contacts</h2>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="h-8 w-8 p-0"
              aria-label="Close contacts"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {MOCK_CONTACTS.map((contact) => (
              <motion.div
                key={contact.address}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className="glass-card border-white/10 p-4 cursor-pointer hover:border-white/20 transition-colors"
                  onClick={() => {
                    onSelectContact(contact.address, contact.handle);
                    onClose();
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-white/50">{contact.handle}</p>
                      <p className="text-xs text-white/30 font-mono tabular-nums">
                        {contact.address.slice(0, 6)}...{contact.address.slice(-4)}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}