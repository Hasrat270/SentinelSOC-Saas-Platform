import Sidebar from "@/components/Sidebar";
import { MobileSidebar } from "@/components/MobileSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background selection:bg-primary/20 text-foreground antialiased relative overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Mobile-only Sidebar & Header */}
      <MobileSidebar />

      <main className="flex-1 min-w-0 h-full overflow-y-auto px-6 py-20 lg:px-10 lg:py-12 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border max-w-full">
        <div className="max-w-7xl mx-auto space-y-12">
          {children}
        </div>
      </main>
    </div>
  );
}
