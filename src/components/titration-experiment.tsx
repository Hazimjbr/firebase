
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Droplet, Play, Pause, RotateCcw, TestTube2, ChevronsRight, Award, FlaskConical } from 'lucide-react';
import Header from './header';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

type TitrationDataPoint = {
  volume: number;
  pH: number;
};

const indicators = {
  phenolphthalein: { range: [8.2, 10.0], acid: 'transparent', base: 'pink' },
  bromothymol_blue: { range: [6.0, 7.6], acid: 'yellow', mid: 'green', base: 'blue' },
  methyl_orange: { range: [3.1, 4.4], acid: 'red', base: 'yellow' },
  litmus: { range: [4.5, 8.3], acid: 'red', base: 'blue' }
};

type IndicatorName = keyof typeof indicators;
type TitrationType = 'strong-strong' | 'weak-strong' | 'strong-weak' | 'challenge';

const pKa_acetic_acid = 4.76;
const pKb_ammonia = 4.75;

const BuretteIcon = () => (
    <svg viewBox="0 0 100 400" className="h-full w-auto" preserveAspectRatio="xMidYMax meet">
        <path d="M30 0 V10 H20 V350 L50 380 L80 350 V10 H70 V0 Z" stroke="gray" strokeWidth="2" fill="white" />
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
        <line x1="25" y1="120" x2="35" y2="120" stroke="gray" strokeWidth="1"/>
        <text x="38" y="123" fontSize="10" fill="gray">25mL</text>
        <line x1="25" y1="80" x2="35" y2="80" stroke="gray" strokeWidth="1"/>
        <text x="38" y="83" fontSize="10" fill="gray">50mL</text>
    </svg>
)

