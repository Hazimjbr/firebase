import type { Metadata } from 'next';
import './globals.css';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import MainNav from '@/components/main-nav';
import { Toaster } from '@/components/ui/toaster';
import FloatingActions from '@/components/floating-actions';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });

export const metadata: Metadata = {
  title: 'ChemInteractive',
  description: 'Interactive Chemistry Learning Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-body antialiased`}>
        <SidebarProvider>
          <div className="relative min-h-screen md:flex">
            <Sidebar side="left">
              <MainNav />
            </Sidebar>
            <SidebarInset>
              <div className="min-h-screen">
                {children}
              </div>
            </SidebarInset>
            <FloatingActions />
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
