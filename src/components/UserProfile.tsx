"use client";

import * as React from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";

interface UserProfileProps {
  variant?: "sidebar" | "settings";
  className?: string;
}

export function UserProfile({ variant = "sidebar", className }: UserProfileProps) {
  const { openUserProfile } = useClerk();
  const { user } = useUser();

  const Avatar = ({ size = "sm" }: { size?: "sm" | "md" }) => (
    <div className="relative group/avatar cursor-pointer" onClick={() => openUserProfile()}>
      <div className={cn(
        "rounded-full overflow-hidden border border-border group-hover/avatar:border-primary/50 transition-all duration-300 shadow-sm bg-secondary/20 flex items-center justify-center relative",
        size === "sm" ? "w-8 h-8" : "w-12 h-12"
      )}>
        {user?.imageUrl ? (
          <img 
            src={user.imageUrl} 
            alt="Profile" 
            className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-500 rounded-full" 
          />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground rounded-full">SOC</div>
        )}
        
        {/* Flash/Shine Effect */}
        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover/avatar:animate-shine pointer-events-none" />
      </div>
      <div className={cn("absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover/avatar:opacity-100 transition-opacity", size === "sm" ? "w-8 h-8" : "w-12 h-12")} />
    </div>
  );

  if (variant === "settings") {
    return (
      <div className={cn("flex items-center justify-between p-4 bg-secondary/30 border border-border rounded-xl group transition-all", className)}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar size="md" />
            <div className="absolute -bottom-1 -right-1 p-1 bg-primary rounded-full border-2 border-background shadow-lg">
              <Shield className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div className="flex flex-col text-left">
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
      <Avatar />
      <div className="flex flex-col text-left">
        <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Account</span>
        <span className="text-[11px] text-muted-foreground tracking-tight">Enterprise Console</span>
      </div>
    </div>
  );
}
