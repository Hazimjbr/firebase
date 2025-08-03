import { SidebarTrigger } from "@/components/ui/sidebar";

type HeaderProps = {
  title: string;
  description?: string;
};

export default function Header({ title, description }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b p-4 sm:px-8 h-24 flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className="md:hidden">
            <SidebarTrigger />
        </div>
    </header>
  );
}