export default function TitrationExperiment() {
  const [titrationType, setTitrationType] = useState<TitrationType>('strong-strong');
  const [analyte, setAnalyte] = useState({ volume: 25, concentration: 0.1 });
  const [titrant, setTitrant] = useState({ concentration: 0.1 });
  const [unknownConcentration, setUnknownConcentration] = useState(0.125); // For challenge mode
  
  const [addedBaseVolume, setAddedBaseVolume] = useState(0);
  const [titrationData, setTitrationData] = useState<TitrationDataPoint[]>([]);
  const [isTitrating, setIsTitrating] = useState(false);
  const [indicator, setIndicator] = useState<IndicatorName>('phenolphthalein');
  const [showResults, setShowResults] = useState(false);

  const titrantConcentration = useMemo(() => {
    return titrationType === 'challenge' ? unknownConcentration : titrant.concentration;
  }, [titrationType, titrant.concentration, unknownConcentration]);

  const equivalencePoint = useMemo(() => {
    if (titrantConcentration === 0) return Infinity;
    return (analyte.concentration * analyte.volume) / titrantConcentration;
  }, [analyte.concentration, analyte.volume, titrantConcentration]);

  const calculatePH = useCallback((baseVol: number) => {
    const initialMolesAnalyte = (analyte.concentration * analyte.volume) / 1000;
    const molesTitrantAdded = (titrantConcentration * baseVol) / 1000;
    const totalVolume = (analyte.volume + baseVol) / 1000;

    if (totalVolume === 0) return -Math.log10(analyte.concentration);

    switch (titrationType) {
      case 'strong-strong':
        if (molesTitrantAdded < initialMolesAnalyte) {
          const H_concentration = (initialMolesAnalyte - molesTitrantAdded) / totalVolume;
          return -Math.log10(H_concentration);
        } else if (molesTitrantAdded > initialMolesAnalyte) {
          const OH_concentration = (molesTitrantAdded - initialMolesAnalyte) / totalVolume;
          return 14 + Math.log10(OH_concentration);
        } else {
          return 7;
        }

      case 'weak-strong':
        const Ka = 10**-pKa_acetic_acid;
        if (molesTitrantAdded === 0) {
            const H_concentration = Math.sqrt(Ka * analyte.concentration);
            return -Math.log10(H_concentration);
        }
        if (molesTitrantAdded < initialMolesAnalyte) { // Buffer region
          const molesHA = initialMolesAnalyte - molesTitrantAdded;
          const molesA_minus = molesTitrantAdded;
          return pKa_acetic_acid + Math.log10(molesA_minus / molesHA);
        } else if (molesTitrantAdded === initialMolesAnalyte) { // Equivalence point
          const A_minus_concentration = initialMolesAnalyte / totalVolume;
          const Kb = (1e-14) / Ka;
          const OH_concentration = Math.sqrt(Kb * A_minus_concentration);
          return 14 + Math.log10(OH_concentration);
        } else { // After equivalence point
          const OH_concentration = (molesTitrantAdded - initialMolesAnalyte) / totalVolume;
          return 14 + Math.log10(OH_concentration);
        }

      case 'strong-weak':
         const Kb = 10**-pKb_ammonia;
         if(molesTitrantAdded < initialMolesAnalyte) {
            const H_concentration = (initialMolesAnalyte - molesTitrantAdded) / totalVolume;
            return -Math.log10(H_concentration);
         } else if (molesTitrantAdded === initialMolesAnalyte) {
            const BH_plus_concentration = initialMolesAnalyte / totalVolume;
            const Ka_local = (1e-14) / Kb;
            const H_concentration = Math.sqrt(Ka_local * BH_plus_concentration);
            return -Math.log10(H_concentration);
         } else { // Buffer region (titrant is weak base)
            const molesB = molesTitrantAdded - initialMolesAnalyte;
            const molesBH_plus = initialMolesAnalyte;
            const pKa_local = 14 - pKb_ammonia;
            return pKa_local + Math.log10(molesB / molesBH_plus);
         }
      
      case 'challenge': // Assume strong-strong for the challenge
        if (molesTitrantAdded < initialMolesAnalyte) {
          const H_concentration = (initialMolesAnalyte - molesTitrantAdded) / totalVolume;
          return -Math.log10(H_concentration);
        } else if (molesTitrantAdded > initialMolesAnalyte) {
          const OH_concentration = (molesTitrantAdded - initialMolesAnalyte) / totalVolume;
          return 14 + Math.log10(OH_concentration);
        } else {
          return 7;
        }

      default: return 7;
    }
  }, [analyte.concentration, analyte.volume, titrantConcentration, titrationType]);

  const currentPH = useMemo(() => calculatePH(addedBaseVolume), [addedBaseVolume, calculatePH]);
  const equivalencePH = useMemo(() => calculatePH(equivalencePoint), [calculatePH, equivalencePoint]);

  const flaskColor = useMemo(() => {
    const ind = indicators[indicator];
    if (currentPH < ind.range[0]) return ind.acid;
    if (currentPH > ind.range[1]) return ind.base;
    if (ind.mid) {
      return ind.mid
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
    if (isTitrating && addedBaseVolume < maxBuretteVolume) {
      interval = setInterval(() => {
        setAddedBaseVolume(prev => {
          const newVolume = prev + 0.1;
          const newPH = calculatePH(newVolume);
          setTitrationData(data => [...data, { volume: parseFloat(newVolume.toFixed(2)), pH: parseFloat(newPH.toFixed(2)) }]);
          if (newVolume >= maxBuretteVolume) {
             setIsTitrating(false);
             setShowResults(true);
             return maxBuretteVolume;
          }
          return newVolume;
        });
      }, 100);
    } else if (isTitrating && addedBaseVolume >= maxBuretteVolume) {
        setIsTitrating(false);
        setShowResults(true);
    }
    return () => clearInterval(interval);
  }, [isTitrating, calculatePH]);
  
  useEffect(() => {
    handleReset();
    // Reset unknown concentration for challenge mode when type changes
    if (titrationType === 'challenge') {
      setUnknownConcentration(Math.random() * (0.2 - 0.05) + 0.05); // Random concentration between 0.05M and 0.2M
    }
  }, [titrationType]);

  const handleReset = () => {
    setIsTitrating(false);
    setShowResults(false);
    setAddedBaseVolume(0);
    setTitrationData([]);
    setAnalyte({ volume: 25, concentration: 0.1 });
    setTitrant({ concentration: 0.1 });
    setIndicator('phenolphthalein');
  };

  const handleTitrationToggle = () => {
    if (addedBaseVolume >= maxBuretteVolume && !isTitrating) {
        setShowResults(true);
    } else {
        setIsTitrating(!isTitrating);
        if (isTitrating) { // If it was titrating, show results on pause
            setShowResults(true);
        }
    }
  }

  const isResettable = addedBaseVolume > 0 || isTitrating;
  const currentBeakerVolumeRatio = (analyte.volume + addedBaseVolume) / 100;
  
  const getTitrationInfo = () => {
    switch(titrationType) {
      case 'strong-strong':
        return { title: 'Strong Acid vs. Strong Base', analyte: 'Strong Acid (e.g. HCl)', titrant: 'Strong Base (e.g. NaOH)'};
      case 'weak-strong':
        return { title: 'Weak Acid vs. Strong Base', analyte: 'Weak Acid (e.g. CH₃COOH)', titrant: 'Strong Base (e.g. NaOH)'};
      case 'strong-weak':
        return { title: 'Strong Acid vs. Weak Base', analyte: 'Strong Acid (e.g. HCl)', titrant: 'Weak Base (e.g. NH₃)'};
      case 'challenge':
        return { title: 'Challenge: Find Concentration', analyte: 'Strong Acid (e.g. HCl)', titrant: 'Strong Base (UNKNOWN)'};
    }
  }

  const info = getTitrationInfo();

  return (
    <div className="flex flex-col h-full">
        <Header 
            title="Acid-Base Titration"
            description="An interactive simulation of various acid-base titrations."
        />
        <div className="flex-1 p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
                <Tabs value={titrationType} onValueChange={(val) => setTitrationType(val as TitrationType)}>
                    <TabsList className="grid w-full grid-cols-2 h-auto">
                        <TabsTrigger value="strong-strong" className="text-xs">Strong-Strong</TabsTrigger>
                        <TabsTrigger value="weak-strong" className="text-xs">Weak-Strong</TabsTrigger>
                        <TabsTrigger value="strong-weak" className="text-xs">Strong-Weak</TabsTrigger>
                        <TabsTrigger value="challenge" className="text-xs text-primary">Challenge</TabsTrigger>
                    </TabsList>
                </Tabs>

                <Card>
                    <CardHeader>
                        <CardTitle>Experiment Setup</CardTitle>
                        <CardDescription>{info.title}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="analyte-vol">{info.analyte} Volume (mL)</Label>
                            <Input id="analyte-vol" type="number" value={analyte.volume} onChange={e => setAnalyte(s => ({...s, volume: parseFloat(e.target.value)}))} disabled={isResettable} />
                        </div>
                        <div>
                            <Label htmlFor="analyte-conc">{info.analyte} Concentration (M)</Label>
                            <Input id="analyte-conc" type="number" step="0.01" value={analyte.concentration} onChange={e => setAnalyte(s => ({...s, concentration: parseFloat(e.target.value)}))} disabled={isResettable} />
                        </div>
                        {titrationType !== 'challenge' && (
                            <div>
                                <Label htmlFor="titrant-conc">{info.titrant} Concentration (M)</Label>
                                <Input id="titrant-conc" type="number" step="0.01" value={titrant.concentration} onChange={e => setTitrant(s => ({...s, concentration: parseFloat(e.target.value)}))} disabled={isResettable} />
                            </div>
                        )}
                        <div>
                            <Label htmlFor="indicator">Indicator</Label>
                            <Select value={indicator} onValueChange={(val: IndicatorName) => setIndicator(val)} disabled={isResettable}>
                                <SelectTrigger id="indicator"><SelectValue placeholder="Select Indicator" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="phenolphthalein">Phenolphthalein</SelectItem>
                                    <SelectItem value="bromothymol_blue">Bromothymol Blue</SelectItem>
                                    <SelectItem value="methyl_orange">Methyl Orange</SelectItem>
                                    <SelectItem value="litmus">Litmus</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader><CardTitle>Simulation Control</CardTitle></CardHeader>
                    <CardContent className="flex items-center space-x-4">
                        <Button onClick={handleTitrationToggle} disabled={addedBaseVolume >= maxBuretteVolume} size="lg">
                            {isTitrating ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                            {isTitrating ? 'Pause' : 'Start'}
                        </Button>
                         <Button onClick={() => setShowResults(true)} variant="secondary" size="lg" disabled={!isResettable || isTitrating}>
                            <ChevronsRight className="mr-2 h-4 w-4" />
                            Results
                        </Button>
                        <Button onClick={handleReset} variant="outline" size="lg">
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset
                        </Button>
                    </CardContent>
                </Card>

                {showResults && (
                    <Card className="bg-secondary/30 border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Award className="text-primary"/>Experiment Results</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <p><strong>Equivalence Point Volume:</strong> {equivalencePoint.toFixed(2)} mL</p>
                            <p><strong>pH at Equivalence:</strong> {equivalencePH.toFixed(2)}</p>
                            {titrationType === 'challenge' && (
                                <Alert>
                                    <FlaskConical className="h-4 w-4" />
                                    <AlertTitle>Challenge Results</AlertTitle>
                                    <AlertDescription>
                                        The actual titrant concentration was <strong>{unknownConcentration.toFixed(3)} M</strong>. 
                                        Based on an equivalence point of {equivalencePoint.toFixed(2)} mL, you can now calculate this value.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="lg:col-span-2 space-y-6">
                <Card className="flex flex-col items-center justify-center p-4 min-h-[500px] overflow-hidden">
                   <div className="w-full h-[450px] flex items-end justify-center gap-4 relative">
                        <div className="absolute w-full h-full top-0 left-0 flex justify-center">
                            <div className="absolute bottom-0 w-64 h-2 bg-gray-300 rounded-t-sm"></div>
                            <div className="absolute bottom-0 h-full w-2 bg-gray-400" style={{left: 'calc(50% + 80px)'}}></div>
                            <div className="absolute top-2 h-2 w-28 bg-gray-400" style={{left: 'calc(50% - 30px)'}}></div>
                            <div className="relative h-full w-24" style={{ transform: 'translateX(-40px)' }}>
                                <div className="absolute w-16 h-12 bg-gray-500 rounded-md p-1 flex justify-between top-0 z-20" style={{left: 'calc(50% - 32px)'}}>
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

                        <div className="relative w-36 h-36 mb-5" style={{ transform: 'translateX(-40px)' }}>
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
                        <CardDescription>pH vs. Volume of {info.titrant} Added</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] pr-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={titrationData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="volume" name="Volume" label={{ value: `Volume of Base (mL)`, position: 'insideBottom', offset: -10 }} unit="mL" type="number" domain={[0, maxBuretteVolume]} allowDataOverflow/>
                                <YAxis dataKey="pH" name="pH" label={{ value: 'pH', angle: -90, position: 'insideLeft' }} type="number" domain={[0, 14]}/>
                                <Tooltip contentStyle={{backgroundColor: "hsl(var(--background))"}} formatter={(value: number, name) => [value.toFixed(2), name]}/>
                                <Legend verticalAlign="top" height={36}/>
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
