import * as React from "react";
import { ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Threat {
  _id: string;
  threatType: string;
  attackerIp: string;
  severity: 'High' | 'Medium' | 'Low';
  timestamp: string;
}

interface ThreatStreamProps {
  threats: Threat[];
  loading: boolean;
  isLimitReached: boolean;
}

const severityColor: Record<string, string> = {
  High: "bg-red-500/10 text-red-500 border-red-500/20",
  Medium: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  Low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

export function ThreatStream({ threats, loading, isLimitReached }: ThreatStreamProps) {
  return (
    <Card className="bg-card border-border shadow-sm overflow-hidden">
      <CardHeader className="border-b border-border/50 pb-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            Live Threat Stream
          </CardTitle>
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
            Socket.IO Active
          </span>
        </div>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground bg-secondary/30">
                <th className="text-left py-3 px-6 font-bold uppercase tracking-widest text-[10px]">Vector</th>
                <th className="text-left py-3 px-6 font-bold uppercase tracking-widest text-[10px]">Attacker Index</th>
                <th className="text-left py-3 px-6 font-bold uppercase tracking-widest text-[10px]">Severity</th>
                <th className="text-left py-3 px-6 font-bold uppercase tracking-widest text-[10px]">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {threats.map((t) => (
                <tr
                  key={t._id}
                  className="hover:bg-secondary/50 transition-all duration-200"
                >
                  <td className="py-3 px-6">
                    <span className="text-foreground font-bold text-xs uppercase tracking-tight">{t.threatType}</span>
                  </td>
                  <td className="py-3 px-6 text-muted-foreground font-mono text-xs">
                    {t.attackerIp}
                  </td>
                  <td className="py-3 px-6">
                    <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase border ${severityColor[t.severity]}`}>
                      {t.severity}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-muted-foreground text-xs font-medium">
                    {new Date(t.timestamp).toLocaleTimeString([], { hour12: false })}
                  </td>
                </tr>
              ))}
              {!loading && threats.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-muted-foreground bg-secondary/10">
                    <div className="flex flex-col items-center gap-2">
                       <ShieldAlert className="w-6 h-6 text-muted-foreground opacity-20" />
                       <span className="text-xs font-medium uppercase tracking-widest">Awaiting intercepted traffic...</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
        </table>
      </div>
      {isLimitReached && (
        <div className="px-6 py-3 bg-red-500 text-white flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest">
          <ShieldAlert className="w-3.5 h-3.5" />
          Plan limit exceeded. Upgrade to PRO to resume real-time blocking.
        </div>
      )}
    </Card>
  );
}
