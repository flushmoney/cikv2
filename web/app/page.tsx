'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Wallet, QrCode, FileText, Zap, Globe, Shield, Users, TrendingUp, Lock } from 'lucide-react';
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
    icon: Lock,
    title: 'Secure',
    description: 'Built on Base blockchain security'
  },
];

const stats = [
  { icon: Users, value: '2.4B', label: 'Christians Worldwide' },
  { icon: TrendingUp, value: '100%', label: 'Community Driven' },
  { icon: Shield, value: 'Base', label: 'Blockchain Network' },
];

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="relative overflow-hidden">
      {/* Decorative clouds background */}
      <div className="absolute top-20 left-10 opacity-10 pointer-events-none">
        <Image src="/assets/image10.png" alt="" width={300} height={200} />
      </div>
      <div className="absolute top-40 right-10 opacity-10 pointer-events-none">
        <Image src="/assets/image10.png" alt="" width={250} height={150} />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* CHRIST IS KING Logo */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/assets/image6.png"
              alt="CHRIST IS KING"
              width={800}
              height={100}
              className="mx-auto"
              priority
            />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                  CIK Transfer Bot
                </h1>
                <p className="text-xl lg:text-2xl text-foreground/70 leading-relaxed font-light">
                  Send $CIK tokens on Base chain with beautiful UX.
                  Resolve handles, scan QR codes, and track transactions in real-time.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-5">
                {isConnected ? (
                  <Link href="/transfer">
                    <Button variant="secondary" size="lg" className="text-base font-medium w-full sm:w-auto">
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
                          className="w-full sm:w-auto"
                        >
                          <Button
                            onClick={openConnectModal}
                            variant="secondary"
                            size="lg"
                            className="text-base font-medium w-full"
                          >
                            <Wallet className="w-5 h-5 mr-2" />
                            Connect Wallet
                          </Button>
                        </div>
                      );
                    }}
                  </ConnectButton.Custom>
                )}

                <Link href="/terminal" className="w-full sm:w-auto">
                  <Button variant="default" size="lg" className="text-base font-medium w-full">
                    Try Terminal
                  </Button>
                </Link>
              </div>

              <div className="pt-4">
                <ContractChip />
              </div>
            </motion.div>

            {/* Hero Mascot */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <Image
                  src="/assets/image1.png"
                  alt="Christ Mascot"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-primary/5 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Image
              src="/assets/image16.png"
              alt="2.4 Billion Christians Worldwide"
              width={900}
              height={80}
              className="mx-auto mb-8"
            />
            <p className="text-xl text-foreground/60 font-light max-w-3xl mx-auto">
              Join the largest faith-based community in crypto
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card className="p-8 text-center hover:translate-x-[-2px] hover:translate-y-[-2px]">
                  <stat.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="text-4xl font-bold gradient-text mb-2">{stat.value}</p>
                  <p className="text-foreground/60">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Community Image */}
          <motion.div
            className="relative w-full max-w-4xl mx-auto rounded-[40px] overflow-hidden border border-border shadow-cik-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Image
              src="/assets/image4.png"
              alt="Community"
              width={1200}
              height={600}
              className="w-full h-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 px-4">
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

      {/* CTA Section */}
      <section className="text-center py-32 px-4 bg-gradient-to-b from-primary/5 to-white relative">
        <div className="absolute bottom-10 left-10 opacity-10 pointer-events-none hidden lg:block">
          <Image src="/assets/image10.png" alt="" width={200} height={150} />
        </div>
        <div className="absolute bottom-20 right-10 opacity-10 pointer-events-none hidden lg:block">
          <Image src="/assets/image10.png" alt="" width={250} height={150} />
        </div>

        <motion.div
          className="space-y-8 max-w-4xl mx-auto relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="mb-8">
            <Image
              src="/assets/image21.jpg"
              alt="Swap ETH for CIK"
              width={400}
              height={80}
              className="mx-auto mb-6"
            />
          </div>

          <h2 className="text-5xl lg:text-6xl font-bold">Ready to Transfer?</h2>
          <p className="text-foreground/60 text-xl max-w-3xl mx-auto leading-relaxed font-light">
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

          {/* Lamb Logo */}
          <div className="pt-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
            >
              <Image
                src="/assets/image2.png"
                alt="CIK Logo"
                width={100}
                height={100}
                className="mx-auto opacity-80"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
