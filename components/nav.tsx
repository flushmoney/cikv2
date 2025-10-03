'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';
import { Wallet, ArrowLeftRight, Activity, Terminal, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/', icon: Crown },
  { name: 'Transfer', href: '/transfer', icon: ArrowLeftRight },
  { name: 'Activity', href: '/activity', icon: Activity },
  { name: 'Terminal', href: '/terminal', icon: Terminal },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="holy-nav rounded-2xl p-3 mb-8 sticky top-4 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  className={cn(
                    'nav-link flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 focus-ring',
                    isActive
                      ? 'bg-gradient-to-r from-primary to-secondary text-black shadow-blessed'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden sm:block font-medium">{item.name}</span>
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