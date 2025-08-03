'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Atom, Beaker, BookOpen, FlaskConical, LayoutDashboard, LineChart, NotebookText } from 'lucide-react';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/periodic-table', label: 'Periodic Table', icon: Atom },
  { href: '/experiments', label: 'Experiments', icon: FlaskConical },
  { href: '/quizzes', label: 'Quizzes', icon: NotebookText },
  { href: '/materials', label: 'Materials', icon: BookOpen },
  { href: '/performance-analysis', label: 'Analysis', icon: LineChart },
];

export default function MainNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="p-2 h-24 flex items-center justify-start group-data-[collapsible=icon]:justify-center">
        <div className="flex items-center gap-3">
            <Beaker className="w-8 h-8 text-primary shrink-0" />
            <h1 className="text-2xl font-semibold group-data-[collapsible=icon]:hidden">ChemInteractive</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="p-2">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
