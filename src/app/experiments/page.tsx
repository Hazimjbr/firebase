import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const experiments = [
    {
        title: "Acid-Base Titration",
        description: "Determine the concentration of an unknown acid or base by neutralizing it with a solution of known concentration.",
        image: "https://placehold.co/600x400.png",
        hint: "chemistry lab",
        tags: ["Titration", "Acids & Bases", "Stoichiometry"],
    },
    {
        title: "Aspirin Synthesis",
        description: "Synthesize acetylsalicylic acid (aspirin) from salicylic acid and acetic anhydride.",
        image: "https://placehold.co/600x400.png",
        hint: "chemistry synthesis",
        tags: ["Organic Chemistry", "Synthesis", "Esterification"],
    },
    {
        title: "Exploring Gas Laws",
        description: "Investigate the relationships between pressure, volume, and temperature of a gas.",
        image: "https://placehold.co/600x400.png",
        hint: "science experiment",
        tags: ["Gas Laws", "Physical Chemistry", "PV=nRT"],
    },
    {
        title: "Redox Reactions",
        description: "Observe and analyze oxidation-reduction reactions, like the reaction between copper and nitric acid.",
        image: "https://placehold.co/600x400.png",
        hint: "chemical reaction",
        tags: ["Redox", "Electrochemistry", "Oxidation"],
    },
];

export default function ExperimentsPage() {
    return (
        <div className="flex flex-col h-full">
            <Header
                title="Virtual Experiments"
                description="Interact with chemistry concepts in a hands-on, virtual lab environment."
            />
            <div className="flex-1 p-8">
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {experiments.map((exp) => (
                        <Card key={exp.title} className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <CardHeader className="p-0">
                                <div className="relative h-48 w-full">
                                    <Image
                                        src={exp.image}
                                        alt={exp.title}
                                        fill
                                        className="object-cover"
                                        data-ai-hint={exp.hint}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 flex flex-col flex-grow">
                                <CardTitle className="mb-2">{exp.title}</CardTitle>
                                <CardDescription className="flex-grow">{exp.description}</CardDescription>
                                <div className="mt-4">
                                    <Button disabled>Start Experiment</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
