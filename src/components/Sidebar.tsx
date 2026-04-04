"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk, useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShieldAlert,
  Settings,
  BookOpen,
  Shield,
  LogOut,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const navLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/threat-logs", label: "Threat Logs", icon: ShieldAlert },
  { href: "/docs", label: "Docs", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface TenantProfile {
  tenantId: string;
  subscriptionPlan: 'FREE' | 'PRO';
  logCount: number;
}

export function SidebarContent() {
  const { signOut, openUserProfile } = useClerk();
  const { user } = userUser();
  const { getToken } = useAuth();
  const { toast } = useToast();
  const pathname = usePathname();
  const [profile, setProfile] = useState<TenantProfile | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tenant/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setProfile(await res.json());
      } catch (err) {
        console.error("Failed to fetch sidebar profile", err);
      }
    };
    fetchProfile();
    const interval = setInterval(fetchProfile, 30000);
    return () => clearInterval(interval);
  }, [getToken]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    toast({
      title: "Signing out...",
      description: "Securely ending your SOC session.",
    });
    
    setTimeout(() => {
      signOut({ redirectUrl: "/" });
    }, 1000);
  };

  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10 px-2 lg:block">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary shadow-lg shadow-primary/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground whitespace-nowrap">
            Sentinel<span className="text-primary">SOC</span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary border-r-2 border-primary rounded-r-none"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <Icon className={cn(
                "size-4 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Usage Monitor */}
      <div className="mt-auto px-2 pb-6 space-y-4">
          <div className="p-4 bg-secondary/30 border border-border rounded-xl space-y-3">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <span>Log Usage</span>
                  <span className={cn(
                    "font-mono",
                    (profile?.logCount || 0) >= 450 ? "text-red-500" : "text-primary"
                  )}>
                    {profile?.logCount || 0} / 500
                  </span>
              </div>
              <div className="h-1.5 w-full bg-background rounded-full overflow-hidden border border-border">
                  <div 
                    className={cn(
                        "h-full transition-all duration-1000",
                        (profile?.logCount || 0) >= 450 ? "bg-red-500" : "bg-primary"
                    )}
                    style={{ width: `${Math.min(((profile?.logCount || 0) / 500) * 100, 100)}%` }}
                  />
              </div>
              <p className="text-[9px] text-muted-foreground uppercase tracking-tight leading-tight">
                {profile?.subscriptionPlan === 'FREE' ? "Free tier limit: 500 logs/mo" : "Pro tier: Unlimited logs"}
              </p>
          </div>
      </div>

      {/* User Section */}
      <div className="pt-6 border-t border-border flex items-center gap-4 px-2">
         <div className="relative group shrink-0">
            <button 
              onClick={() => openUserProfile()}
              className="relative w-9 h-9 rounded-full overflow-hidden border border-border group-hover:border-primary/50 transition-all duration-300 shadow-sm bg-secondary/20 flex items-center justify-center"
              title="Manage Account"
            >
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground">SOC</div>
              )}
              
              {/* Flash/Shine Effect */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:animate-shine" />
            </button>
            
            {/* Status Badge - Digital Identity Style */}
            <div className="absolute -bottom-0.5 -right-0.5 p-1 bg-primary rounded-full border-2 border-background shadow-lg z-10 scale-90 group-hover:scale-100 transition-transform duration-300">
               <Shield className="w-2.5 h-2.5 text-white" />
            </div>
         </div>

         <button 
           onClick={handleLogout}
           disabled={isLoggingOut}
           className="flex-1 flex items-center gap-2.5 p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/5 transition-all duration-200 group border border-transparent hover:border-red-500/10"
         >
            {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin text-red-500" /> : <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
            <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Logout</span>
         </button>
      </div>
    </>
  );
}

function userUser() {
    const { user } = useUser();
    return { user };
}

export default function Sidebar() {
  return (
    <>
      {/* Spacer to maintain layout flow on desktop */}
      <div className="hidden lg:block w-64 shrink-0" />
      
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-30 w-64 bg-card border-r border-border px-4 py-8 flex-col transition-colors duration-500">
        <SidebarContent />
      </aside>
    </>
  );
}
