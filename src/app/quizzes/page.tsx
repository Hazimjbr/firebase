import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, HelpCircle } from "lucide-react";
import Link from "next/link";
import { quizzes } from "@/data/quizzes";

export default function QuizzesPage() {
    return (
        <div className="flex flex-col h-full">
            <Header
                title="Interactive Quizzes"
                description="Test your understanding of key chemistry concepts."
            />
            <div className="flex-1 p-8">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {quizzes.map((quiz) => (
                        <Card key={quiz.id} className="flex flex-col hover:shadow-xl transition-shadow duration-300">
                            <CardHeader>
                                <CardTitle>{quiz.title}</CardTitle>
                                <CardDescription>{quiz.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow flex flex-col justify-between">
                                <div className="flex items-center text-sm text-muted-foreground space-x-4 mb-4">
                                    <div className="flex items-center">
                                        <HelpCircle className="mr-1.5 h-4 w-4" />
                                        {quiz.questions.length} Questions
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="mr-1.5 h-4 w-4" />
                                        {quiz.time} min
                                    </div>
                                </div>
                                <Button asChild>
                                    <Link href={`/quizzes/${quiz.id}`}>Start Quiz</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
