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
    <div className="space-y-24">
      <section className="relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                CIK Transfer
                <span className="block gradient-text mt-2">Bot</span>
              </h1>
              <p className="text-xl text-foreground/70 leading-relaxed">
                Send $CIK tokens on Base chain with beautiful UX.
                Resolve handles, scan QR codes, and track transactions in real-time.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {isConnected ? (
                <Link href="/transfer">
                  <Button size="lg" className="glow-button group bg-gradient-cik text-white hover:opacity-90 rounded-cik-sm px-8 py-6 text-base">
                    Start Transfer
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
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
                          size="lg"
                          className="glow-button group bg-gradient-cik text-white hover:opacity-90 rounded-cik-sm px-8 py-6 text-base"
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
                <Button variant="outline" size="lg" className="border-primary/30 text-primary hover:bg-primary/5 rounded-cik-sm px-8 py-6 text-base">
                  Try Terminal
                </Button>
              </Link>
            </div>

            <div className="pt-4">
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
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="space-y-12">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-foreground/60 text-lg">
            Built for the modern crypto experience
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <Card className="glass-card p-8 h-full group cursor-default">
                <feature.icon className="w-10 h-10 text-primary mb-5" />
                <h3 className="font-semibold text-lg mb-3">{feature.title}</h3>
                <p className="text-foreground/60 text-sm leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="text-center space-y-10 py-12">
        <motion.div
          className="space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-5xl font-bold">Ready to Transfer?</h2>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Experience the fastest and most intuitive way to send $CIK tokens on Base chain.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-cik text-white hover:opacity-90 rounded-cik-sm px-8 py-6 text-base shadow-cik-lg"
          >
            <Link href="https://christisking.io/whitepaper" target="_blank">
              Read Whitepaper
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="accent-button rounded-cik-sm px-8 py-6 text-base shadow-cik"
          >
            <Link href="https://christisking.io/buy" target="_blank">
              How to Buy $CIK
            </Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
}