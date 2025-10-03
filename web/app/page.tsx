'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Wallet, QrCode, FileText, Zap, Globe, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ContractChip from '@/components/contract-chip';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

const features = [
  {
    icon: Globe,
    title: 'Resolve @handle',
    description: 'Send to memorable handles instead of long addresses'
  },
  {
    icon: QrCode,
    title: 'QR Scan',
    description: 'Scan QR codes for instant address capture'
  },
  {
    icon: FileText,
    title: 'Memo Support',
    description: 'Add messages to your transfers'
  },
  {
    icon: Zap,
    title: 'Fee Preview',
    description: 'See exact costs before confirming'
  },
  {
    icon: Shield,
    title: 'Tx Timeline',
    description: 'Real-time transaction status updates'
  },
];

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div>
      <section className="relative pt-32 pb-24">
        <div className="grid lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
          <motion.div
            className="space-y-10"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-6">
              <h1 className="text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1]">
                CIK Transfer
                <span className="block gradient-text mt-3">Bot</span>
              </h1>
              <p className="text-2xl text-foreground/70 leading-relaxed font-light">
                Send $CIK tokens on Base chain with beautiful UX.
                Resolve handles, scan QR codes, and track transactions in real-time.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              {isConnected ? (
                <Link href="/transfer">
                  <Button variant="secondary" size="lg" className="text-base font-medium">
                    Start Transfer
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <ConnectButton.Custom>
                  {({ account, chain, openConnectModal, mounted }) => {
                    return (
                      <div
                        {...(!mounted && {
                          'aria-hidden': true,
                          style: {
                            opacity: 0,
                            pointerEvents: 'none',
                            userSelect: 'none',
                          },
                        })}
                      >
                        <Button
                          onClick={openConnectModal}
                          variant="secondary"
                          size="lg"
                          className="text-base font-medium"
                        >
                          <Wallet className="w-5 h-5 mr-2" />
                          Connect Wallet
                        </Button>
                      </div>
                    );
                  }}
                </ConnectButton.Custom>
              )}

              <Link href="/terminal">
                <Button variant="default" size="lg" className="text-base font-medium">
                  Try Terminal
                </Button>
              </Link>
            </div>

            <div className="pt-6">
              <ContractChip />
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <Image
                src="/cik/hero.png"
                alt="CIK Sacred Art"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-32 bg-gradient-to-b from-white to-primary/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">Powerful Features</h2>
            <p className="text-foreground/60 text-xl font-light">
              Built for the modern crypto experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Card className="p-10 h-full cursor-default hover:translate-x-[-2px] hover:translate-y-[-2px]">
                  <feature.icon className="w-12 h-12 text-primary mb-6" />
                  <h3 className="font-bold text-xl mb-4">{feature.title}</h3>
                  <p className="text-foreground/60 leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="text-center py-40 px-4">
        <motion.div
          className="space-y-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-6xl lg:text-7xl font-bold">Ready to Transfer?</h2>
          <p className="text-foreground/60 text-2xl max-w-3xl mx-auto leading-relaxed font-light">
            Experience the fastest and most intuitive way to send $CIK tokens on Base chain.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="text-base font-medium"
            >
              <Link href="https://christisking.io/whitepaper" target="_blank">
                Read Whitepaper
              </Link>
            </Button>

            <Button
              asChild
              variant="default"
              size="lg"
              className="text-base font-medium"
            >
              <Link href="https://christisking.io/buy" target="_blank">
                How to Buy $CIK
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}