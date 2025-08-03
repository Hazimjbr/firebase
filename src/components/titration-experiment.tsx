

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Droplet, Play, Pause, RotateCcw, TestTube2 } from 'lucide-react';
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

// Using SVG for more complex shapes
const BuretteIcon = () => (
    <svg viewBox="0 0 100 400" className="h-full w-auto" preserveAspectRatio="xMidYMax meet">
        <path d="M30 0 V10 H20 V350 L50 380 L80 350 V10 H70 V0 Z" stroke="gray" strokeWidth="2" fill="white" />
        {/* Markings */}
        {Array.from({length: 10}).map((_, i) => (
            <g key={i}>
                <line x1="25" y1={35 + i * 31.5} x2="35" y2={35 + i * 31.5} stroke="gray" strokeWidth="1.5" />
                <text x="38" y={38 + i * 31.5} fontSize="10" fill="gray">{i * 5}</text>
            </g>
        ))}
    </svg>
)

const BeakerIcon = () => (
    <svg viewBox="0 0 150 150" className="w-full h-full" preserveAspectRatio="xMidYMin meet">
        <path d="M10 0 H140 L130 140 H20 Z" stroke="gray" strokeWidth="2" fill="white" />
        {/* Markings */}
        <line x1="25" y1="120" x2="35" y2="120" stroke="gray" strokeWidth="1"/>
        <text x="38" y="123" fontSize="10" fill="gray">25mL</text>
        <line x1="25" y1="80" x2="35" y2="80" stroke="gray" strokeWidth="1"/>
        <text x="38" y="83" fontSize="10" fill="gray">50mL</text>
    </svg>
)

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
    const initialMolesAcid = (acidConcentration * acidVolume) / 1000;
    const molesBaseAdded = (baseConcentration * baseVol) / 1000;
    const totalVolume = (acidVolume + baseVol) / 1000;

    if (totalVolume === 0) return -Math.log10(acidConcentration);

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
    
    const progress = (currentPH - ind.range[0]) / (ind.range[1] - ind.range[0]);
     if (ind.acid === 'transparent') {
         return `rgba(255, 192, 203, ${progress})`; // Fade in pink for phenolphthalein
     }
     
     return progress > 0.5 ? ind.base : ind.acid;

  }, [currentPH, indicator]);

  const maxBuretteVolume = 50;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTitrating) {
      interval = setInterval(() => {
        setAddedBaseVolume(prev => {
          const newVolume = prev + 0.1;
          if (newVolume >= maxBuretteVolume) {
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
    setAcidVolume(25);
    setAcidConcentration(0.1);
    setBaseConcentration(0.1);
    setIndicator('phenolphthalein');
  };

  const isResettable = addedBaseVolume > 0 || isTitrating;
  const initialBeakerVolumeRatio = acidVolume / 100; // e.g. 25ml in 100ml beaker
  const currentBeakerVolumeRatio = (acidVolume + addedBaseVolume) / 100;
  
  return (
    <div className="flex flex-col h-full">
        <Header 
            title="Acid-Base Titration"
            description="An interactive simulation of a strong acid-strong base titration."
        />
        <div className="flex-1 p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                            <Input id="acid-conc" type="number" step="0.01" value={acidConcentration} onChange={e => setAcidConcentration(parseFloat(e.target.value))} disabled={isResettable} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="base-conc">Base Concentration (M)</Label>
                            <Input id="base-conc" type="number" step="0.01" value={baseConcentration} onChange={e => setBaseConcentration(parseFloat(e.target.value))} disabled={isResettable} />
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
                        <Button onClick={() => setIsTitrating(!isTitrating)} disabled={addedBaseVolume >= maxBuretteVolume} size="lg">
                            {isTitrating ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                            {isTitrating ? 'Pause' : 'Start'}
                        </Button>
                        <Button onClick={handleReset} variant="outline" size="lg" disabled={!isResettable && !isTitrating}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
                <Card className="flex flex-col items-center justify-center p-4 min-h-[400px] overflow-hidden">
                   <div className="w-full h-[350px] flex items-end justify-center gap-4 relative">
                         {/* Stand and Burette Assembly */}
                        <div className="absolute w-full h-full top-0 left-0 flex justify-center">
                            {/* Stand Base */}
                            <div className="absolute bottom-0 w-64 h-2 bg-gray-300 rounded-t-sm"></div>
                            {/* Stand Rod */}
                            <div className="absolute bottom-0 h-[95%] w-2 bg-gray-400" style={{left: 'calc(50% + 80px)'}}></div>
                             {/* Clamp Arm */}
                            <div className="absolute top-8 h-2 w-28 bg-gray-400" style={{left: 'calc(50% - 30px)'}}></div>
                             {/* Burette */}
                            <div className="relative h-full w-24" style={{ transform: 'translateX(-40px)' }}>
                                <div className="absolute w-16 h-12 bg-gray-500 rounded-md p-1 flex justify-between top-2 z-20" style={{left: 'calc(50% - 32px)'}}>
                                    <div className="w-2 h-full bg-gray-600 rounded-sm"></div>
                                    <div className="w-2 h-full bg-gray-600 rounded-sm"></div>
                                </div>
                                <div className="absolute top-0 w-full h-full z-10">
                                    <BuretteIcon />
                                    <div className="absolute bottom-[30px] left-[20px] right-[20px] top-[10px] rounded-b-lg overflow-hidden">
                                        <div className="absolute bottom-0 w-full bg-blue-200/30 transition-all duration-100" style={{ height: `${(1 - (addedBaseVolume / maxBuretteVolume)) * 100}%` }}>
                                             <div className="absolute top-0 w-full h-1 bg-blue-400"></div>
                                        </div>
                                    </div>
                                    {isTitrating && <Droplet className="absolute bottom-[2px] left-1/2 -translate-x-1/2 text-blue-500 animate-drip" />}
                                </div>
                            </div>
                        </div>

                        {/* Beaker */}
                        <div className="relative w-48 h-48 mb-5" style={{ transform: 'translateX(-40px)' }}>
                            <BeakerIcon />
                            <div className="absolute bottom-[7px] left-[21px] right-[13px] h-full overflow-hidden">
                                <div className="absolute bottom-0 w-full transition-all duration-200" style={{ height: `${Math.min(currentBeakerVolumeRatio, 1) * 90}%` }}>
                                    <div className="absolute bottom-0 w-full h-full transition-colors duration-300" style={{ backgroundColor: flaskColor, opacity: flaskColor === 'transparent' ? 0 : 0.5 }}></div>
                                     {isTitrating && Array.from({length:5}).map((_, i) => (
                                        <div key={i} className="absolute bottom-0 w-1 h-1 bg-white/50 rounded-full animate-bubble"
                                             style={{left: `${Math.random()*90+5}%`, animationDelay: `${Math.random()*2}s`, animationDuration: `${Math.random()*2+1}s`}}></div>
                                    ))}
                                </div>
                                <div className={cn("absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-gray-500 rounded-full", isTitrating && "animate-spin-slow")}></div>
                            </div>

                        </div>
                   </div>
                    <div className="mt-4 text-center">
                        <p className="font-bold text-lg">pH: {currentPH.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">{addedBaseVolume.toFixed(2)} mL of Base Added</p>
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
                                <XAxis dataKey="volume" name="Volume" label={{ value: 'Volume of Base (mL)', position: 'insideBottom', offset: -5 }} unit="mL" type="number" domain={[0, maxBuretteVolume]} allowDataOverflow/>
                                <YAxis dataKey="pH" name="pH" label={{ value: 'pH', angle: -90, position: 'insideLeft' }} type="number" domain={[0, 14]}/>
                                <Tooltip contentStyle={{backgroundColor: "hsl(var(--background))"}} formatter={(value: number, name) => [value.toFixed(2), name]}/>
                                <Legend />
                                <Line type="monotone" dataKey="pH" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} isAnimationActive={false}/>
                                {equivalencePoint <= maxBuretteVolume && <ReferenceLine x={equivalencePoint} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label={{ value: 'Equiv. Point', position: 'insideTopRight', fill: 'hsl(var(--destructive))' }} />}
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
