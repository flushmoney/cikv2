'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Wallet, QrCode, FileText, Zap, Globe, Shield, Crown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ContractChip from '@/components/contract-chip';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

const features = [
  {
    icon: Crown,
    title: 'Resolve @handle',
    description: 'Send to blessed handles instead of long addresses'
  },
  {
    icon: QrCode,
    title: 'QR Scan',
    description: 'Divine QR scanning for instant address capture'
  },
  {
    icon: Star,
    title: 'Memo Support',
    description: 'Add sacred messages to your transfers'
  },
  {
    icon: Zap,
    title: 'Fee Preview',
    description: 'Divine cost revelation before confirmation'
  },
  {
    icon: Shield,
    title: 'Tx Timeline',
    description: 'Sacred transaction status revelations'
  },
];

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="space-y-20 relative">
      {/* Divine Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-gradient-to-r from-orange-400/10 to-yellow-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Hero Section */}
      <section className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-4">
              <h1 className="text-7xl font-black tracking-tight leading-none">
                <span className="hero-text">CIK Transfer</span>
                <span className="block hero-text text-6xl">Bot</span>
              </h1>
              <p className="text-xl text-white/80 leading-relaxed font-medium">
                Send blessed $CIK tokens on Base chain with divine UX. 
                Resolve sacred handles, scan holy QR codes, and witness transactions in real-time.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              {isConnected ? (
                <Link href="/transfer">
                  <Button size="lg" className="glow-button group px-8 py-4 text-lg font-bold sacred-border">
                    Start Transfer
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
                          className="glow-button group px-8 py-4 text-lg font-bold sacred-border"
                        >
                          <Wallet className="w-4 h-4 mr-2" />
                          Connect Wallet
                        </Button>
                      </div>
                    );
                  }}
                </ConnectButton.Custom>
              )}
              
              <Link href="/terminal">
                <Button variant="outline" size="lg" className="border-primary/30 text-primary hover:bg-primary/10 px-8 py-4 text-lg font-semibold">
                  Try Terminal
                </Button>
              </Link>
            </div>

            <div className="pt-6">
              <ContractChip />
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto divine-glow">
              <Image
                src="/cik/hero.png"
                alt="CIK Sacred Art"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="space-y-12 relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-4xl font-black mb-6 hero-text">Divine Features</h2>
          <p className="text-white/80 text-xl font-medium">
            Blessed tools for the sacred crypto experience
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
              <Card className="glass-card sacred-border p-8 h-full hover:shadow-2xl transition-all duration-300 group">
                <feature.icon className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg mb-3 text-primary">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-12 relative z-10">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-5xl font-black hero-text">Ready for Divine Transfer?</h2>
          <p className="text-white/80 text-xl max-w-3xl mx-auto font-medium leading-relaxed">
            Experience the most blessed and intuitive way to send sacred $CIK tokens on Base chain.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Button
            asChild
            size="lg"
            className="glow-button px-8 py-4 text-lg font-bold sacred-border"
          >
            <Link href="https://christisking.io/whitepaper" target="_blank">
              Sacred Whitepaper
            </Link>
          </Button>
          
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-primary/30 text-primary hover:bg-primary/10 px-8 py-4 text-lg font-semibold"
          >
            <Link href="https://christisking.io/buy" target="_blank">
              Acquire Sacred $CIK
            </Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
}