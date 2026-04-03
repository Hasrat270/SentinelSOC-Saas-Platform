"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Shield, Zap, Target, Activity } from "lucide-react";

const areaData = [
  { name: "00:00", threats: 120 },
  { name: "04:00", threats: 300 },
  { name: "08:00", threats: 200 },
  { name: "12:00", threats: 450 },
  { name: "16:00", threats: 380 },
  { name: "20:00", threats: 520 },
  { name: "23:59", threats: 410 },
];

const pieData = [
  { name: "SQL Injection", value: 45, color: "#4f46e5" },
  { name: "XSS", value: 30, color: "#8b5cf6" },
  { name: "Path Traversal", value: 25, color: "#c084fc" },
];

export default function MetricShowcase() {
  return (
    <section className="py-20 bg-muted/30 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Enterprise-Grade Resilience</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our global edge network processes millions of requests per second, blocking thousands of attacks in real-time before they even touch your infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Card */}
          <div className="lg:col-span-2 p-6 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Threats Neutralized (24h)
                </h3>
                <p className="text-xs text-muted-foreground">Rolling 24-hour attack interception metrics</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-primary">2.4k</span>
                <p className="text-[10px] text-emerald-500 font-mono tracking-tighter">+12% vs yesterday</p>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData}>
                  <defs>
                    <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#ffffff40" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#ffffff40" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid #ffffff20", borderRadius: "8px" }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="threats"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorThreats)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribution + Stats Column */}
          <div className="flex flex-col gap-8">
            {/* Pie Chart Card */}
            <div className="p-6 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm shadow-xl flex-grow">
              <h3 className="text-sm font-semibold mb-6 flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Attack Vectors
              </h3>
              <div className="h-[180px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-mono">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stat Cards */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-xl border border-border/40 bg-card/50">
                <Zap className="w-4 h-4 text-amber-500 mx-auto mb-2" />
                <div className="text-xl font-bold">24ms</div>
                <div className="text-[10px] text-muted-foreground uppercase">Latency</div>
              </div>
              <div className="p-4 rounded-xl border border-border/40 bg-card/50">
                <Shield className="w-4 h-4 text-primary mx-auto mb-2" />
                <div className="text-xl font-bold">99.9%</div>
                <div className="text-[10px] text-muted-foreground uppercase">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
