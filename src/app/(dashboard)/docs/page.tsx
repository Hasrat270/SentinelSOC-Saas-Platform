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
  block: true 
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
    <div className="max-w-4xl mx-auto space-y-12 sm:space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 px-1">
       {/* Hero Section */}
       <div className="text-center space-y-4">
         <div className="inline-flex items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-primary/10 border border-primary/20 mb-2">
           <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
         </div>
         <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground uppercase">
           Developer <span className="text-primary">Docs</span>
         </h1>
         <p className="text-muted-foreground max-w-2xl mx-auto text-[10px] sm:text-sm font-bold uppercase tracking-widest leading-relaxed">
           Connect your infrastructure in under 2 minutes.
         </p>
       </div>

       <div className="grid gap-12 sm:gap-16">
          {/* Step 1 */}
          <div className="space-y-4 sm:space-y-6">
             <div className="flex items-center gap-4 sm:gap-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-2xl shadow-primary/30 shrink-0">1</div>
                <div>
                   <h2 className="text-lg sm:text-xl font-black text-foreground uppercase tracking-tighter">Install SDK</h2>
                   <p className="text-[8px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-0.5 italic">npm-registry / node.js</p>
                </div>
             </div>
             
             <div className="bg-[#0d1117] rounded-2xl overflow-hidden shadow-2xl border border-border group relative">
                <div className="bg-card/80 border-b border-border px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between select-none">
                   <div className="hidden sm:flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-orange-500/50" />
                      <div className="w-3 h-3 rounded-full bg-green-500/50" />
                   </div>
                   <div className="flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-lg border border-border">
                      <Terminal className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                      <span className="text-[9px] sm:text-[11px] text-muted-foreground font-bold tracking-[0.2em] uppercase">terminal</span>
                   </div>
                   <button 
                     onClick={() => handleCopy("npm install sentinel-soc-agent")}
                     className="p-1.5 sm:p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all cursor-pointer border border-primary/20"
                   >
                      <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                   </button>
                </div>
                <div className="p-5 sm:p-8 font-mono text-[11px] sm:text-sm leading-relaxed bg-card/20">
                   <div className="flex items-center gap-3 sm:gap-4">
                      <span className="text-primary/40 font-bold">$</span>
                      <span className="text-foreground font-medium">npm install <span className="text-primary font-black">sentinel-soc-agent</span></span>
                   </div>
                </div>
             </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-4 sm:space-y-6">
             <div className="flex items-center gap-4 sm:gap-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-2xl shadow-primary/30 shrink-0">2</div>
                <div>
                   <h2 className="text-lg sm:text-xl font-black text-foreground uppercase tracking-tighter">Middleware Setup</h2>
                   <p className="text-[8px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-0.5 italic">express.js / main entry</p>
                </div>
             </div>
             
             <div className="bg-[#0d1117] rounded-2xl overflow-hidden shadow-2xl border border-border">
                <div className="bg-card/80 border-b border-border px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                   <div className="hidden sm:flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-orange-500/50" />
                      <div className="w-3 h-3 rounded-full bg-green-500/50" />
                   </div>
                   <div className="flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-lg border border-border">
                      <FileCode className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                      <span className="text-[9px] sm:text-[11px] text-muted-foreground font-bold tracking-[0.2em] uppercase">app.js</span>
                   </div>
                   <button 
                     onClick={() => handleCopy(codeSnippet)}
                     className="p-1.5 sm:p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
                   >
                      {copied ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                   </button>
                </div>

                <div className="p-5 sm:p-8 font-mono bg-[#020617] text-slate-300">
                   <div className="space-y-1.5 overflow-x-auto text-[11px] sm:text-[13px] custom-scrollbar pb-2">
                       <code className="block whitespace-pre">
{`import { sentinelAgent } from 'sentinel-soc-agent';

app.use(sentinelAgent({
  apiKey: "${apiKey.slice(0, 15)}...", 
  endpoint: "${endpoint.slice(0, 20)}...",
  block: true 
}));`}
                       </code>
                   </div>
                </div>
             </div>
          </div>
       </div>

       {/* Config Reference */}
       <div className="space-y-4">
          <h2 className="text-[10px] sm:text-sm font-black text-foreground uppercase tracking-[0.3em]">Configuration Schema</h2>
          <div className="overflow-x-auto border border-border rounded-2xl custom-scrollbar">
             <table className="w-full text-left text-[9px] sm:text-xs uppercase tracking-wider min-w-[500px] sm:min-w-0">
                <thead className="bg-secondary/50 text-muted-foreground font-bold border-b border-border">
                   <tr>
                      <th className="px-4 sm:px-6 py-3 sm:py-4">Parameter</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4">Type</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4">Description</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-[8px] sm:text-[10px]">
                   <tr className="bg-card/20 group hover:bg-primary/5 transition-colors">
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-mono text-primary font-bold">apiKey</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-muted-foreground">String</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-foreground leading-relaxed">Your unique SOC dashboard authentication token.</td>
                   </tr>
                   <tr className="bg-card/20 group hover:bg-primary/5 transition-colors">
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-mono text-primary font-bold">endpoint</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-muted-foreground">URL</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-foreground leading-relaxed">The real-time ingestion API URL.</td>
                   </tr>
                </tbody>
             </table>
          </div>
       </div>

       {/* Final Guidance */}
       <div className="bg-primary/10 border border-primary/30 p-5 sm:p-8 rounded-3xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start relative z-10">
             <div className="p-3 sm:p-4 rounded-2xl bg-primary/20 border border-primary/30 shadow-2xl shrink-0">
                <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
             </div>
             <div className="space-y-2">
                <p className="text-xs sm:text-sm font-black text-foreground uppercase tracking-widest leading-none">Developer Best Practice</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 leading-loose max-w-2xl font-medium">
                   Never hardcode your <code className="bg-primary/20 px-1 rounded text-primary">apiKey</code>. 
                   Use environment variables (e.g., <code className="bg-primary/20 px-1 rounded text-primary">process.env...</code>) to manage credentials safely.
                </p>
             </div>
          </div>
       </div>
    </div>
  );
}
