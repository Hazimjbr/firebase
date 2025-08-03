import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const experiments = [
    {
        title: "المعايرة الحمضية القاعدية",
        description: "تحديد تركيز حمض أو قاعدة غير معروفة عن طريق معادلته بمحلول ذي تركيز معروف.",
        image: "https://placehold.co/600x400.png",
        hint: "chemistry lab",
        tags: ["Titration", "Acids & Bases", "Stoichiometry"],
    },
    {
        title: "تخليق الأسبرين",
        description: "تخليق حمض أسيتيل الساليسيليك (الأسبرين) من حمض الساليسيليك وأنهيدريد الخل.",
        image: "https://placehold.co/600x400.png",
        hint: "chemistry synthesis",
        tags: ["Organic Chemistry", "Synthesis", "Esterification"],
    },
    {
        title: "استكشاف قوانين الغازات",
        description: "التحقيق في العلاقات بين الضغط والحجم ودرجة حرارة الغاز.",
        image: "https://placehold.co/600x400.png",
        hint: "science experiment",
        tags: ["Gas Laws", "Physical Chemistry", "PV=nRT"],
    },
    {
        title: "تفاعلات الأكسدة والاختزال",
        description: "ملاحظة وتحليل تفاعلات الأكسدة والاختزال، مثل التفاعل بين النحاس وحمض النيتريك.",
        image: "https://placehold.co/600x400.png",
        hint: "chemical reaction",
        tags: ["Redox", "Electrochemistry", "Oxidation"],
    },
];

export default function ExperimentsPage() {
    return (
        <div className="flex flex-col h-full">
            <Header
                title="التجارب الافتراضية"
                description="تفاعل مع مفاهيم الكيمياء في بيئة معملية افتراضية وعملية."
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
                                    <Button disabled>ابدأ التجربة</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
