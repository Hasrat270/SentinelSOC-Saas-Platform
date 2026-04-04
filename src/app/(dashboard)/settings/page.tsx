"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Key, Copy, RefreshCw, Eye, EyeOff, Shield } from "lucide-react";
import { UserProfile } from "@/components/UserProfile";

export default function SettingsPage() {
  const { toast } = useToast();
  const { getToken } = useAuth();
  const [apiKeys, setApiKeys] = useState<{ key: string; name: string }[]>([]);
  const [subscriptionPlan, setSubscriptionPlan] = useState<"FREE" | "PRO">("FREE");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTenant = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tenant/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setApiKeys(data.apiKeys || []);
        setSubscriptionPlan(data.subscriptionPlan);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenant();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const primaryKey = apiKeys.length > 0 ? apiKeys[0].key : null;

  const copyToClipboard = () => {
    if (!primaryKey) return;
    navigator.clipboard.writeText(primaryKey);
    toast({ title: "Primary API Key copied to clipboard", variant: "success" });
  };

  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/subscription/create-portal`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
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
    } finally {
      setUpgrading(false);
    }
  };

  const maskedKey = primaryKey
    ? primaryKey.slice(0, 12) + "•".repeat(20) + primaryKey.slice(-4)
    : "No keys available";

  return (
    <div className="space-y-8 max-w-4xl pb-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Console Settings</h1>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed max-w-2xl">
          Configure your enterprise environment, manage high-performance API credentials, and review subscription status.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subscription Card */}
        <Card className="bg-card border-border shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="border-b border-border/50 pb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <RefreshCw className="w-4.5 h-4.5 text-primary" />
                </div>
                <CardTitle className="text-foreground text-[11px] font-bold uppercase tracking-widest">Subscription Tier</CardTitle>
              </div>
              {subscriptionPlan === "PRO" ? (
                <span className="bg-primary/10 text-primary text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border border-primary/20">
                  Enterprise PRO
                </span>
              ) : (
                <span className="bg-secondary text-muted-foreground text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border border-border">
                  Standard FREE
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6 flex-1">
            <div className="space-y-1">
              <p className="text-sm font-bold text-foreground">
                {subscriptionPlan === "PRO" ? "Sentinel Enterprise PRO" : "Sentinel Standard Instance"}
              </p>
              <p className="text-xs text-muted-foreground italic leading-relaxed">
                {subscriptionPlan === "PRO" 
                  ? "Infinite audit capacity and real-time blocking active across all regions."
                  : "Capped at 500 monthly events. Retention limited to 7-day rolling window."
                }
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Monthly Bandwidth</p>
                <p className="text-lg font-bold text-foreground font-mono">
                  {subscriptionPlan === "PRO" ? "∞" : "500 EVO"}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Cold Storage</p>
                <p className="text-lg font-bold text-foreground font-mono">
                  {subscriptionPlan === "PRO" ? "30D" : "7D"}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/50 bg-secondary/10 p-4">
            {subscriptionPlan === "FREE" && (
              <Button 
                onClick={handleUpgrade}
                disabled={upgrading || loading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-[11px] uppercase tracking-widest h-10 transition-all shadow-lg shadow-primary/20"
              >
                {upgrading ? "Provisioning..." : "Upgrade to PRO"}
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card className="bg-card border-border shadow-sm overflow-hidden">
          <CardHeader className="border-b border-border/50 pb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Key className="w-4.5 h-4.5 text-primary" />
              </div>
              <CardTitle className="text-foreground text-[11px] font-bold uppercase tracking-widest">Secret Credentials</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <p className="text-[11px] text-muted-foreground italic leading-relaxed">
              Your primary system authentication token. For multi-key management and rotation, visit the dashboard.
            </p>

            <div className="flex items-center gap-3 bg-background/50 border border-border rounded-lg px-4 py-3 group hover:border-primary/20 transition-all">
              <code className="flex-1 font-mono text-[10px] text-primary font-bold tracking-[0.2em] overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity">
                {loading ? (
                  <span className="animate-pulse opacity-20">...</span>
                ) : visible ? (
                  primaryKey || "NOT_ASSIGNED"
                ) : (
                  maskedKey
                )}
              </code>
              <button
                onClick={() => setVisible((v) => !v)}
                className="text-muted-foreground hover:text-primary transition-all p-1"
                disabled={!primaryKey}
              >
                {visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 border-border text-[10px] uppercase tracking-widest font-bold bg-card hover:bg-secondary transition-all h-9"
                onClick={copyToClipboard}
                disabled={!primaryKey}
              >
                <Copy className="w-3.5 h-3.5 mr-2" />
                Copy Secret
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Identity Card */}
      <Card className="bg-card border-border shadow-sm overflow-hidden max-w-2xl">
        <CardHeader className="border-b border-border/50 pb-5">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
               <Shield className="w-4.5 h-4.5 text-primary" />
             </div>
             <CardTitle className="text-foreground text-[11px] font-bold uppercase tracking-widest">Enterprise Identity</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
           <UserProfile variant="settings" />
           <p className="text-[10px] text-muted-foreground mt-4 uppercase tracking-tighter leading-tight italic">
             Management of security credentials and multi-factor authentication is handled via the cloud authentication provider.
           </p>
        </CardContent>
      </Card>
    </div>
  );
}
