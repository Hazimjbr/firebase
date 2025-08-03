'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Beaker, Droplet, Play, Pause, RotateCcw } from 'lucide-react';
import Header from './header';
import { cn } from '@/lib/utils';

type TitrationDataPoint = {
  volume: number;
  pH: number;
};

// Indicator pH ranges and colors
const indicators = {
  phenolphthalein: { range: [8.2, 10.0], acid: 'transparent', base: 'pink' },
  bromothymol_blue: { range: [6.0, 7.6], acid: 'yellow', mid: 'green', base: 'blue' },
  methyl_orange: { range: [3.1, 4.4], acid: 'red', base: 'yellow' },
};

type IndicatorName = keyof typeof indicators;

export default function TitrationExperiment() {
  const [acidVolume, setAcidVolume] = useState(25);
  const [acidConcentration, setAcidConcentration] = useState(0.1);
  const [baseConcentration, setBaseConcentration] = useState(0.1);
  const [addedBaseVolume, setAddedBaseVolume] = useState(0);
  const [titrationData, setTitrationData] = useState<TitrationDataPoint[]>([]);
  const [isTitrating, setIsTitrating] = useState(false);
  const [indicator, setIndicator] = useState<IndicatorName>('phenolphthalein');

  const equivalencePoint = useMemo(() => {
    if (baseConcentration === 0) return Infinity;
    return (acidConcentration * acidVolume) / baseConcentration;
  }, [acidConcentration, acidVolume, baseConcentration]);

  const calculatePH = useCallback((baseVol: number) => {
    // Simplified pH calculation for a strong acid-strong base titration
    const initialMolesAcid = (acidConcentration * acidVolume) / 1000;
    const molesBaseAdded = (baseConcentration * baseVol) / 1000;
    const totalVolume = (acidVolume + baseVol) / 1000;

    if (totalVolume === 0) return 1;

    if (molesBaseAdded < initialMolesAcid) {
      const H_concentration = (initialMolesAcid - molesBaseAdded) / totalVolume;
      return -Math.log10(H_concentration);
    } else if (molesBaseAdded > initialMolesAcid) {
      const OH_concentration = (molesBaseAdded - initialMolesAcid) / totalVolume;
      return 14 + Math.log10(OH_concentration);
    } else {
      return 7; // Equivalence point
    }
  }, [acidConcentration, acidVolume, baseConcentration]);

  const currentPH = useMemo(() => calculatePH(addedBaseVolume), [addedBaseVolume, calculatePH]);

  const flaskColor = useMemo(() => {
    const ind = indicators[indicator];
    if (currentPH < ind.range[0]) return ind.acid;
    if (currentPH > ind.range[1]) return ind.base;
    
    if (ind.mid) {
      const midPoint = (ind.range[0] + ind.range[1]) / 2;
      if (Math.abs(currentPH - midPoint) < 0.2) return ind.mid;
      if (currentPH < midPoint) return ind.acid;
      return ind.base;
    }

    // For 2-color indicators, create a gradient effect
    const progress = (currentPH - ind.range[0]) / (ind.range[1] - ind.range[0]);
     if (ind.acid === 'transparent') {
         return `rgba(255, 192, 203, ${progress})`; // Fade in pink for phenolphthalein
     }
     // This part is a simplification. A real gradient would be more complex.
     return progress > 0.5 ? ind.base : ind.acid;

  }, [currentPH, indicator]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTitrating) {
      interval = setInterval(() => {
        setAddedBaseVolume(prev => {
          const newVolume = prev + 0.1;
          if (newVolume >= baseConcentration * 500) {
            setIsTitrating(false);
            return prev;
          }
          const newPH = calculatePH(newVolume);
          setTitrationData(data => [...data, { volume: parseFloat(newVolume.toFixed(2)), pH: parseFloat(newPH.toFixed(2)) }]);
          return newVolume;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isTitrating, calculatePH, baseConcentration]);

  const handleReset = () => {
    setIsTitrating(false);
    setAddedBaseVolume(0);
    setTitrationData([]);
  };

  const isResettable = addedBaseVolume > 0 || isTitrating;

  return (
    <div className="flex flex-col h-full">
        <Header 
            title="Acid-Base Titration"
            description="An interactive simulation of a strong acid-strong base titration."
        />
        <div className="flex-1 p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Controls & Data */}
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Experiment Controls</CardTitle>
                        <CardDescription>Set the initial parameters for your titration.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="acid-vol">Acid Volume (mL)</Label>
                            <Input id="acid-vol" type="number" value={acidVolume} onChange={e => setAcidVolume(parseFloat(e.target.value))} disabled={isResettable} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="acid-conc">Acid Concentration (M)</Label>
                            <Input id="acid-conc" type="number" value={acidConcentration} onChange={e => setAcidConcentration(parseFloat(e.target.value))} disabled={isResettable} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="base-conc">Base Concentration (M)</Label>
                            <Input id="base-conc" type="number" value={baseConcentration} onChange={e => setBaseConcentration(parseFloat(e.target.value))} disabled={isResettable} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="indicator">Indicator</Label>
                            <Select value={indicator} onValueChange={(val: IndicatorName) => setIndicator(val)} disabled={isResettable}>
                                <SelectTrigger id="indicator">
                                    <SelectValue placeholder="Select Indicator" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="phenolphthalein">Phenolphthalein</SelectItem>
                                    <SelectItem value="bromothymol_blue">Bromothymol Blue</SelectItem>
                                    <SelectItem value="methyl_orange">Methyl Orange</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>Titration Control</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center space-x-4">
                        <Button onClick={() => setIsTitrating(!isTitrating)} disabled={!isResettable && addedBaseVolume > 0} size="lg">
                            {isTitrating ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                            {isTitrating ? 'Pause' : 'Start'}
                        </Button>
                        <Button onClick={handleReset} variant="outline" size="lg" disabled={!isResettable}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Column 2: Animation & Chart */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="flex flex-col items-center justify-center p-4 min-h-[350px]">
                   <div className="w-full h-full flex items-end justify-center gap-4">
                        {/* Burette */}
                        <div className="relative h-full w-12 bg-gray-200/50 rounded-t-lg border-x-2 border-t-2 border-gray-400">
                             <div className="absolute bottom-0 w-full bg-blue-400 transition-all duration-100" style={{ height: `${100 - (addedBaseVolume / (baseConcentration * 500)) * 100}%` }}></div>
                            <div className={cn(
                                "absolute left-1/2 -translate-x-1/2 bottom-[-15px] h-0 w-0 border-x-8 border-x-transparent border-t-[15px] border-t-gray-400"
                            )}></div>
                             {isTitrating && <Droplet className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 text-blue-500 animate-pulse" />}
                        </div>

                        {/* Beaker */}
                        <div className="relative w-40 h-48 border-2 border-gray-400 rounded-b-xl rounded-t-md mb-5">
                            <div 
                                className="absolute bottom-0 w-full h-1/2 transition-colors duration-300"
                                style={{ backgroundColor: flaskColor }}
                            ></div>
                            <div className="absolute -bottom-5 w-full text-center">
                                <p className="font-bold text-lg">pH: {currentPH.toFixed(2)}</p>
                                <p className="text-sm text-muted-foreground">{addedBaseVolume.toFixed(2)} mL added</p>
                            </div>
                        </div>
                   </div>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Titration Curve</CardTitle>
                        <CardDescription>pH vs. Volume of Base Added</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] pr-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={titrationData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="volume" label={{ value: 'Volume of Base (mL)', position: 'insideBottom', offset: -5 }} unit="mL" type="number" domain={[0, 'dataMax + 5']} />
                                <YAxis label={{ value: 'pH', angle: -90, position: 'insideLeft' }} type="number" domain={[0, 14]}/>
                                <Tooltip formatter={(value, name) => [value, name === 'pH' ? 'pH' : 'Volume (mL)']}/>
                                <Legend />
                                <Line type="monotone" dataKey="pH" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} isAnimationActive={false}/>
                                <ReferenceLine x={equivalencePoint} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label={{ value: 'Equivalence Point', position: 'insideTop' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
