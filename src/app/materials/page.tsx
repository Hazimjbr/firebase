import Header from "@/components/header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const materials = [
  {
    title: "Atomic Structure",
    content: "The atomic structure of an element refers to the constitution of its nucleus and the arrangement of the electrons around it. An atom is composed of a central nucleus and surrounding electrons. The nucleus contains protons and neutrons. Protons are positively charged, neutrons have no charge, and electrons are negatively charged."
  },
  {
    title: "Chemical Bonds",
    content: "A chemical bond is a lasting attraction between atoms, ions or molecules that enables the formation of chemical compounds. The bond may result from the electrostatic force of attraction between oppositely charged ions as in ionic bonds or through the sharing of electrons as in covalent bonds."
  },
  {
    title: "Stoichiometry",
    content: "Stoichiometry is a section of chemistry that involves using relationships between reactants and/or products in a chemical reaction to determine desired quantitative data. In Greek, stoikhein means element and metron means measure, so stoichiometry literally translated means the measure of elements."
  },
  {
    title: "The Periodic Table",
    content: "The periodic table is a tabular arrangement of the chemical elements, ordered by their atomic number, electron configurations, and recurring chemical properties. The structure of the table shows periodic trends. The seven rows of the table, called periods, generally have metals on the left and nonmetals on the right."
  },
  {
    title: "Acids and Bases",
    content: "An acid is a molecule or ion capable of donating a proton (hydrogen ion H+), or, alternatively, capable of forming a covalent bond with an electron pair (a Lewis acid). A base is a substance that can accept protons or donate a pair of valence electrons to form a covalent bond. The pH scale measures acidity or alkalinity."
  }
];

export default function MaterialsPage() {
    return (
        <div className="flex flex-col h-full">
            <Header
                title="Learning Materials"
                description="Explore foundational topics in chemistry."
            />
            <div className="flex-1 p-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Core Concepts</CardTitle>
                        <CardDescription>Click a topic to expand and read the explanation.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {materials.map((item, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger className="text-lg hover:no-underline text-left">{item.title}</AccordionTrigger>
                                    <AccordionContent className="text-base text-muted-foreground">
                                        {item.content}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
