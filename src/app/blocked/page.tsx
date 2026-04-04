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
  const eventId = Math.random().toString(36).substring(2, 12).toUpperCase();

  return (
    <div className="h-[100dvh] w-full bg-background flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-destructive/20 selection:text-destructive overflow-hidden relative">
      {/* Background Glow Effect - Scaled down for mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-[10%] -left-[10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-destructive/10 rounded-full blur-[80px] sm:blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/10 rounded-full blur-[80px] sm:blur-[120px]" />
      </div>

      <div className="max-w-[340px] sm:max-w-md w-full space-y-6 sm:space-y-8 relative z-10 animate-in fade-in zoom-in-95 duration-700">
        {/* Shield Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="relative inline-flex items-center justify-center">
             {/* Animation Rings */}
            <div className="absolute inset-0 animate-ping opacity-10 rounded-full bg-destructive" />
            <div className="absolute inset-2 sm:inset-4 animate-pulse opacity-30 rounded-full bg-destructive" />
            
            <div className="relative p-4 sm:p-6 bg-destructive/10 border border-destructive/20 rounded-2xl sm:rounded-3xl shadow-[0_0_50px_-12px_rgba(239,68,68,0.3)]">
              <ShieldAlert className="w-10 h-10 sm:w-16 sm:h-16 text-destructive" strokeWidth={1.5} />
            </div>
          </div>
          
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-3xl font-black tracking-tighter text-foreground sm:text-5xl uppercase">
              Access <span className="text-destructive">Denied</span>
            </h1>
            <p className="text-muted-foreground text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.3em]">
              SentinelSOC Protection Engine
            </p>
          </div>
        </div>

        {/* Message Container */}
        <div className="bg-card/40 border border-destructive/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="space-y-4 sm:space-y-6">
            <p className="text-foreground leading-relaxed text-center text-xs sm:text-sm font-medium">
              Your request has been audited and blocked by our security filters 
              due to <span className="text-destructive font-black uppercase tracking-tight">{threatType.replace(/_/g, ' ')}</span> patterns.
            </p>

            {/* Technical Details Grid */}
            <div className="bg-background/40 border border-border/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 font-mono text-[9px] sm:text-[11px] space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between border-b border-border/30 pb-2">
                <span className="text-muted-foreground uppercase flex items-center gap-2">
                  <Terminal className="w-3 h-3 text-destructive/50" /> Event ID
                </span>
                <span className="text-foreground font-bold">{eventId}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/30 pb-2">
                <span className="text-muted-foreground uppercase flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3 text-destructive/50" /> Threat Vector
                </span>
                <span className="text-destructive font-black">{threatType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground uppercase flex items-center gap-2">
                  <Info className="w-3 h-3 text-destructive/50" /> Target IP
                </span>
                <span className="text-foreground font-bold">{ip}</span>
              </div>
            </div>

            {/* CTA Button */}
            <Button 
                onClick={() => {
                   if (typeof window !== 'undefined') {
                       window.history.length > 1 ? window.history.back() : window.location.href = 'https://google.com';
                   }
                }}
                className="w-full h-10 sm:h-12 bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 text-destructive font-black uppercase tracking-[0.2em] text-[9px] sm:text-[11px] transition-all"
            >
                <Link href="#" className="flex items-center justify-center gap-2">
                    <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Exit Site Securely
                </Link>
            </Button>
          </div>
        </div>

        {/* Footer Branding */}
        <div className="pt-4 sm:pt-8 text-center">
          <p className="text-[8px] sm:text-[10px] text-muted-foreground font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3">
            <span>Sentinel SOC</span>
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-destructive animate-pulse" />
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
