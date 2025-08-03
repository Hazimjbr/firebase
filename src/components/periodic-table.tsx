'use client';

import { useState } from 'react';
import { elements } from '@/data/elements';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from './ui/separator';

const categoryColors: { [key: string]: string } = {
  'diatomic nonmetal': 'bg-green-200 text-green-800',
  'noble gas': 'bg-purple-200 text-purple-800',
  'alkali metal': 'bg-red-200 text-red-800',
  'alkaline earth metal': 'bg-orange-200 text-orange-800',
  metalloid: 'bg-yellow-200 text-yellow-800',
  'polyatomic nonmetal': 'bg-green-300 text-green-900',
  'post-transition metal': 'bg-blue-200 text-blue-800',
  'transition metal': 'bg-blue-300 text-blue-900',
  lanthanide: 'bg-indigo-200 text-indigo-800',
  actinide: 'bg-pink-200 text-pink-800',
  'unknown, probably transition metal': 'bg-gray-300 text-gray-800',
  'unknown, probably post-transition metal': 'bg-gray-300 text-gray-800',
  'unknown, probably metalloid': 'bg-gray-300 text-gray-800',
  'unknown, predicted to be noble gas': 'bg-gray-300 text-gray-800',
  'halogen': 'bg-teal-200 text-teal-800',
  'nonmetal': 'bg-green-200 text-green-800',
};

export default function PeriodicTable() {
  const [selectedElement, setSelectedElement] = useState<(typeof elements)[0] | null>(null);

  const getElementAtPosition = (x: number, y: number) => {
    return elements.find(el => el.xpos === x && el.ypos === y);
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-18 gap-1 p-4 bg-background rounded-lg overflow-x-auto">
        {Array.from({ length: 10 * 18 }).map((_, index) => {
          const x = (index % 18) + 1;
          const y = Math.floor(index / 18) + 1;
          const element = getElementAtPosition(x, y);

          if (element) {
            return (
              <button
                key={element.name}
                onClick={() => setSelectedElement(element)}
                className={cn(
                  'aspect-square flex flex-col items-center justify-center p-1 rounded-md transition-transform hover:scale-110 hover:z-10 focus:z-10 focus:ring-2 ring-primary shadow-sm',
                  categoryColors[element.category] || 'bg-gray-200 text-gray-800'
                )}
                style={{ gridColumn: x, gridRow: y }}
                aria-label={element.name}
              >
                <div className="text-xs font-bold">{element.symbol}</div>
                <div className="text-[0.6rem] hidden sm:block">{element.name}</div>
                <div className="absolute top-0.5 left-0.5 text-[0.5rem] font-medium">{element.number}</div>
              </button>
            );
          }
          // Render a placeholder for empty cells to maintain grid structure.
          return <div key={`${x}-${y}`} className="aspect-square" style={{ gridColumn: x, gridRow: y, visibility: 'hidden' }}></div>;
        })}
      </div>

      <Dialog open={!!selectedElement} onOpenChange={(isOpen) => !isOpen && setSelectedElement(null)}>
        <DialogContent className="max-w-md">
            {selectedElement && (
                <>
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-bold flex items-center gap-4">
                            <span className={cn("text-4xl font-bold w-20 h-20 flex items-center justify-center rounded-lg", categoryColors[selectedElement.category])}>{selectedElement.symbol}</span>
                            <div>
                                <span>{selectedElement.name}</span>
                                <span className="ml-2 text-xl text-muted-foreground">({selectedElement.number})</span>
                            </div>
                        </DialogTitle>
                        <DialogDescription className="text-md capitalize pt-2">{selectedElement.category}</DialogDescription>
                    </DialogHeader>
                    <Separator />
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div><strong>Atomic Mass:</strong> {selectedElement.atomic_mass.toPrecision(6)}</div>
                        <div><strong>Density:</strong> {selectedElement.density} g/cm³</div>
                        <div><strong>Melting Point:</strong> {selectedElement.melt} K</div>
                        <div><strong>Boiling Point:</strong> {selectedElement.boil} K</div>
                        <div className="col-span-2"><strong>Electron Config:</strong> {selectedElement.electron_configuration}</div>
                         <div className="col-span-2"><strong>Discovered by:</strong> {selectedElement.discovered_by || "Unknown"}</div>
                    </div>
                    <Separator />
                    <p className="text-sm text-muted-foreground">{selectedElement.summary}</p>
                </>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
