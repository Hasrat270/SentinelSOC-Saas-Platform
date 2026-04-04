"use client";

import { useSearchParams } from "next/navigation";
import { ShieldAlert, ArrowLeft, Terminal, Info, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import { cn } from "@/lib/utils";

function BlockedContent() {
  const searchParams = useSearchParams();
  const threatType = searchParams.get("threatType") || "Suspicious Activity";
  const ip = searchParams.get("ip") || "Unknown";
  const eventId = Math.random().toString(36).substring(2, 15).toUpperCase();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 selection:bg-destructive/20 selection:text-destructive">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-destructive/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Shield Header */}
        <div className="text-center space-y-4">
          <div className="relative inline-flex items-center justify-center">
             {/* Animation Rings */}
            <div className="absolute inset-0 animate-ping opacity-20 rounded-full bg-destructive" />
            <div className="absolute inset-4 animate-pulse opacity-40 rounded-full bg-destructive" />
            
            <div className="relative p-6 bg-destructive/10 border border-destructive/20 rounded-3xl shadow-[0_0_50px_-12px_rgba(239,68,68,0.3)]">
              <ShieldAlert className="w-16 h-16 text-destructive" strokeWidth={1.5} />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Access <span className="text-destructive">Denied</span>
            </h1>
            <p className="text-muted-foreground text-sm font-medium uppercase tracking-[0.2em]">
              SentinelSOC Protection Engine
            </p>
          </div>
        </div>

        {/* Message Container */}
        <div className="bg-card border border-destructive/20 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-foreground leading-relaxed text-center">
                Your request has been audited and blocked by our security filters 
                due to <span className="text-destructive font-bold">{threatType.replace(/_/g, ' ')}</span> patterns.
              </p>
            </div>

            {/* Technical Details Grid */}
            <div className="bg-background/50 border border-border/50 rounded-xl p-5 font-mono text-[11px] space-y-3">
              <div className="flex items-center justify-between border-b border-border/30 pb-2">
                <span className="text-muted-foreground uppercase flex items-center gap-2">
                  <Terminal className="w-3 h-3" /> Event ID
                </span>
                <span className="text-foreground font-bold">{eventId}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/30 pb-2">
                <span className="text-muted-foreground uppercase flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3" /> Threat Type
                </span>
                <span className="text-destructive font-bold">{threatType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground uppercase flex items-center gap-2">
                  <Info className="w-3 h-3" /> Origin IP
                </span>
                <span className="text-foreground font-bold">{ip}</span>
              </div>
            </div>

            {/* CTA Button */}
            <Button asChild className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs transition-all hover:scale-[1.02] active:scale-[0.98]">
              <Link href="/" className="flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Return to Safety
              </Link>
            </Button>
          </div>
        </div>

        {/* Footer Branding */}
        <div className="pt-8 text-center">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3">
            <span>Sentinel SOC</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>Cyber Defense</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function BlockedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-destructive/20 animate-pulse" />
      </div>
    }>
      <BlockedContent />
    </Suspense>
  );
}
