'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';
import { Crown, ArrowLeftRight, Activity, Terminal } from 'lucide-react';
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
    <nav className="glass-card sacred-border rounded-2xl p-3 mb-12 shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  className={cn(
                    'flex items-center space-x-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 focus-ring',
                    isActive
                      ? 'bg-primary text-black shadow-lg'
                      : 'text-white/80 hover:text-primary hover:bg-primary/10'
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon className={cn("w-4 h-4", isActive && "drop-shadow-sm")} />
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