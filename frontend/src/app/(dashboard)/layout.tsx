import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background selection:bg-primary/20 text-foreground antialiased">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-10 py-12 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border">
        <div className="max-w-7xl mx-auto space-y-12">
          {children}
        </div>
      </main>
    </div>
  );
}
