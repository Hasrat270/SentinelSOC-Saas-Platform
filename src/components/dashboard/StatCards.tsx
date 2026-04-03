import * as React from "react";
import { ShieldAlert, TrendingUp, CreditCard, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardsProps {
  stats: {
    totalToday: number;
    mostCommonType: string;
  } | null;
  profile: {
    subscriptionPlan: string;
  } | null;
  isConnected: boolean;
  loading: boolean;
}

export function StatCards({ stats, profile, isConnected, loading }: StatCardsProps) {
  const statCards = [
    {
      label: "Threats Today",
      value: stats?.totalToday ?? "0",
      icon: ShieldAlert,
    },
    {
      label: "Top Vector",
      value: stats?.mostCommonType ?? "None",
      icon: TrendingUp,
    },
    {
      label: "Plan Status",
      value: profile?.subscriptionPlan ?? "FREE",
      icon: CreditCard,
    },
    {
      label: "System Status",
      value: isConnected ? "Live" : "Connecting",
      icon: Zap,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {statCards.map(({ label, value, icon: Icon }) => (
        <Card
          key={label}
          className="bg-card border-border hover:border-primary/40 cursor-pointer transition-all duration-300 group shadow-sm relative overflow-hidden"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {label}
            </CardTitle>
            <div className={cn(
              "p-2.5 rounded-lg border transition-all duration-300",
              label === "Threats Today" && (stats?.totalToday || 0) > 0
                ? "bg-red-500/10 border-red-500/20 text-red-500 group-hover:bg-red-500 group-hover:text-white"
                : "bg-primary/10 border-primary/20 text-primary group-hover:bg-primary group-hover:text-white"
            )}>
              <Icon className="w-5 h-5 transition-colors" />
            </div>
          </CardHeader>
          <CardContent>
             <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-foreground tracking-tighter uppercase">
                  {loading ? (
                    <div className="h-8 w-20 bg-muted animate-pulse rounded" />
                  ) : (
                    value
                  )}
                </div>
                {label === "System Status" && isConnected && (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                     <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest">Active</span>
                  </div>
                )}
             </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-500" />
        </Card>
      ))}
    </div>
  );
}
