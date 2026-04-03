"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-secondary/20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Scalable Protection</h2>
          <p className="text-muted-foreground text-lg">Choose the tier that fits your growth.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* FREE TIER */}
          <div className="p-8 rounded-3xl border border-border/40 bg-card flex flex-col">
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-2">Free Starter</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
            </div>
            <div className="space-y-4 mb-10 flex-grow">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="bg-primary/20 p-0.5 rounded-full">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </div>
                <span>Up to 500 Threat Logs / month</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="bg-primary/20 p-0.5 rounded-full">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </div>
                <span>Real-Time Dashboard Access</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="bg-primary/20 p-0.5 rounded-full">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </div>
                <span>Email Alerts (Weekly)</span>
              </div>
            </div>
            <SignInButton mode="modal">
              <Button variant="outline" className="w-full h-12 text-base">
                Get Started Free
              </Button>
            </SignInButton>
          </div>

          {/* PRO TIER */}
          <div className="p-8 rounded-3xl border-2 border-primary bg-card relative shadow-[0_0_40px_-15px_rgba(79,70,229,0.5)]">
            <div className="absolute -top-4 right-8 bg-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase text-white shadow-xl">
              Most Popular
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-2">Enterprise Pro</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
            </div>
            <div className="space-y-4 mb-10 flex-grow">
              <div className="flex items-center gap-3 text-sm font-medium">
                <div className="bg-primary p-0.5 rounded-full">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <span>Unlimited Threat Logging</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                <div className="bg-primary p-0.5 rounded-full">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <span>Priority IPS Blocking Nodes</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                <div className="bg-primary p-0.5 rounded-full">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <span>Advanced PDF Threat Reports</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                <div className="bg-primary p-0.5 rounded-full">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <span>24/7 Dedicated Slack Support</span>
              </div>
            </div>
            <SignUpButton mode="modal">
              <Button className="w-full h-12 text-base bg-primary hover:bg-primary/90">
                Upgrade to Pro
              </Button>
            </SignUpButton>
          </div>
        </div>
      </div>
    </section>
  );
}
