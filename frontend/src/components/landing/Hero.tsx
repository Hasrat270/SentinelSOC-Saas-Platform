"use client";

import Link from "next/link";
import { Shield, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent_50%)]" />
      <div className="container mx-auto px-6 relative text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-xs font-semibold text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          v1.0.1 Enterprise Guard Live
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700">
          Secure Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-400">
            Applications
          </span>{" "}
          in Real-Time
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000">
          Enterprise-grade threat detection & blocking at the edge. Intercept XSS, SQLi, and Path
          Traversal attacks before they reach your server.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000">
          <SignUpButton mode="modal">
            <Button size="lg" className="h-12 px-8 text-base gap-2 group">
              Protect My App{" "}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </SignUpButton>
          <Button size="lg" variant="outline" className="h-12 px-8 text-base border-border/60" asChild>
            <Link href="https://www.npmjs.com/package/sentinel-soc-agent">View Agent on NPM</Link>
          </Button>
        </div>

        {/* Abstract Dashboard Mockup Mini */}
        <div className="mt-20 relative max-w-5xl mx-auto border border-border/40 rounded-2xl bg-gradient-to-b from-card/80 to-background p-2 shadow-2xl animate-in fade-in zoom-in duration-1000">
          <div className="bg-background rounded-xl h-64 md:h-96 flex items-center justify-center border border-border/20 overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_center] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            <div className="flex flex-col items-center gap-4 relative z-10">
              <Shield className="w-16 h-16 text-primary/40 animate-pulse" />
              <div className="flex gap-2">
                <div className="h-1.5 w-12 bg-primary/20 rounded-full" />
                <div className="h-1.5 w-24 bg-primary/40 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
