'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';
import { Wallet, ArrowLeftRight, Activity, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/', icon: Wallet },
  { name: 'Transfer', href: '/transfer', icon: ArrowLeftRight },
  { name: 'Activity', href: '/activity', icon: Activity },
  { name: 'Terminal', href: '/terminal', icon: Terminal },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="glass-card rounded-2xl p-2 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  className={cn(
                    'flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors focus-ring',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden sm:block">{item.name}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
        
        <div className="flex items-center space-x-4">
          <ConnectButton
            chainStatus="icon"
            accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'full',
            }}
          />
        </div>
      </div>
    </nav>
  );
}