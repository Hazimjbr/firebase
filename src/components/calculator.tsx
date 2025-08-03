"use client";

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function Calculator() {
  const [display, setDisplay] = useState('');

  const handleButtonClick = (value: string) => {
    if (value === 'C') {
      setDisplay('');
    } else if (value === '=') {
      try {
        // Caution: eval is used for simplicity. Not recommended for production with untrusted input.
        const result = eval(display.replace(/×/g, '*').replace(/÷/g, '/'));
        setDisplay(String(result));
      } catch (error) {
        setDisplay('Error');
      }
    } else if (value === '←') {
        setDisplay(prev => prev.slice(0, -1));
    }
    else {
      if (display === 'Error') {
        setDisplay(value);
      } else {
        setDisplay(prev => prev + value);
      }
    }
  };

  const buttons = [
    'C', '(', ')', '÷',
    '7', '8', '9', '×',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '←', '=',
  ];

  return (
    <div className="space-y-4">
      <Input
        type="text"
        value={display || '0'}
        readOnly
        className="text-right text-3xl font-mono h-16 bg-muted"
        aria-label="Calculator display"
      />
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((btn) => (
          <Button
            key={btn}
            onClick={() => handleButtonClick(btn)}
            variant={['C', '(', ')', '÷', '×', '-', '+', '=', '←'].includes(btn) ? 'secondary' : 'outline'}
            className="text-xl h-14"
            aria-label={`Calculator button ${btn}`}
          >
            {btn}
          </Button>
        ))}
      </div>
    </div>
  );
}
