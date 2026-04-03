"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Check, FileCode, Terminal, BookOpen, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DocsPage() {
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

  const apiKey = profile?.apiKey || "YOUR_API_KEY";
  const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/logs`;

  const codeSnippet = `import { sentinelAgent } from 'sentinel-soc-agent';

app.use(sentinelAgent({
  apiKey: "${apiKey}",
  endpoint: "${endpoint}"
}));`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    if (text === codeSnippet) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    toast.success("Content copied!");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-20">
       {/* Hero Section */}
       <div>
         <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
           <BookOpen className="w-8 h-8 text-primary" />
           Integration Guide
         </h1>
         <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
           Implement enterprise-grade traffic interception in minutes. Follow the steps below to connect your Node.js infrastructure.
         </p>
       </div>

       <div className="grid gap-12">
          {/* Step 1 */}
          <div className="space-y-5">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">1</div>
                <div>
                   <h2 className="text-lg font-bold text-foreground uppercase tracking-tight">Install the SDK</h2>
                   <p className="text-xs text-muted-foreground">Add the sentinel agent to your project dependencies</p>
                </div>
             </div>
             {/* CMD Window 1 */}
             <div className="bg-[#0d1117] rounded-xl overflow-hidden shadow-2xl border border-border group">
                <div className="bg-card/80 border-b border-border px-5 py-3 flex items-center justify-between select-none">
                   <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-orange-500/50" />
                      <div className="w-3 h-3 rounded-full bg-green-500/50" />
                   </div>
                   <div className="flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-md border border-border">
                      <Terminal className="w-3.5 h-3.5 text-primary" />
                      <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">terminal</span>
                   </div>
                   <div className="w-12 text-right">
                      <button 
                        onClick={() => handleCopy("npm install sentinel-soc-agent")}
                        className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      >
                         <Copy className="w-4 h-4" />
                      </button>
                   </div>
                </div>
                <div className="p-6 font-mono text-[13px] leading-relaxed bg-card/20">
                   <div className="flex items-center gap-3">
                      <span className="text-primary opacity-50">$</span>
                      <span className="text-foreground font-medium selection:bg-primary/30">npm install <span className="text-primary font-bold">sentinel-soc-agent</span></span>
                   </div>
                </div>
             </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-6">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">2</div>
                <div>
                   <h2 className="text-lg font-bold text-foreground uppercase tracking-tight">Initialize Middleware</h2>
                   <p className="text-xs text-muted-foreground">Inject the security agent into your Express stack</p>
                </div>
             </div>
             
             {/* Code Window */}
             <div className="bg-[#0d1117] rounded-xl overflow-hidden shadow-2xl border border-border group">
                {/* Header */}
                <div className="bg-card/80 border-b border-border px-5 py-3 flex items-center justify-between select-none">
                   <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-orange-500/50" />
                      <div className="w-3 h-3 rounded-full bg-green-500/50" />
                   </div>
                   <div className="flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-md border border-border">
                      <FileCode className="w-3.5 h-3.5 text-primary" />
                      <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">app.js</span>
                   </div>
                   <div className="w-12 text-right">
                      <button 
                        onClick={() => handleCopy(codeSnippet)}
                        className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      >
                         {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                   </div>
                </div>

                {/* Editor */}
                <div className="p-8 font-mono text-[13px] relative leading-relaxed bg-card/20">
                   <div className="space-y-1 overflow-x-auto">
                      <div className="flex gap-6">
                         <span className="text-muted-foreground/30 w-5 text-right select-none">1</span>
                         <span className="whitespace-nowrap"><span className="text-primary opacity-80">import</span> &#123; <span className="text-foreground">sentinelAgent</span> &#125; <span className="text-primary opacity-80">from</span> <span className="text-primary">'sentinel-soc-agent'</span>;</span>
                      </div>
                      <div className="flex gap-6">
                         <span className="text-muted-foreground/30 w-5 text-right select-none">2</span>
                         <span className="text-muted-foreground italic opacity-50">// Connect agent with your credentials</span>
                      </div>
                      <div className="flex gap-6">
                         <span className="text-muted-foreground/30 w-5 text-right select-none">3</span>
                         <span className="whitespace-nowrap"><span className="text-foreground">app</span>.<span className="text-primary">use</span>(<span className="text-primary">sentinelAgent</span>(&#123;</span>
                      </div>
                      <div className="flex gap-6">
                         <span className="text-muted-foreground/30 w-5 text-right select-none">4</span>
                         <span className="ml-6 whitespace-nowrap"><span className="text-foreground">apiKey</span>: <span className="text-primary">"{apiKey}"</span>,</span>
                      </div>
                      <div className="flex gap-6">
                         <span className="text-muted-foreground/30 w-5 text-right select-none">5</span>
                         <span className="ml-6 whitespace-nowrap"><span className="text-foreground">endpoint</span>: <span className="text-primary">"{endpoint}"</span></span>
                      </div>
                      <div className="flex gap-6">
                         <span className="text-muted-foreground/30 w-5 text-right select-none">6</span>
                         <span className="whitespace-nowrap">&#125;));</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>

       {/* Security Notice */}
       <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl relative overflow-hidden group">
          <div className="flex gap-5 items-start relative z-10">
             <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20">
                <ShieldCheck className="w-5 h-5 text-primary" />
             </div>
             <div>
                <p className="text-sm font-bold text-foreground uppercase tracking-widest leading-none">Security Best Practice</p>
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed max-w-2xl">
                   Protect your credentials by using environment variables. Never commit your <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary font-mono font-bold">apiKey</code> directly to version control.
                </p>
             </div>
          </div>
       </div>
    </div>
  );
}
