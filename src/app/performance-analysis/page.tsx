import Header from "@/components/header";
import PerformanceAnalysisForm from "@/components/performance-analysis-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export default function PerformanceAnalysisPage() {
  return (
    <div className="flex flex-col h-full">
      <Header
        title="تحليل الأداء"
        description="دع الذكاء الاصطناعي يحلل نتائجك لإيجاد فجوات المعرفة واقتراح الموارد."
      />
      <div className="flex-1 p-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PerformanceAnalysisForm />
          </div>
          <div className="lg:col-span-1">
             <Card className="bg-secondary/50 sticky top-28">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="text-primary"/>
                        كيف يعمل
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                    <p><strong>١. إدخال البيانات:</strong> الصق نتائج اختباراتك وتجاربك الأخيرة بصيغة JSON. توفر القيم الافتراضية مثالاً على الهيكل المطلوب.</p>
                    <p><strong>٢. إضافة سياق:</strong> صف بإيجاز المادة الدراسية أو المواضيع التي تدرسها حاليًا. هذا يساعد الذكاء الاصطناعي على فهم سياق نتائجك.</p>
                    <p><strong>٣. الحصول على رؤى:</strong> انقر على "تحليل" وسيقوم الذكاء الاصطناعي بمعالجة المعلومات لتحديد فجوات المعرفة المحتملة لديك والتوصية بموارد تعليمية مخصصة.</p>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
