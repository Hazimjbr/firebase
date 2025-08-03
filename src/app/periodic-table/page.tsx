import Header from "@/components/header";
import PeriodicTable from "@/components/periodic-table";
import { Card, CardContent } from "@/components/ui/card";

export default function PeriodicTablePage() {
    return (
        <div className="flex flex-col h-full">
            <Header
                title="Interactive Periodic Table"
                description="Click on an element to see its details."
            />
            <div className="flex-1 p-8">
                <Card>
                    <CardContent className="p-2 sm:p-4">
                        <PeriodicTable />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
