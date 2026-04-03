import * as React from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Globe } from "lucide-react";

const CHART_COLORS = [
  "oklch(0.65 0.18 250)", /* Indigo */
  "oklch(0.85 0.2 150)",  /* Green */
  "oklch(0.6 0.25 25)",   /* Red */
  "oklch(0.5 0.2 300)",   /* Purple */
  "oklch(0.7 0.01 240)",  /* Gray */
];

interface SecurityChartsProps {
  stats: {
    hourlyThreats: { _id: string; count: number }[];
    threatsByType: { _id: string; count: number }[];
  } | null;
}

export function SecurityCharts({ stats }: SecurityChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 bg-card border-border shadow-sm group">
        <CardHeader className="border-b border-border/50 pb-4">
          <CardTitle className="text-foreground text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Security Activity (24h)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={stats?.hourlyThreats.map(h => ({
                time: new Date(h._id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                count: h.count
              })) || []}
            >
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.1} />
              <XAxis 
                dataKey="time" 
                stroke="var(--muted-foreground)" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="var(--muted-foreground)" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '6px', 
                  fontSize: '11px',
                  color: 'var(--foreground)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="var(--primary)" 
                fillOpacity={1} 
                fill="url(#colorCount)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-card border-border shadow-sm group">
        <CardHeader className="border-b border-border/50 pb-4">
          <CardTitle className="text-foreground text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            Threat Vectors
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex flex-col items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats?.threatsByType || []}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={8}
                dataKey="count"
                nameKey="_id"
                stroke="none"
              >
                {(stats?.threatsByType || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '6px', 
                  fontSize: '11px',
                  color: 'var(--foreground)' 
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 w-full px-4">
            {(stats?.threatsByType || []).slice(0, 4).map((t, i) => (
              <div key={t._id} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                <span className="text-[10px] text-muted-foreground truncate font-medium uppercase tracking-tighter">{t._id}</span>
                <span className="text-[10px] text-foreground font-bold ml-auto tabular-nums">{t.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
