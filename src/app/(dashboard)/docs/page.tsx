"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Check, FileCode, Terminal, BookOpen, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DocsPage() {
  const { toast } = useToast();
  const { getToken } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tenant/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setProfile(await res.json());
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, [getToken]);

const apiKey = profile?.apiKeys?.[0]?.key || "sentinel_xxxxxxxxxxxxxxxx";
  const endpoint = "https://sentinelsoc-backend.onrender.com/api/v1/logs";

  const codeSnippet = `import { sentinelAgent } from 'sentinel-soc-agent';

app.use(sentinelAgent({
  apiKey: "${apiKey}",
  endpoint: "${endpoint}",
  block: true // Enable block-and-redirect flow
}));`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    if (text === codeSnippet) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    toast({ title: "Content copied!", variant: "success" });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 overflow-x-hidden px-4">
       {/* Hero Section */}
       <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6 group cursor-default">
             <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
             <span className="text-[10px] font-bold text-primary uppercase tracking-widest">v1.2.0 Released</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter mb-4 leading-[0.9]">
             Developer <span className="text-primary selection:bg-primary selection:text-white">Docs</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl font-medium leading-relaxed">
             Connect your infrastructure to the SentinelSOC Real-Time Engine in under 2 minutes.
          </p>
       </div>

       <div className="grid gap-16 w-full">
          {/* Step 1 */}
          <div className="min-w-0">
             <div className="space-y-6">
                <div className="flex items-center gap-4 md:gap-6">
                   <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary flex items-center justify-center text-white font-black text-lg md:text-xl shadow-2xl shadow-primary/30 shrink-0">1</div>
                   <div>
                      <h2 className="text-lg md:text-xl font-black text-foreground uppercase tracking-tighter">Install SDK</h2>
                      <p className="text-[9px] md:text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-0.5 md:mt-1 italic">npm-registry / node.js</p>
                   </div>
                </div>
                
                <div className="w-full max-w-full overflow-hidden border border-border rounded-2xl shadow-2xl flex flex-col">
                   <div className="w-full bg-[#0d1117] flex flex-col">
                      <div className="bg-card/80 border-b border-border px-4 md:px-6 py-3 md:py-4 flex items-center justify-between select-none">
                         <div className="flex gap-1.5 md:gap-2">
                            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/50" />
                            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-orange-500/50" />
                            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/50" />
                         </div>
                         <div className="flex items-center gap-2 px-3 md:px-4 py-1 md:py-1.5 bg-secondary/50 rounded-lg border border-border">
                            <Terminal className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                            <span className="text-[9px] md:text-[11px] text-muted-foreground font-bold tracking-[0.2em] uppercase">terminal</span>
                         </div>
                         <button 
                           onClick={() => handleCopy("npm install sentinel-soc-agent")}
                           className="p-1.5 md:p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all cursor-pointer border border-primary/20"
                         >
                            <Copy className="w-3.5 h-3.5 md:w-4 md:h-4" />
                         </button>
                      </div>
                      <div className="p-4 md:p-8 font-mono text-[10px] md:text-sm tracking-tight md:tracking-normal leading-relaxed bg-card/20">
                         <div className="flex items-start gap-3 md:gap-4 break-all whitespace-pre-wrap">
                            <span className="text-primary/40 font-bold">$</span>
                            <span className="text-foreground font-medium selection:bg-primary/30">npm install <span className="text-primary font-black">sentinel-soc-agent</span></span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Step 2 */}
          <div className="min-w-0">
             <div className="space-y-6">
                <div className="flex items-center gap-4 md:gap-6">
                   <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary flex items-center justify-center text-white font-black text-lg md:text-xl shadow-2xl shadow-primary/30 shrink-0">2</div>
                   <div>
                      <h2 className="text-lg md:text-xl font-black text-foreground uppercase tracking-tighter">Middleware Setup</h2>
                      <p className="text-[9px] md:text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-0.5 md:mt-1 italic">express.js / main entry</p>
                   </div>
                </div>
                
                <div className="w-full max-w-full overflow-hidden border border-border rounded-2xl shadow-2xl flex flex-col">
                   <div className="w-full bg-[#0d1117] flex flex-col">
                      <div className="bg-card/80 border-b border-border px-4 md:px-6 py-3 md:py-4 flex items-center justify-between select-none">
                         <div className="flex gap-1.5 md:gap-2">
                            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/50" />
                            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-orange-500/50" />
                            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/50" />
                         </div>
                         <div className="flex items-center gap-2 px-3 md:px-4 py-1 md:py-1.5 bg-secondary/50 rounded-lg border border-border">
                            <FileCode className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                            <span className="text-[9px] md:text-[11px] text-muted-foreground font-bold tracking-[0.2em] uppercase">app.js</span>
                         </div>
                         <button 
                           onClick={() => handleCopy(codeSnippet)}
                           className="p-1.5 md:p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all cursor-pointer border border-primary/20"
                         >
                            {copied ? <Check className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <Copy className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                         </button>
                      </div>

                      <div className="p-4 md:p-8 font-mono text-[10px] md:text-sm tracking-tight md:tracking-normal relative leading-relaxed bg-[#020617] text-slate-300">
                         <div className="space-y-1.5">
                            <div className="flex gap-3 md:gap-8">
                               <span className="text-slate-600/50 w-5 md:w-6 text-right select-none font-bold">1</span>
                               <span className="whitespace-pre-wrap break-all"><span className="text-purple-400">import</span> &#123; <span className="text-amber-400">sentinelAgent</span> &#125; <span className="text-purple-400">from</span> <span className="text-emerald-400">'sentinel-soc-agent'</span>;</span>
                            </div>
                            <div className="flex gap-3 md:gap-8">
                               <span className="text-slate-600/50 w-5 md:w-6 text-right select-none font-bold">2</span>
                               <span className="text-slate-500 italic opacity-50 font-medium whitespace-pre-wrap break-all">// Initialize defense engine</span>
                            </div>
                            <div className="flex gap-3 md:gap-8">
                               <span className="text-slate-600/50 w-5 md:w-6 text-right select-none font-bold">3</span>
                               <span className="whitespace-pre-wrap break-all"><span className="text-foreground">app</span>.<span className="text-amber-400">use</span>(<span className="text-amber-400">sentinelAgent</span>(&#123;</span>
                            </div>
                            <div className="flex gap-3 md:gap-8">
                               <span className="text-slate-600/50 w-5 md:w-6 text-right select-none font-bold">4</span>
                               <span className="ml-3 md:ml-8 whitespace-pre-wrap break-all"><span className="text-foreground">apiKey</span>: <span className="text-emerald-400">"{apiKey}"</span>,</span>
                            </div>
                            <div className="flex gap-3 md:gap-8">
                               <span className="text-slate-600/50 w-5 md:w-6 text-right select-none font-bold">5</span>
                               <span className="ml-3 md:ml-8 whitespace-pre-wrap break-all"><span className="text-foreground">endpoint</span>: <span className="text-emerald-400">"{endpoint}"</span>,</span>
                            </div>
                            <div className="flex gap-3 md:gap-8">
                               <span className="text-slate-600/50 w-5 md:w-6 text-right select-none font-bold">6</span>
                               <span className="ml-3 md:ml-8 whitespace-pre-wrap break-all"><span className="text-foreground">block</span>: <span className="text-amber-400">true </span> <span className="text-slate-500 italic ml-2 md:ml-3">// Enables automatic redirection</span></span>
                            </div>
                            <div className="flex gap-3 md:gap-8">
                               <span className="text-slate-600/50 w-5 md:w-6 text-right select-none font-bold">7</span>
                               <span className="whitespace-pre-wrap break-all">&#125;));</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>

        <div className="space-y-4">
           <h2 className="text-sm font-black text-foreground uppercase tracking-[0.3em]">Configuration Schema</h2>
           <div className="border border-border rounded-2xl shadow-2xl overflow-hidden">
              <table className="w-full text-left uppercase tracking-tighter md:tracking-wider">
                <thead className="bg-secondary/50 text-muted-foreground font-bold border-b border-border text-[9px] md:text-xs">
                   <tr>
                      <th className="px-2 md:px-6 py-3 md:py-4 w-min whitespace-nowrap">Parameter</th>
                      <th className="px-2 md:px-6 py-3 md:py-4 w-min whitespace-nowrap">Type</th>
                      <th className="px-3 md:px-6 py-3 md:py-4">Description</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-[9px] md:text-[10px] font-medium">
                   <tr className="bg-card/20 group hover:bg-primary/5 transition-colors">
                      <td className="px-2 md:px-6 py-3 md:py-4 font-mono text-primary font-bold whitespace-nowrap">apiKey</td>
                      <td className="px-2 md:px-6 py-3 md:py-4 text-muted-foreground whitespace-nowrap">String</td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-foreground leading-relaxed whitespace-normal break-words">Your unique SOC dashboard authentication token.</td>
                   </tr>
                   <tr className="bg-card/20 group hover:bg-primary/5 transition-colors">
                      <td className="px-2 md:px-6 py-3 md:py-4 font-mono text-primary font-bold whitespace-nowrap">endpoint</td>
                      <td className="px-2 md:px-6 py-3 md:py-4 text-muted-foreground whitespace-nowrap">URL</td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-foreground leading-relaxed whitespace-normal break-words">The SentinelSOC real-time ingestion API URL.</td>
                   </tr>
                   <tr className="bg-card/20 group hover:bg-primary/5 transition-colors">
                      <td className="px-2 md:px-6 py-3 md:py-4 font-mono text-primary font-bold whitespace-nowrap">block</td>
                      <td className="px-2 md:px-6 py-3 md:py-4 text-muted-foreground whitespace-nowrap">Boolean</td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-foreground leading-relaxed whitespace-normal break-words">Enables the redirection to our premium 'Access Denied' page.</td>
                   </tr>
                </tbody>
             </table>
          </div>
       </div>

        {/* Final Guidance */}
        <div className="bg-primary/10 border border-primary/30 p-6 md:p-8 rounded-3xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[80px] -mr-16 -mt-16 group-hover:bg-primary/40 transition-all duration-1000" />
           <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start relative z-10">
              <div className="p-4 rounded-2xl bg-primary/20 border border-primary/30 shadow-2xl shrink-0">
                 <ShieldCheck className="w-8 h-8 text-primary shadow-primary/50" />
              </div>
              <div className="space-y-2 text-center md:text-left">
                 <p className="text-sm font-black text-foreground uppercase tracking-widest leading-none">Developer Best Practice</p>
                 <p className="text-xs text-muted-foreground mt-3 leading-loose max-w-2xl font-medium">
                    For maximum security, never hardcode your <code className="bg-primary/20 px-2 py-0.5 rounded-md text-primary font-mono font-bold tracking-normal break-all">apiKey</code> in production code. 
                    We strongly recommend using environment variables (e.g., <code className="bg-primary/20 px-2 py-0.5 rounded-md text-primary font-mono font-bold break-all">process.env.SENTINEL_API_KEY</code>) to manage your credentials safely.
                 </p>
              </div>
           </div>
        </div>
    </div>
  );
}
