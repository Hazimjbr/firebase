
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Droplet, Play, Pause, RotateCcw, TestTube2, ChevronsRight, Award, FlaskConical, Lightbulb, CheckCircle, XCircle } from 'lucide-react';
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
        {/* Glass tube with highlight */}
        <path d="M30 0 V10 H20 V350 L50 380 L80 350 V10 H70 V0 Z" stroke="#A0A0A0" strokeWidth="1" fill="rgba(255, 255, 255, 0.5)" />
        <path d="M35 10 V345 L50 365 L65 345 V10 Z" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="1.5" fill="none" />
        
        {/* Graduation marks */}
        {Array.from({length: 11}).map((_, i) => (
            <g key={i}>
                <line x1="25" y1={35 + i * 31.5} x2="35" y2={35 + i * 31.5} stroke="#4A5568" strokeWidth="1.5" />
                {i % 2 === 0 && <text x="38" y={38 + i * 31.5} fontSize="10" fill="#4A5568" fontFamily='monospace'>{i * 5}</text>}
            </g>
        ))}

        {/* Stopcock */}
        <path d="M40 375 H60 L65 380 L60 385 H40 L35 380 Z" fill="#718096" stroke="#4A5568" strokeWidth="1"/>
        <path d="M20 378 H80 V382 H20 Z" fill="#718096" stroke="#4A5568" strokeWidth="1"/>
        <path d="M50 390 V380 L48 378 H52 L50 380 V390 L45 395 H55 Z" fill="#A0AEC0" />
    </svg>
)

const BeakerIcon = () => (
     <svg viewBox="0 0 150 150" className="w-full h-full" preserveAspectRatio="xMidYMin meet">
        {/* Beaker body and lip */}
        <path d="M10 10 C 10 0, 140 0, 140 10 V 10 L130 140 H20 Z" stroke="#A0A0A0" strokeWidth="1.5" fill="rgba(255, 255, 255, 0.5)" />
        {/* Highlight */}
        <path d="M25 20 V135" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />

        {/* Measurement lines */}
        <line x1="25" y1="120" x2="40" y2="120" stroke="#718096" strokeWidth="1"/>
        <text x="45" y="123" fontSize="10" fill="#4A5568" fontFamily='monospace'>25mL</text>
        <line x1="25" y1="80" x2="40" y2="80" stroke="#718096" strokeWidth="1"/>
        <text x="45" y="83" fontSize="10" fill="#4A5568" fontFamily='monospace'>50mL</text>
         <line x1="25" y1="40" x2="40" y2="40" stroke="#718096" strokeWidth="1"/>
        <text x="45" y="43" fontSize="10" fill="#4A5568" fontFamily='monospace'>75mL</text>
    </svg>
)

