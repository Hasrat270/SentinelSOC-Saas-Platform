"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ShieldAlert, Zap, CheckCircle2, Loader2 } from "lucide-react";
import { useSocket } from "@/hooks/useSocket";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Refactored Modular Components
import { StatCards } from "@/components/dashboard/StatCards";
import { SecurityCharts } from "@/components/dashboard/SecurityCharts";
import { ThreatStream } from "@/components/dashboard/ThreatStream";
import { ApiKeyManager } from "@/components/dashboard/ApiKeyManager";

interface Threat {
  _id: string;
  threatType: string;
  attackerIp: string;
  severity: 'High' | 'Medium' | 'Low';
  timestamp: string;
}

interface DashboardStats {
  totalToday: number;
  mostCommonType: string;
  threatsByType: { _id: string; count: number }[];
  hourlyThreats: { _id: string; count: number }[];
  recentThreats: Threat[];
}

interface TenantProfile {
  tenantId: string;
  apiKeys: { key: string; name: string; createdAt: string }[];
  subscriptionPlan: 'FREE' | 'PRO';
  logCount: number;
}

import { Suspense } from "react";

function DashboardContent() {
  const { getToken } = useAuth();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [profile, setProfile] = useState<TenantProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [revoking, setRevoking] = useState(false);

  const { socket, isConnected } = useSocket(profile?.tenantId);

  const fetchData = React.useCallback(async () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    
    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL is not defined in environment variables");
      toast({
        title: "Configuration Error",
        description: "Backend URL is missing. Please check your environment variables.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      const token = await getToken();
      const headers = { Authorization: `Bearer ${token}` };

      console.log(`[Dashboard] Fetching data from ${backendUrl}`);
      
      const [profileRes, statsRes] = await Promise.all([
        fetch(`${backendUrl}/tenant/me`, { headers }),
        fetch(`${backendUrl}/dashboard-stats`, { headers })
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
        console.log("[Dashboard] Profile loaded:", profileData.tenantId);
      } else {
        console.error("[Dashboard] Profile fetch failed:", profileRes.status);
        if (profileRes.status === 401) {
          toast({ title: "Session expired. Please sign in again.", variant: "destructive" });
        } else {
          toast({ title: "Failed to load tenant profile", variant: "destructive" });
        }
      }

      if (statsRes.ok) {
        setStats(await statsRes.json());
      }

    } catch (err) {
      console.error("[Dashboard] Failed to fetch data", err);
      toast({
        title: "Connection Error",
        description: "Could not reach the security engine. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [getToken, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Subscription Success Redirect with Auto-Retry
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast({
        title: "Subscription Activated!",
        description: "Updating your account status... Please wait a moment.",
        variant: "success"
      });
      
      let attempts = 0;
      const maxAttempts = 3;
      
      const retryFetch = async () => {
        await fetchData();
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(retryFetch, 3000);
        } else {
          // Clear the success param after all retries
          const params = new URLSearchParams(searchParams.toString());
          params.delete("success");
          router.replace(`${pathname}?${params.toString()}`);
        }
      };

      retryFetch();
    }
  }, [searchParams, fetchData, pathname, router, toast]);

  useEffect(() => {
    if (!socket) return;

    socket.on('new-threat', (newThreat: Threat) => {
      toast({
        title: `Security Alert: ${newThreat.threatType}`,
        description: `Source: ${newThreat.attackerIp}`,
        variant: newThreat.severity === "High" ? "threat" : newThreat.severity === "Medium" ? "warning" : "low"
      });
      setStats(prev => {
        if (!prev) return null;
        return {
          ...prev,
          totalToday: prev.totalToday + 1,
          recentThreats: [newThreat, ...prev.recentThreats].slice(0, 50)
        };
      });
    });

    socket.on('limit-reached', (data) => {
      toast({
        title: "⚠️ Monthly Log Limit Reached",
        description: "New threats are currently being blocked. Please upgrade to PRO.",
        variant: "destructive"
      });
      setProfile(prev => prev ? { ...prev, logCount: data.logCount } : null);
    });

    return () => {
      socket.off('new-threat');
      socket.off('limit-reached');
    };
  }, [socket, toast]);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim() || creating) return;
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      toast({ title: "Configuration error. Backend URL is missing.", variant: "destructive" });
      return;
    }

    setCreating(true);
    try {
      const token = await getToken();
      const res = await fetch(`${backendUrl}/tenant/keys`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newKeyName })
      });
      
      if (res.ok) {
        const data = await res.json();
        setProfile(prev => prev ? { ...prev, apiKeys: data.apiKeys } : null);
        setNewKeyName("");
        toast({ title: "New API Key generated!", variant: "success" });
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("[Dashboard] Key generation failed:", res.status, errorData);
        toast({ title: errorData.error || "Failed to generate key", variant: "destructive" });
      }
    } catch (err) {
      console.error("[Dashboard] Network error during key generation:", err);
      toast({ title: "Network error. Could not connect to the server.", variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const handleRevokeKey = async (key: string) => {
    setRevoking(true);
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tenant/keys/${key}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(prev => prev ? { ...prev, apiKeys: data.apiKeys } : null);
        toast({ title: "API Key revoked", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Failed to revoke key", variant: "destructive" });
    } finally {
      setRevoking(false);
    }
  };


  const isLimitReached = profile?.subscriptionPlan === 'FREE' && (profile?.logCount ?? 0) >= 500;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out relative pb-20">
      {isLimitReached && (
        <div className="sticky top-0 z-50 -mx-8 -mt-8 mb-8 bg-red-600 text-white py-3 px-8 text-center text-[11px] font-bold shadow-lg flex items-center justify-center gap-2 animate-in slide-in-from-top duration-500 uppercase tracking-widest">
          <ShieldAlert className="w-4 h-4" />
          <span>Monthly Log Limit Reached. Protection is paused. Please Upgrade to PRO.</span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-tight">System Status</h1>
          <p className="text-muted-foreground text-[10px] mt-1 font-bold uppercase tracking-widest">
            Real-time security monitoring active for <span className="font-mono text-primary font-bold">SOC-{profile?.tenantId.slice(-6).toUpperCase()}</span>
          </p>
        </div>
        
        {profile?.subscriptionPlan === 'FREE' && (
           <button 
             onClick={async () => {
               try {
                 const token = await getToken();
                 const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/subscription/create-portal`, {
                   method: 'POST',
                   headers: { Authorization: `Bearer ${token}` }
                 });
                 const data = await res.json();
                 if (res.ok && data.url) {
                   window.location.href = data.url;
                 } else {
                   toast({ title: data.error || "Failed to initiate checkout", variant: "destructive" });
                 }
               } catch (err) {
                 console.error(err);
                 toast({ title: "Network error. Please try again.", variant: "destructive" });
               }
             }}
             className={cn(
               "px-5 py-2.5 text-white text-[10px] font-bold rounded-lg transition-all shadow-lg flex items-center gap-2 group uppercase tracking-widest cursor-pointer",
               isLimitReached 
                 ? "bg-red-600 animate-pulse shadow-red-500/20" 
                 : "bg-primary hover:bg-primary/90 shadow-primary/20"
             )}
           >
             {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 group-hover:fill-current transition-all" />}
             Upgrade to PRO
           </button>
        )}
      </div>

      <ApiKeyManager 
        apiKeys={profile?.apiKeys || []}
        creating={creating}
        newKeyName={newKeyName}
        setNewKeyName={setNewKeyName}
        handleCreateKey={handleCreateKey}
        handleRevokeKey={handleRevokeKey}
        revoking={revoking}
      />

      <StatCards 
        stats={stats}
        profile={profile}
        isConnected={isConnected}
        loading={loading}
      />

      <SecurityCharts stats={stats} />

      <ThreatStream 
        threats={stats?.recentThreats || []}
        loading={loading}
        isLimitReached={isLimitReached}
      />
    </div>
  );
}
export default function OverviewPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
