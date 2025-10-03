'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal as TerminalIcon, Send } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSendTransfer } from '@/hooks/useSendTransfer';
import { useResolveHandle } from '@/hooks/useResolveHandle';
import { useAccount } from 'wagmi';
import { Address } from 'viem';
import { TOKENS } from '@/lib/contracts';
import { validAmount, isAddress } from '@/lib/validators';

interface CommandOutput {
  id: string;
  command: string;
  output: string;
  type: 'success' | 'error' | 'info';
  timestamp: Date;
}

const HELP_TEXT = `
CIK Transfer Terminal v1.0
Available commands:

  send <to> <amount> <symbol> [memo]    Send tokens to an address or @handle
  balance                               Show your token balances  
  help                                  Show this help message
  clear                                 Clear terminal output

Examples:
  send @adi 100 CIK "Payment for work"
  send 0x123...abc 50.5 CIK
  balance
`;

export default function TerminalPage() {
  const { isConnected } = useAccount();
  const { sendTransfer, isLoading } = useSendTransfer();
  
  const [command, setCommand] = useState('');
  const [outputs, setOutputs] = useState<CommandOutput[]>([
    {
      id: '0',
      command: 'welcome',
      output: 'Welcome to CIK Transfer Terminal. Type "help" for available commands.',
      type: 'info',
      timestamp: new Date(),
    }
  ]);

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addOutput = (command: string, output: string, type: CommandOutput['type'] = 'info') => {
    const newOutput: CommandOutput = {
      id: Date.now().toString(),
      command,
      output,
      type,
      timestamp: new Date(),
    };
    setOutputs(prev => [...prev, newOutput]);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [outputs]);

  const parseCommand = (cmd: string) => {
    const parts = cmd.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    return { command, args };
  };

  const resolveAddress = async (addressOrHandle: string): Promise<Address | null> => {
    if (isAddress(addressOrHandle)) {
      return addressOrHandle as Address;
    }
    
    if (addressOrHandle.startsWith('@')) {
      // Simulate handle resolution
      const { HANDLE_TO_ADDRESS } = await import('@/lib/mock');
      return HANDLE_TO_ADDRESS[addressOrHandle] || null;
    }
    
    return null;
  };

  const executeCommand = async (cmd: string) => {
    const { command, args } = parseCommand(cmd);
    
    addOutput(`$ ${cmd}`, '', 'info');

    switch (command) {
      case 'help':
        addOutput(cmd, HELP_TEXT.trim(), 'info');
        break;
        
      case 'clear':
        setOutputs([]);
        break;
        
      case 'balance':
        if (!isConnected) {
          addOutput(cmd, 'Error: Wallet not connected', 'error');
          break;
        }
        addOutput(cmd, 'Feature coming soon - check your wallet for current balances', 'info');
        break;
        
      case 'send':
        if (!isConnected) {
          addOutput(cmd, 'Error: Wallet not connected', 'error');
          break;
        }
        
        if (args.length < 3) {
          addOutput(cmd, 'Error: Usage: send <to> <amount> <symbol> [memo]', 'error');
          break;
        }
        
        const [to, amountStr, symbol, ...memoArr] = args;
        const memo = memoArr.join(' ');
        
        // Validate token
        const token = TOKENS.find(t => t.symbol.toLowerCase() === symbol.toLowerCase());
        if (!token) {
          addOutput(cmd, `Error: Unsupported token "${symbol}". Available: ${TOKENS.map(t => t.symbol).join(', ')}`, 'error');
          break;
        }
        
        // Validate amount
        const amountValidation = validAmount(amountStr, token.decimals);
        if (!amountValidation.isValid) {
          addOutput(cmd, `Error: ${amountValidation.error}`, 'error');
          break;
        }
        
        // Resolve address
        addOutput(cmd, `Resolving address: ${to}...`, 'info');
        
        try {
          const resolvedAddress = await resolveAddress(to);
          if (!resolvedAddress) {
            addOutput(cmd, `Error: Could not resolve address "${to}"`, 'error');
            break;
          }
          
          addOutput(cmd, `Sending ${amountStr} ${symbol} to ${to}${memo ? ` with memo: "${memo}"` : ''}...`, 'info');
          
          const hash = await sendTransfer({
            to: resolvedAddress,
            amount: amountStr,
            tokenAddress: token.address !== '0x0000000000000000000000000000000000000000' 
              ? token.address as Address 
              : undefined,
            memo,
          });
          
          addOutput(cmd, `✅ Transaction submitted: ${hash}`, 'success');
          addOutput(cmd, `View on BaseScan: https://basescan.org/tx/${hash}`, 'info');
          
        } catch (error: any) {
          addOutput(cmd, `❌ Transfer failed: ${error.message}`, 'error');
        }
        break;
        
      default:
        addOutput(cmd, `Unknown command: ${command}. Type "help" for available commands.`, 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || isLoading) return;
    
    const cmd = command.trim();
    setCommand('');
    
    await executeCommand(cmd);
  };

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  if (!isConnected) {
    return (
      <div className="text-center py-16">
        <TerminalIcon className="w-16 h-16 mx-auto text-white/20 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Terminal Access Denied</h1>
        <p className="text-white/70 mb-8">
          Please connect your wallet to access the terminal.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center mb-4">
          <TerminalIcon className="w-8 h-8 mr-3 text-primary" />
          <h1 className="text-3xl font-bold">CIK Terminal</h1>
        </div>
        <p className="text-white/70">Command-line interface for advanced users</p>
      </motion.div>

      <Card className="glass-card border-white/10 overflow-hidden">
        {/* Terminal Output */}
        <div
          ref={terminalRef}
          className="h-96 overflow-y-auto p-4 bg-black/20 font-mono text-sm"
          onClick={handleTerminalClick}
        >
          {outputs.map((output, index) => (
            <motion.div
              key={output.id}
              className="mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {output.command !== 'welcome' && (
                <div className="text-primary font-bold mb-1">
                  $ {output.command}
                </div>
              )}
              <div className={
                output.type === 'error' ? 'text-red-400' :
                output.type === 'success' ? 'text-green-400' :
                'text-white/80'
              }>
                <pre className="whitespace-pre-wrap">{output.output}</pre>
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div
              className="text-white/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse mr-2" />
                Processing...
              </div>
            </motion.div>
          )}
        </div>

        {/* Command Input */}
        <form onSubmit={handleSubmit} className="border-t border-white/10 p-4">
          <div className="flex items-center space-x-3">
            <span className="text-primary font-mono font-bold">$</span>
            <Input
              ref={inputRef}
              type="text"
              placeholder="Enter command (type 'help' for available commands)"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-transparent border-none focus:ring-0 focus:border-transparent font-mono text-white placeholder:text-white/50"
              autoComplete="off"
              spellCheck={false}
            />
            <Button
              type="submit"
              size="sm"
              disabled={!command.trim() || isLoading}
              className="glow-button"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </Card>

      {/* Quick Commands */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: 'Show Help', cmd: 'help' },
          { label: 'Check Balance', cmd: 'balance' },
          { label: 'Clear Terminal', cmd: 'clear' },
        ].map((item) => (
          <Button
            key={item.cmd}
            variant="outline"
            onClick={() => {
              setCommand(item.cmd);
              inputRef.current?.focus();
            }}
            className="border-white/20 font-mono"
            disabled={isLoading}
          >
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
}