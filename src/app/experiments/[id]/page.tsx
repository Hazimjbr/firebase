'use client';
import { useState, use } from 'react';
import Header from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const experimentsData: { [key: string]: any } = {
    'acid-base-titration': {
        title: 'Acid-Base Titration',
        description: 'In this experiment, you will determine the concentration of an unknown acid by titrating it with a base of known concentration (NaOH at 0.1 M).',
        initialState: {
            acidVolume: 25, // mL
            baseConcentration: 0.1, // M
            baseVolume: 0, // mL
            finalPH: 0,
            equivalencePoint: 25, // theoretical
        },
    }
};

function Experiment({ id }: { id: string }) {
    const experiment = experimentsData[id];
    const [baseVolume, setBaseVolume] = useState(0);
    const [result, setResult] = useState<string | null>(null);

    if (!experiment) {
        return <div>Experiment not found</div>;
    }

    const runTitration = () => {
        const equivalencePoint = experiment.initialState.equivalencePoint;
        let message;
        if (baseVolume < equivalencePoint - 2) {
            message = `pH is still very acidic. You are far from the equivalence point. Keep adding base.`;
        } else if (baseVolume >= equivalencePoint -2 && baseVolume < equivalencePoint) {
            message = `The pH is rising quickly. You are approaching the equivalence point. Add base drop by drop.`;
        } else if (baseVolume == equivalencePoint) {
            message = `Equivalence point reached! The solution has been neutralized. The pH is 7.`;
        } else if (baseVolume > equivalencePoint && baseVolume < equivalencePoint + 2) {
            message = `You've passed the equivalence point. The solution is now basic.`;
        } else {
            message = `The solution is strongly basic. You have added a large excess of base.`;
        }
        setResult(message);
    }

    return (
        <div className="flex flex-col h-full">
            <Header
                title={experiment.title}
                description="Follow the steps to complete the virtual experiment."
            />
            <div className="flex-1 p-8">
                <div className="grid gap-8 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Experiment Setup</CardTitle>
                            <CardDescription>{experiment.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div>
                                <h3 className="font-semibold">Initial Conditions</h3>
                                <p className="text-sm text-muted-foreground">
                                    - Volume of Acid (e.g., HCl): {experiment.initialState.acidVolume} mL <br />
                                    - Concentration of Base (NaOH): {experiment.initialState.baseConcentration} M
                                </p>
                           </div>
                           <div className="space-y-2">
                                <Label htmlFor="base-volume">Volume of Base Added (mL)</Label>
                                <Input 
                                    id="base-volume" 
                                    type="number" 
                                    value={baseVolume}
                                    onChange={(e) => setBaseVolume(parseFloat(e.target.value))}
                                    placeholder="Enter volume in mL"
                                />
                           </div>
                           <Button onClick={runTitration}>Add Base & Observe</Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-muted/30">
                        <CardHeader>
                            <CardTitle>Observations</CardTitle>
                             <CardDescription>The results of your actions will be displayed here.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {result ? (
                                <Alert>
                                    <Terminal className="h-4 w-4" />
                                    <AlertTitle>Result</AlertTitle>
                                    <AlertDescription>
                                        {result}
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">
                                    No actions taken yet. Adjust the volume of base and click the button to see what happens.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default function ExperimentPage({ params }: { params: { id: string } }) {
    const { id } = use(params);
    return <Experiment id={id} />;
}
