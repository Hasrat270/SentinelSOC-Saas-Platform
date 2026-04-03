"use client";

import { useState } from "react";
import { Terminal, Copy, Check, Code, Server, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Docs() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const installCmd = "npm install sentinel-soc-agent";
  const initCode = `import express from "express";
import { sentinelAgent } from "sentinel-soc-agent";

const app = express();

// 🛡️ Single line protection
app.use(sentinelAgent({
  apiKey: process.env.SENTINEL_API_KEY,
  strict: true
}));

app.listen(3000);`;

  return (
    <section id="docs" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Left Side: Text/Context */}
          <div className="lg:w-1/3 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary">
              <Code className="w-3 h-3" />
              Developer First
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Ready in <span className="text-primary italic">60 seconds.</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              SentinelSOC is designed to be invisible to your developers and invincible to your attackers. No complex configuration, no infrastructure bloat. Just security.
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Install Agent</h4>
                  <p className="text-xs text-muted-foreground">Add our lightweight middleware to your project packages.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Mount Middleware</h4>
                  <p className="text-xs text-muted-foreground">Import and initialize with your tenant API key.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Go Live</h4>
                  <p className="text-xs text-muted-foreground">Monitor real-time blocks from your Sentinel dashboard.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Code Showcase */}
          <div className="lg:w-2/3 w-full space-y-8">
            {/* Install Box */}
            <div className="rounded-xl border border-border/40 bg-card overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border/20 bg-muted/30">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-mono text-muted-foreground">terminal — bash</span>
                </div>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 gap-2 text-xs"
                    onClick={() => copyToClipboard(installCmd)}
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <div className="p-6 font-mono text-sm group relative">
                <span className="text-primary mr-2">$</span>
                <span className="group-hover:text-primary transition-colors">{installCmd}</span>
              </div>
            </div>

            {/* Code Box */}
            <div className="rounded-xl border border-border/40 bg-slate-950 overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-primary" />
                  <span className="text-xs font-mono text-slate-400">app.js — setup</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500/20" />
                  <div className="w-2 h-2 rounded-full bg-amber-500/20" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
                </div>
              </div>
              <div className="p-6 font-mono text-sm text-slate-300 leading-relaxed overflow-x-auto">
                <pre>
                    <code>
                      <span className="text-purple-400">import</span> express <span className="text-purple-400">from</span> <span className="text-emerald-400">"express"</span>;{"\n"}
                      <span className="text-purple-400">import</span> {"{"} <span className="text-amber-400">sentinelAgent</span> {"}"} <span className="text-purple-400">from</span> <span className="text-emerald-400">"sentinel-soc-agent"</span>;{"\n\n"}
                      <span className="text-blue-400">const</span> app = <span className="text-amber-400">express</span>();{"\n\n"}
                      <span className="text-slate-500">// 🛡️ Single line protection</span>{"\n"}
                      app.<span className="text-amber-400">use</span>(<span className="text-amber-400">sentinelAgent</span>({"{"}{"\n"}
                      {"  "}apiKey: process.<span className="text-blue-400">env</span>.SENTINEL_API_KEY,{"\n"}
                      {"  "}strict: <span className="text-amber-400">true</span>{"\n"}
                      {"}"}));{"\n\n"}
                      app.<span className="text-amber-400">listen</span>(<span className="text-emerald-400">3000</span>);
                    </code>
                </pre>
              </div>
            </div>

            {/* Status Footer */}
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-emerald-500" />
               </div>
               <div>
                  <p className="text-sm font-semibold text-emerald-500">Security Ready</p>
                  <p className="text-xs text-muted-foreground">SentinelSOC agents automatically sync with global threat databases every minute.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
    </section>
  );
}
