'use client';

import { useEffect, useState } from 'react';
import { getChemistryFact } from '@/ai/flows/chemistry-fact-flow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ChemistryFact() {
  const [fact, setFact] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchFact = async () => {
    setIsLoading(true);
    try {
      const { fact } = await getChemistryFact();
      setFact(fact);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Could not fetch chemistry fact',
        description: 'An error occurred while fetching a new chemistry fact.',
        variant: 'destructive',
      });
      setFact('Could not load a new fact. Please try refreshing.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFact();

    const interval = setInterval(() => {
      fetchFact();
    }, 3600000); // 1 hour

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-accent/50 border-primary/20 border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Lightbulb />
          <span>حقيقة كيميائية</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="space-y-2">
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-[60%]" />
            </div>
        ) : (
          <p className="text-muted-foreground">{fact}</p>
        )}
      </CardContent>
    </Card>
  );
}
