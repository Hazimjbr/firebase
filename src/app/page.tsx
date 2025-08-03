import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, BookOpen, FlaskConical, NotebookText } from "lucide-react";
import Header from "@/components/header";
import ChemistryFact from "@/components/chemistry-fact";

const features = [
  {
    title: "التجارب الافتراضية",
    description: "انخرط في التعلم العملي من خلال إجراء تجارب كيميائية افتراضية.",
    href: "/experiments",
    icon: FlaskConical
  },
  {
    title: "الاختبارات التفاعلية",
    description: "اختبر معلوماتك مع اختبارات تغطي مجموعة واسعة من مواضيع الكيمياء.",
    href: "/quizzes",
    icon: NotebookText
  },
  {
    title: "المواد التعليمية",
    description: "استكشف شروحات متعمقة لمفاهيم الكيمياء الأساسية.",
    href: "/materials",
    icon: BookOpen
  },
];

export default function Home() {
  return (
    <div className="flex flex-col h-full">
      <Header title="لوحة التحكم" description="أهلاً بك في ChemInteractive! رحلتك في عالم الكيمياء تبدأ هنا." />
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
                    استكشف
                    <ArrowLeft className="mr-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="mt-8 bg-gradient-to-br from-primary/80 to-primary text-primary-foreground">
          <CardHeader>
              <CardTitle>عن ChemInteractive</CardTitle>
              <CardDescription className="text-primary-foreground/80">منصة مدعومة بالذكاء الاصطناعي مصممة لجعل تعلم الكيمياء بديهيًا وجذابًا.</CardDescription>
          </CardHeader>
          <CardContent>
              <p className="text-primary-foreground/90">
                  يوفر ChemInteractive مجموعة شاملة من الأدوات، من جدول دوري مفصل إلى تحليل الأداء القائم على الذكاء الاصطناعي. هدفنا هو تبسيط المواضيع المعقدة وتوفير مسارات تعلم مخصصة. انطلق وابدأ في استكشاف عالم الكيمياء الرائع!
              </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
