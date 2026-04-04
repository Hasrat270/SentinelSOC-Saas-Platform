"use client";

import Link from "next/link";
import { Shield, ChevronRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent_50%)]" />
      <div className="container mx-auto px-6 relative text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-xs font-semibold text-primary mb-8">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          v1.0.1 Enterprise Guard Live
        </div>
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1] text-foreground">
          Secure Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-400">
            Applications
          </span>{" "}
          in Real-Time
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Enterprise-grade threat detection & blocking at the edge. Intercept XSS, SQLi, and Path
          Traversal attacks before they reach your server.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <SignUpButton mode="modal">
            <Button size="lg" className="h-12 w-full sm:w-auto px-8 text-base gap-2 group">
              Protect My App{" "}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </SignUpButton>
          <Button size="lg" variant="outline" className="h-12 w-full sm:w-auto px-8 text-base border-border/60" asChild>
            <Link href="https://www.npmjs.com/package/sentinel-soc-agent">View Agent on NPM</Link>
          </Button>
        </div>

        {/* Premium Dashboard Mockup Mini */}
        <div className="mt-16 md:mt-20 relative max-w-5xl mx-auto border border-border/40 rounded-2xl bg-gradient-to-b from-card/80 to-background p-1.5 md:p-2 shadow-2xl overflow-hidden group">
          <div className="bg-background rounded-xl h-80 md:h-[450px] flex flex-col border border-border/20 overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_center] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            
            {/* Mockup Title Bar */}
            <div className="h-10 border-b border-border/40 flex items-center px-4 justify-between bg-muted/30 relative z-10">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
              </div>
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Globe className="w-3 h-3" />
                <span className="hidden sm:inline">Live Threat Monitor — Node.01</span>
                <span className="sm:hidden">Threat Monitor</span>
              </div>
              <div className="w-10" />
            </div>

            <div className="flex-grow flex p-6 gap-6 relative z-10 overflow-hidden">
              {/* Simulated Sidebar */}
              <div className="hidden md:flex flex-col gap-4 w-40 shrink-0">
                <div className="h-3 w-full bg-primary/20 rounded-full" />
                <div className="space-y-2">
                  <div className="h-2 w-16 bg-muted rounded-full" />
                  <div className="h-2 w-20 bg-muted/60 rounded-full" />
                  <div className="h-2 w-14 bg-muted/40 rounded-full" />
                </div>
                <div className="mt-auto h-3 w-24 bg-muted rounded-full" />
              </div>

              {/* Simulated Log Stream */}
              <div className="flex-grow flex flex-col gap-2 md:gap-3 font-mono text-[10px] md:text-[11px] overflow-hidden">
                <div className="flex justify-between items-center mb-1 md:mb-2">
                  <span className="text-muted-foreground uppercase tracking-wider text-[8px] md:text-[9px]">Activity Stream</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-emerald-500 text-[8px] md:text-[9px]">SYSTEM SECURE</span>
                  </div>
                </div>

                {/* Log Entry 1: Secure */}
                <div className="p-2 md:p-3 rounded-lg border border-border/40 bg-card/40 flex items-center justify-between group-hover:translate-x-1 transition-transform cursor-default">
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-emerald-500">GET</span>
                    <span className="text-muted-foreground truncate max-w-[120px] md:max-w-none">/api/v1/health</span>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">200 OK</span>
                </div>

                {/* Log Entry 2: BLOCKED! */}
                <div className="p-2 md:p-3 rounded-lg border border-red-500/30 bg-red-500/5 flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-red-500">POST</span>
                    <span className="text-foreground truncate max-w-[100px] md:max-w-none">/api/.../login</span>
                    <span className="text-red-500/60 hidden lg:inline">"UNION SELECT..."</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Shield className="w-3 h-3 text-red-500" />
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">BLOCKED SQLi</span>
                  </div>
                </div>

                {/* Log Entry 3: Secure */}
                <div className="p-2 md:p-3 rounded-lg border border-border/40 bg-card/40 flex items-center justify-between group-hover:translate-x-1 transition-transform cursor-default delay-75">
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-emerald-500">GET</span>
                    <span className="text-muted-foreground">/dashboard/threat-logs</span>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">200 OK</span>
                </div>

                {/* Log Entry 4: BLOCKED! (Hidden on mobile to prevent overflow) */}
                <div className="hidden sm:flex p-3 rounded-lg border border-red-500/30 bg-red-500/5 items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-red-500">GET</span>
                    <span className="text-foreground">/etc/passwd</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-red-500" />
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">BLOCKED TRAVERSAL</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
          {/* Decorative Corner Glow */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
