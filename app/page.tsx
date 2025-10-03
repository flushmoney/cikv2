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
  {
    icon: Crown,
    title: 'Divine Security',
    description: 'Protected by the highest authority'
  },
];

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Effects - matching christisking.io */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-radial from-yellow-400/10 to-transparent rounded-full blur-3xl animate-sacred-float" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gradient-radial from-orange-400/8 to-transparent rounded-full blur-3xl animate-sacred-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-yellow-500/5 to-transparent rounded-full blur-3xl animate-divine-glow" />
      </div>
      
      <div className="relative z-10 space-y-32 px-4 py-20">
        {/* Hero Section */}
        <section className="relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              {/* Content */}
              <motion.div
                className="space-y-10 text-center lg:text-left"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="space-y-8">
                  <motion.div
                    className="inline-flex items-center gap-3 px-4 py-2 rounded-full cik-card text-sm font-medium"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Crown className="w-4 h-4 text-yellow-400" />
                    <span className="cik-text">Christ is King</span>
                  </motion.div>
                  
                  <h1 className="cik-hero-title">
                    <span className="block text-white">CIK Fuck</span>
                    <span className="block cik-text">Bot</span>
                  </h1>
                  
                  <p className="text-xl text-white/70 leading-relaxed max-w-2xl text-balance font-light">
                    Send $CIK tokens on Base chain with fucking UX. 
                    Resolve handles, scan QR codes, and track transactions with heavenly precision.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  {isConnected ? (
                    <Link href="/transfer">
                      <Button size="lg" className="cik-button px-8 py-4 text-base font-bold rounded-lg">
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
                              size="lg"
                              className="cik-button px-8 py-4 text-base font-bold rounded-lg"
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
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="border-yellow-400/20 text-yellow-400 hover:bg-yellow-400/5 px-8 py-4 text-base font-medium rounded-lg cik-glow"
                    >
                      Try Terminal
                    </Button>
                  </Link>
                </div>

                <motion.div
                  className="pt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <ContractChip />
                </motion.div>
              </motion.div>

              {/* Hero Image */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="relative w-full aspect-square max-w-lg mx-auto">
                  <div className="absolute inset-0 bg-gradient-radial from-yellow-400/20 via-orange-400/10 to-transparent rounded-full animate-holy-pulse" />
                  <Image
                    src="/cik/hero.png"
                    alt="CIK Sacred Art - Christ is King"
                    fill
                    className="object-contain relative z-10 animate-sacred-float"
                    priority
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-7xl mx-auto space-y-20">
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="cik-display-title">
              <span className="cik-text">Divine Features</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto text-balance font-light">
              Built with heavenly precision for the faithful
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <Card className="cik-card p-8 h-full hover:border-yellow-400/20 transition-all duration-300 group rounded-xl">
                  <div className="space-y-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <feature.icon className="w-6 h-6 text-black" />
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-white/60 leading-relaxed font-light">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto text-center space-y-16">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="cik-display-title">
              Ready for <span className="cik-text">Divine Transfer?</span>
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto text-balance font-light">
              Experience the most blessed way to send $CIK tokens on Base chain. 
              Join the faithful in spreading the word through divine transactions.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Button
              asChild
              size="lg"
              className="cik-button px-8 py-4 text-base font-bold rounded-lg"
            >
              <Link href="https://christisking.io/whitepaper" target="_blank">
                Read Whitepaper
              </Link>
            </Button>
            
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-yellow-400/20 text-yellow-400 hover:bg-yellow-400/5 px-8 py-4 text-base font-medium rounded-lg cik-glow"
            >
              <Link href="https://christisking.io/buy" target="_blank">
                How to Buy $CIK
              </Link>
            </Button>
          </motion.div>
        </section>
      </div>
    </div>
  );
}