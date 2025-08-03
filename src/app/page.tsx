import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BookOpen, FlaskConical, NotebookText } from "lucide-react";
import Header from "@/components/header";
import ChemistryFact from "@/components/chemistry-fact";

const features = [
  {
    title: "Virtual Experiments",
    description: "Engage in hands-on learning by conducting virtual chemistry experiments.",
    href: "/experiments",
    icon: FlaskConical
  },
  {
    title: "Interactive Quizzes",
    description: "Test your knowledge with quizzes covering a wide range of chemistry topics.",
    href: "/quizzes",
    icon: NotebookText
  },
  {
    title: "Learning Materials",
    description: "Explore in-depth explanations of fundamental chemistry concepts.",
    href: "/materials",
    icon: BookOpen
  },
];

export default function Home() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" description="Welcome to ChemInteractive! Your chemistry journey starts here." />
      <div className="flex-1 p-8">
        <div className="mb-8">
            <ChemistryFact />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">{feature.title}</CardTitle>
                <feature.icon className="w-6 h-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 h-10">{feature.description}</p>
                <Button asChild variant="secondary" className="bg-primary/10 text-primary-foreground hover:bg-primary/20">
                  <Link href={feature.href}>
                    Explore
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="mt-8 bg-gradient-to-br from-primary/80 to-primary text-primary-foreground">
          <CardHeader>
              <CardTitle>About ChemInteractive</CardTitle>
              <CardDescription className="text-primary-foreground/80">An AI-powered platform designed to make learning chemistry intuitive and engaging.</CardDescription>
          </CardHeader>
          <CardContent>
              <p className="text-primary-foreground/90">
                  ChemInteractive provides a comprehensive suite of tools, from a detailed periodic table to AI-driven performance analysis. Our goal is to simplify complex topics and provide personalized learning paths. Dive in and start exploring the fascinating world of chemistry!
              </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
