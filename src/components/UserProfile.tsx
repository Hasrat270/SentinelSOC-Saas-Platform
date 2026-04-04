"use client";

import * as React from "react";
import { UserButton, useClerk } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";

interface UserProfileProps {
  variant?: "sidebar" | "settings";
  className?: string;
}

export function UserProfile({ variant = "sidebar", className }: UserProfileProps) {
  const { openUserProfile } = useClerk();

  if (variant === "settings") {
    return (
      <div className={cn("flex items-center justify-between p-4 bg-secondary/30 border border-border rounded-xl group transition-all", className)}>
        <div className="flex items-center gap-4">
          <div className="relative shrink-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-border/50 shadow-md relative bg-secondary/20 flex items-center justify-center transition-all duration-300">
               <UserButton appearance={{ elements: { userButtonAvatarBox: "w-12 h-12", userButtonTrigger: "outline-none" } }} />
               
               {/* Flash/Shine Effect */}
               <div className="absolute top-0 -inset-full h-full w-1/2 z-10 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:animate-shine pointer-events-none" />
            </div>
            
            {/* Status Badge - Fixed Version */}
            <div className="absolute -bottom-0.5 -right-0.5 p-1 bg-primary rounded-full border-2 border-background shadow-lg z-20 scale-90 group-hover:scale-110 transition-transform duration-300">
               <Shield className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">Digital Identity</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Authenticated SOC Analyst</span>
          </div>
        </div>
        <button 
          onClick={() => openUserProfile()}
          className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 bg-secondary hover:bg-secondary/80 border border-border rounded-lg transition-all"
        >
          Manage Profile
        </button>
      </div>
    );
  }

  return (
    <div 
      onClick={() => openUserProfile()}
      className={cn(
        "flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-all duration-200 group cursor-pointer",
        className
      )}
    >
      <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 rounded-lg" } }} />
      <div className="flex flex-col text-left">
        <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Account</span>
        <span className="text-[11px] text-muted-foreground tracking-tight">Enterprise Console</span>
      </div>
    </div>
  );
}
