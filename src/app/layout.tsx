import type { Metadata } from 'next';
import './globals.css';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import MainNav from '@/components/main-nav';
import { Toaster } from '@/components/ui/toaster';
import FloatingActions from '@/components/floating-actions';

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
          <div className="relative min-h-screen">
            <Sidebar>
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
