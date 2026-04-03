"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-lg border border-primary/20">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Sentinel<span className="text-primary">SOC</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/#features" className="hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="/#pricing" className="hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link
            href="/#docs"
            className="hover:text-foreground transition-colors"
          >
            Docs
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <SignInButton mode="modal">
            <Button variant="ghost" className="text-sm px-2 sm:px-4">
              <span className="hidden xs:inline">Sign In</span>
              <span className="xs:hidden">Login</span>
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button size="sm" className="hidden sm:flex">
              Get Started
            </Button>
          </SignUpButton>
        </div>
      </div>
    </nav>
  );
}
