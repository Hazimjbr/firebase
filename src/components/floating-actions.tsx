'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Atom, CalculatorIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Calculator from '@/components/calculator';

export default function FloatingActions() {
  const [isCalculatorOpen, setCalculatorOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
      <Dialog open={isCalculatorOpen} onOpenChange={setCalculatorOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full h-14 w-14 shadow-lg bg-secondary/80 backdrop-blur-sm border-2 border-secondary-foreground/20 hover:bg-secondary">
            <CalculatorIcon className="h-6 w-6" />
            <span className="sr-only">Open Calculator</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-xs p-0 border-none bg-transparent shadow-none">
          <Calculator />
        </DialogContent>
      </Dialog>
      
      <Button asChild size="icon" className="rounded-full h-14 w-14 shadow-lg">
        <Link href="/periodic-table">
          <Atom className="h-6 w-6" />
          <span className="sr-only">Periodic Table</span>
        </Link>
      </Button>
    </div>
  );
}