const ExperimentQuiz = ({ equivalencePoint, unknownConcentration, analyte, titrant, titrationType, onReset }: { equivalencePoint: number, unknownConcentration: number, analyte: any, titrant: any, titrationType: TitrationType, onReset: () => void }) => {
    const [userAnswer, setUserAnswer] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const calculatedConcentration = useMemo(() => {
        if (equivalencePoint === 0) return 0;
        return (analyte.concentration * analyte.volume) / equivalencePoint;
    }, [analyte, equivalencePoint]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const answer = parseFloat(userAnswer);
        if (isNaN(answer)) return;

        // Check if the user's answer is within a 5% tolerance of the actual value.
        const tolerance = titrationType === 'challenge' ? 0.05 : 0.02;
        const correctValue = titrationType === 'challenge' ? unknownConcentration : calculatedConcentration;
        setIsCorrect(Math.abs(answer - correctValue) / correctValue <= tolerance);
        setIsSubmitted(true);
    };

    const info = getTitrationInfo(titrationType);

    return (
        <Card className="mt-6 bg-secondary/30 border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><TestTube2 className="text-primary"/>Knowledge Check</CardTitle>
                <CardDescription>Based on the experiment, calculate the concentration of the titrant ({info.titrant}).</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm mb-2"><strong>Given Data:</strong></p>
                <ul className="text-sm list-disc pl-5 mb-4 space-y-1">
                    <li>Analyte ({info.analyte}) Volume: {analyte.volume} mL</li>
                    <li>Analyte ({info.analyte}) Concentration: {analyte.concentration} M</li>
                    <li>Equivalence Point Volume: {equivalencePoint.toFixed(2)} mL</li>
                </ul>
                 <p className="text-xs text-muted-foreground mb-4"><strong>Formula:</strong> M₁V₁ = M₂V₂  (M_titrant * V_equiv) = (M_analyte * V_analyte)</p>

                {!isSubmitted ? (
                     <form onSubmit={handleSubmit} className="flex items-end gap-2">
                        <div className="flex-grow">
                             <Label htmlFor="concentration-guess">Calculated Titrant Concentration (M)</Label>
                            <Input
                                id="concentration-guess"
                                type="number"
                                step="0.001"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                placeholder="Enter your calculation"
                            />
                        </div>
                        <Button type="submit">Check Answer</Button>
                    </form>
                ) : (
                    <Alert variant={isCorrect ? 'default' : 'destructive'} className={cn(isCorrect && "border-green-500/50 text-green-700 dark:text-green-400 [&>svg]:text-green-600")}>
                        {isCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        <AlertTitle>{isCorrect ? 'Correct!' : 'Needs Review'}</AlertTitle>
                        <AlertDescription>
                            Your calculated value of <strong>{userAnswer} M</strong> is {isCorrect ? 'correct' : 'incorrect'}. 
                            The actual concentration was <strong>{(titrationType === 'challenge' ? unknownConcentration : calculatedConcentration).toFixed(3)} M</strong>.
                            {isCorrect ? " Great job!" : " Review the M₁V₁=M₂V₂ formula and try again."}
                        </AlertDescription>
                        <Button onClick={onReset} variant="secondary" size="sm" className="mt-4">Run New Experiment</Button>
                    </Alert>
                )}
            </CardContent>
        </Card>
    )
}

const getTitrationInfo = (titrationType: TitrationType) => {
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
  const [view, setView] = useState<'simulation' | 'theory'>('simulation');

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
         const Kb_ammonia = 10**-pKb_ammonia;
         // Titrating Strong Acid (analyte) with Weak Base (titrant)
         if (baseVol < equivalencePoint) {
            // Excess strong acid
            const H_concentration = (initialMolesAnalyte - molesTitrantAdded) / totalVolume;
            return -Math.log10(H_concentration);
         } else if (baseVol === equivalencePoint) {
            // Equivalence point: only conjugate acid of weak base is present
            const NH4_concentration = initialMolesAnalyte / totalVolume;
            const Ka_ammonium = (1e-14) / Kb_ammonia;
            const H_concentration = Math.sqrt(Ka_ammonium * NH4_concentration);
            return -Math.log10(H_concentration);
         } else { 
            // Buffer region: excess weak base and its conjugate acid
            const molesB = molesTitrantAdded - initialMolesAnalyte;
            const molesBH_plus = initialMolesAnalyte;
            const pKa_ammonium = 14 - pKb_ammonia;
            return pKa_ammonium + Math.log10(molesB / molesBH_plus);
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
  }, [analyte.concentration, analyte.volume, titrantConcentration, titrationType, equivalencePoint]);

  const currentPH = useMemo(() => calculatePH(addedBaseVolume), [addedBaseVolume, calculatePH]);
  const equivalencePH = useMemo(() => calculatePH(equivalencePoint), [calculatePH, equivalencePoint]);

  const flaskColor = useMemo(() => {
    const ind = indicators[indicator];
    if (currentPH < ind.range[0]) return ind.acid;
    if (currentPH > ind.range[1]) return ind.base;
    if (ind.mid) {
      if (currentPH > (ind.range[0] + (ind.range[1]-ind.range[0])/2) ) {
          return ind.base;
      }
      return ind.mid;
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
  }, [isTitrating, calculatePH, maxBuretteVolume]);
  
  useEffect(() => {
    handleReset();
    if (titrationType === 'challenge') {
      setUnknownConcentration(Math.random() * (0.2 - 0.05) + 0.05);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titrationType]);

  const handleReset = useCallback(() => {
    setIsTitrating(false);
    setShowResults(false);
    setAddedBaseVolume(0);
    setTitrationData([]);
    if (titrationType === 'challenge') {
      setUnknownConcentration(Math.random() * (0.2 - 0.05) + 0.05);
    } else {
        setAnalyte({ volume: 25, concentration: 0.1 });
        setTitrant({ concentration: 0.1 });
    }
    setIndicator('phenolphthalein');
  }, [titrationType]);

  const handleTitrationToggle = () => {
    if (addedBaseVolume >= maxBuretteVolume && !isTitrating) {
        setShowResults(true);
    } else {
        setIsTitrating(!isTitrating);
        if (isTitrating) {
            setShowResults(true);
        }
    }
  }

  const isResettable = addedBaseVolume > 0 || isTitrating;
  const currentBeakerVolumeRatio = (analyte.volume + addedBaseVolume) / 100;
  
  const info = getTitrationInfo(titrationType);

  return (
    <div className="flex flex-col h-full">
        <Header 
            title="Acid-Base Titration"
            description="An interactive simulation of various acid-base titrations."
        />
        <Tabs value={view} onValueChange={(v) => setView(v as 'simulation' | 'theory')} className="flex-1">
             <div className="flex justify-center p-4 border-b">
                 <TabsList>
                    <TabsTrigger value="simulation">Simulation</TabsTrigger>
                    <TabsTrigger value="theory">Procedure & Theory</TabsTrigger>
                 </TabsList>
            </div>
            <TabsContent value="simulation" className="m-0">
                <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                            <>
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
                            <ExperimentQuiz 
                                equivalencePoint={equivalencePoint} 
                                unknownConcentration={unknownConcentration}
                                analyte={analyte}
                                titrant={titrant}
                                titrationType={titrationType}
                                onReset={handleReset}
                            />
                            </>
                        )}
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <Card className="flex flex-col items-center justify-center p-4 min-h-[550px] overflow-hidden bg-muted/20">
                        <div className="w-full h-[500px] flex items-end justify-center gap-4 relative">
                                {/* Lab Stand */}
                                <div className="absolute w-full h-full top-0 left-0 flex justify-center pointer-events-none">
                                    {/* Base */}
                                    <div className="absolute bottom-0 w-72 h-3 bg-gray-400 rounded-t-md border-b-4 border-gray-500"></div>
                                    {/* Pole */}
                                    <div className="absolute bottom-0 h-full w-3 bg-gray-400 rounded-sm" style={{left: 'calc(50% + 90px)'}}></div>
                                    {/* Clamp */}
                                    <div className="absolute bg-gray-500 rounded-md p-1 flex justify-between top-[20px] shadow-lg" style={{left: 'calc(50% - 20px)', width: '120px', height: '40px'}}>
                                        <div className="w-4 h-full bg-gray-600 rounded-l-md border-r border-gray-700"></div>
                                        <div className="text-xs text-white/50 self-center">Clamp</div>
                                        <div className="w-4 h-full bg-gray-600 rounded-r-md border-l border-gray-700"></div>
                                    </div>
                                    <div className="absolute top-[30px] left-1/2 w-6 h-12 bg-gray-500 rounded-sm" style={{transform: 'translateX(65px)'}}></div>
                                </div>

                                {/* Burette Setup */}
                                <div className="relative h-full w-24" style={{ transform: 'translateX(-40px)' }}>
                                    <div className="absolute top-0 w-full h-full z-10">
                                        <BuretteIcon />
                                        {/* Burette Liquid */}
                                        <div className="absolute bottom-[30px] left-[20px] right-[20px] top-[10px] rounded-b-lg overflow-hidden">
                                            <div className="absolute bottom-0 w-full bg-blue-300/50 transition-all duration-100" style={{ height: `${(1 - (addedBaseVolume / maxBuretteVolume)) * 100}%` }}>
                                                <div className="absolute top-0 w-full h-1 bg-blue-400/80"></div>
                                            </div>
                                        </div>
                                        {isTitrating && <Droplet className="absolute bottom-[2px] left-1/2 -translate-x-1/2 text-blue-500 animate-drip" />}
                                    </div>
                                </div>
                                
                                {/* Beaker Setup */}
                                <div className="relative w-48 h-48 mb-5" style={{ transform: 'translateX(-40px)' }}>
                                    <BeakerIcon />
                                    {/* Beaker Liquid */}
                                    <div className="absolute bottom-[7px] left-[21px] right-[13px] h-full overflow-hidden">
                                        <div className="absolute bottom-0 w-full transition-all duration-200" style={{ height: `${Math.min(currentBeakerVolumeRatio, 1) * 90}%` }}>
                                            {/* Liquid Color */}
                                            <div className="absolute bottom-0 w-full h-full transition-colors duration-300" style={{ backgroundColor: flaskColor, opacity: flaskColor === 'transparent' ? 0 : 0.6 }}></div>
                                            {/* Stirring animation */}
                                            {isTitrating && Array.from({length:5}).map((_, i) => (
                                                <div key={i} className="absolute bottom-0 w-1 h-1 bg-white/50 rounded-full animate-bubble"
                                                    style={{left: `${Math.random()*90+5}%`, animationDelay: `${Math.random()*2}s`, animationDuration: `${Math.random()*2+1}s`}}></div>
                                            ))}
                                        </div>
                                        {/* Magnetic Stirrer */}
                                        <div className={cn("absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-2 bg-gray-300 rounded-full border border-gray-400", isTitrating && "animate-spin-slow")}></div>
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
            </TabsContent>
             <TabsContent value="theory" className="m-0">
                <div className="p-4 md:p-8 max-w-4xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Titration: Procedure and Theory</CardTitle>
                            <CardDescription>Understanding the why and how of acid-base titrations.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 prose dark:prose-invert max-w-none">
                            <section>
                                <h3>Objective</h3>
                                <p>The primary goal of an acid-base titration is to determine the unknown concentration of a solution (the <strong>analyte</strong>) by reacting it with a solution of known concentration (the <strong>titrant</strong>). The reaction is complete at the <strong>equivalence point</strong>, where the moles of titrant added are stoichiometrically equal to the moles of analyte present.</p>
                            </section>
                            <section>
                                <h3>Standard Procedure</h3>
                                <ol>
                                    <li>A precise volume of the analyte is placed in a beaker or flask.</li>
                                    <li>A few drops of a chemical indicator are added to the analyte. The indicator is a substance that changes color at a specific pH.</li>
                                    <li>The titrant is slowly added from a burette, a long graduated tube with a stopcock to control the flow.</li>
                                    <li>The titrant is added until the indicator shows a permanent color change, marking the <strong>endpoint</strong>. The endpoint should be very close to the equivalence point if the correct indicator is chosen.</li>
                                    <li>The volume of titrant added is recorded from the burette.</li>
                                    <li>The unknown concentration is calculated using the formula: <strong>M₁V₁ = M₂V₂</strong>, where M and V are the molarity and volume of the acid and base.</li>
                                </ol>
                            </section>
                             <section>
                                <h3>Understanding Titration Curves</h3>
                                <p>A titration curve plots the pH of the analyte solution against the volume of titrant added. The shape of the curve reveals important information about the acid and base.</p>
                                <ul>
                                    <li><strong>Strong Acid - Strong Base:</strong> The curve starts at a low pH, has a very steep, nearly vertical section around the equivalence point (which is at pH 7), and ends at a high pH.</li>
                                    <li><strong>Weak Acid - Strong Base:</strong> The curve starts at a higher pH than a strong acid. It features a "buffer region" where the pH changes slowly. The equivalence point is above pH 7 because the conjugate base of the weak acid hydrolyzes water to produce OH⁻ ions.</li>
                                    <li><strong>Strong Acid - Weak Base:</strong> The curve starts at a low pH. It also has a buffer region. The equivalence point is below pH 7 because the conjugate acid of the weak base hydrolyzes water to produce H₃O⁺ ions.</li>
                                </ul>
                                <p>The <strong>half-equivalence point</strong> (where half the analyte has been neutralized) is also significant. For a weak acid titration, the pH at this point is equal to the pKa of the weak acid.</p>
                            </section>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>
        </Tabs>
    </div>
  );
}
