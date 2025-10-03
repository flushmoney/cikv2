'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Send } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AddressInput from '@/components/address-input';
import AmountPad from '@/components/amount-pad';
import TokenPicker from '@/components/token-picker';
import ContactsDrawer from '@/components/contacts-drawer';
import ReviewModal from '@/components/review-modal';
import SuccessModal from '@/components/success-modal';
import ErrorModal from '@/components/error-modal';
import { useAccount } from 'wagmi';
import { useBalances } from '@/hooks/useBalances';
import { useSendTransfer } from '@/hooks/useSendTransfer';
import { useResolveHandle } from '@/hooks/useResolveHandle';
import { validAmount } from '@/lib/validators';
import { TOKENS } from '@/lib/contracts';
import { Address } from 'viem';
import { resolveHandle, logTransfer } from '@/lib/api';

export default function TransferPage() {
  const { address: fromAddr, isConnected } = useAccount();
  const { balances } = useBalances();
  const { sendTransfer, isLoading: isSending } = useSendTransfer();

  // Form state
  const [selectedToken, setSelectedToken] = useState('CIK');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('0');
  const [memo, setMemo] = useState('');

  // Modal states
  const [showContacts, setShowContacts] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  const { address: resolvedAddress, error: resolveError } = useResolveHandle(toAddress);

  const selectedBalance = balances.find(b => b.symbol === selectedToken);
  const selectedTokenData = TOKENS.find(t => t.symbol === selectedToken);
  
  const amountValidation = validAmount(amount, selectedTokenData?.decimals || 18);
  const isOverBalance = selectedBalance && parseFloat(amount) > parseFloat(selectedBalance.formatted);

  const canProceed = 
    isConnected && 
    resolvedAddress && 
    !resolveError && 
    amountValidation.isValid && 
    !isOverBalance &&
    parseFloat(amount) > 0;

  const handleContactSelect = (address: string, handle: string) => {
    setToAddress(handle);
  };

  const handleReview = () => {
    if (!canProceed) return;
    setShowReview(true);
  };

  const handleConfirmTransfer = async () => {
  if (!selectedTokenData) return;

  try {
    // 1) resolve @handle → 0x address (backend)
    let toResolved: Address | null = null;

    if (toAddress.startsWith('@')) {
      toResolved = await resolveHandle(toAddress);
      if (!toResolved) throw new Error('Unknown handle');
    } else {
      toResolved = toAddress as Address;
    }

    // 2) send on-chain
    const hash = await sendTransfer({
      to: toResolved,
      amount,
      tokenAddress:
        selectedTokenData.address !== '0x0000000000000000000000000000000000000000'
          ? (selectedTokenData.address as Address)
          : undefined,
      tokenDecimals: selectedTokenData.decimals ?? 18,
      memo,
    });

    setTxHash(hash);
    setShowReview(false);
    setShowSuccess(true);

    // 3) log to backend (fire-and-forget)
    if (fromAddr) {
      logTransfer({
        hash,
        from_addr: fromAddr as Address,
        to: toResolved,
        token: selectedToken,
        amount,
        memo,
      }).catch(() => {});
    }
  } catch (err: any) {
    setError(err.message || 'Transfer failed');
    setShowReview(false);
    setShowError(true);
  }
};


  const resetForm = () => {
    setToAddress('');
    setAmount('0');
    setMemo('');
    setShowSuccess(false);
    setShowError(false);
    setTxHash('');
    setError('');
  };

  if (!isConnected) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
        <p className="text-white/70 mb-8">
          Please connect your wallet to start making transfers.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Send Tokens</h1>
        <p className="text-white/70">Transfer tokens with ease and confidence</p>
      </motion.div>

      <Card className="glass-card border-white/10 p-6 space-y-6">
        {/* From Section */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-white/70">From</label>
          <TokenPicker
            selectedToken={selectedToken}
            onSelectToken={setSelectedToken}
          />
        </div>

        <ArrowDown className="w-6 h-6 mx-auto text-white/50" />

        {/* To Section */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-white/70">To</label>
          <AddressInput
            value={toAddress}
            onChange={setToAddress}
            onContactsOpen={() => setShowContacts(true)}
          />
        </div>

        {/* Amount Section */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-white/70">Amount</label>
          <AmountPad
            value={amount}
            onChange={setAmount}
            decimals={selectedTokenData?.decimals}
            maxBalance={selectedBalance?.formatted}
          />
        </div>

        {/* Memo Section */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-white/70">Memo (optional)</label>
          <Textarea
            placeholder="Add a note to your transfer..."
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="glass-card border-white/10 text-white placeholder:text-white/50 focus:border-primary focus:ring-primary resize-none"
            rows={3}
          />
        </div>

        {/* Fee Preview */}
        <div className="glass-card rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Network Fee</span>
            <span className="font-mono tabular-nums">~0.001 ETH</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>You'll send</span>
            <span className="tabular-nums">{amount} {selectedToken}</span>
          </div>
        </div>

        {/* Send Button */}
        <Button
          onClick={handleReview}
          disabled={!canProceed}
          className="w-full glow-button"
          size="lg"
        >
          <Send className="w-4 h-4 mr-2" />
          Review & Send
        </Button>

        {/* Validation Messages */}
        {resolveError && (
          <p className="text-sm text-red-400 text-center">{resolveError}</p>
        )}
        {isOverBalance && (
          <p className="text-sm text-red-400 text-center">
            Amount exceeds available balance
          </p>
        )}
      </Card>

      {/* Modals */}
      <ContactsDrawer
        isOpen={showContacts}
        onClose={() => setShowContacts(false)}
        onSelectContact={handleContactSelect}
      />

      <ReviewModal
        isOpen={showReview}
        onClose={() => setShowReview(false)}
        onConfirm={handleConfirmTransfer}
        isLoading={isSending}
        details={{
          to: toAddress,
          amount,
          symbol: selectedToken,
          memo,
        }}
      />

      <SuccessModal
        isOpen={showSuccess}
        onClose={resetForm}
        txHash={txHash}
        amount={amount}
        symbol={selectedToken}
        to={toAddress}
      />

      <ErrorModal
        isOpen={showError}
        onClose={() => setShowError(false)}
        error={error}
        onRetry={handleReview}
      />
    </div>
  );
}