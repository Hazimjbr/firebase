import TitrationExperiment from '@/components/titration-experiment';

export default function ExperimentPage({ params }: { params: { id: string } }) {
  // Currently, we only have the titration experiment.
  // This could be expanded to load different experiments based on the id.
  if (params.id === 'acid-base-titration') {
    return <TitrationExperiment />;
  }

  // Fallback for other experiments that are not yet created.
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Experiment Not Found</h1>
        <p className="text-muted-foreground">This virtual experiment has not been created yet.</p>
      </div>
    </div>
  );
}
