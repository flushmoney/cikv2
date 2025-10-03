import './globals.css';
import Providers from './providers';
import Nav from '@/components/nav';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
              <Nav />
              <main>
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}