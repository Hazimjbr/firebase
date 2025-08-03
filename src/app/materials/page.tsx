import Header from "@/components/header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const materials = [
  {
    title: "التركيب الذري",
    content: "يشير التركيب الذري للعنصر إلى تكوين نواته وترتيب الإلكترونات حولها. تتكون الذرة من نواة مركزية وإلكترونات محيطة بها. تحتوي النواة على بروتونات ونيوترونات. البروتونات موجبة الشحنة، والنيوترونات ليس لها شحنة، والإلكترونات سالبة الشحنة."
  },
  {
    title: "الروابط الكيميائية",
    content: "الرابطة الكيميائية هي تجاذب دائم بين الذرات أو الأيونات أو الجزيئات يمكّن من تكوين المركبات الكيميائية. قد تنتج الرابطة عن القوة الكهروستاتيكية للتجاذب بين الأيونات المتعاكسة الشحنة كما في الروابط الأيونية أو من خلال مشاركة الإلكترونات كما في الروابط التساهمية."
  },
  {
    title: "قياس اتحادية العناصر",
    content: "قياس اتحادية العناصر (الستوكيومترية) هو قسم من الكيمياء يتضمن استخدام العلاقات بين المتفاعلات و/أو النواتج في تفاعل كيميائي لتحديد البيانات الكمية المطلوبة. في اللغة اليونانية، تعني كلمة 'stoikhein' عنصرًا وكلمة 'metron' تعني قياسًا، لذا فإن قياس اتحادية العناصر يعني حرفيًا قياس العناصر."
  },
  {
    title: "الجدول الدوري",
    content: "الجدول الدوري هو ترتيب جدولي للعناصر الكيميائية، مرتبة حسب عددها الذري، وتكويناتها الإلكترونية، وخصائصها الكيميائية المتكررة. يوضح هيكل الجدول الاتجاهات الدورية. الصفوف السبعة في الجدول، التي تسمى الدورات، تحتوي بشكل عام على معادن على اليسار ولا فلزات على اليمين."
  },
  {
    title: "الأحماض والقواعد",
    content: "الحمض هو جزيء أو أيون قادر على التبرع ببروتون (أيون الهيدروجين H+)، أو بدلاً من ذلك، قادر على تكوين رابطة تساهمية مع زوج من الإلكترونات (حمض لويس). القاعدة هي مادة يمكنها قبول البروتونات أو التبرع بزوج من إلكترونات التكافؤ لتكوين رابطة تساهمية. يقيس مقياس الأس الهيدروجيني (pH) الحموضة أو القلوية."
  }
];

export default function MaterialsPage() {
    return (
        <div className="flex flex-col h-full">
            <Header
                title="المواد التعليمية"
                description="استكشف المواضيع الأساسية في الكيمياء."
            />
            <div className="flex-1 p-8">
                <Card>
                    <CardHeader>
                        <CardTitle>المفاهيم الأساسية</CardTitle>
                        <CardDescription>انقر على موضوع لتوسيعه وقراءة الشرح.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {materials.map((item, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger className="text-lg hover:no-underline text-right">{item.title}</AccordionTrigger>
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
