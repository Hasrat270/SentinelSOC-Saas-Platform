"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { io, Socket } from "socket.io-client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Wifi, Terminal, Filter, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThreatLog {
  _id: string;
  threatType: string;
  attackerIp: string;
  severity: "Low" | "Medium" | "High";
  payload?: string;
  timestamp: string;
}

function ThreatLogsContent() {
  const { toast } = useToast();
  const { getToken } = useAuth();
  const [logs, setLogs] = useState<ThreatLog[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const limit = 50;

  const fetchLogs = async (token: string | null, pageNum: number) => {
    try {
      if (!token) token = await getToken();
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/logs?page=${pageNum}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
        setTotal(data.total);
      }
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    let tenantId: string | null = null;
    const setup = async () => {
      try {
        const token = await getToken();
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tenant/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (profileRes.ok) {
          const data = await profileRes.json();
          setProfile(data);
          tenantId = data.tenantId;
        }

        await fetchLogs(token, page);

        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
          transports: ["websocket"],
        });
        socketRef.current = socket;

        socket.on("connect", () => {
          setConnected(true);
          if (tenantId) socket.emit("join-tenant", tenantId);
        });
        socket.on("disconnect", () => setConnected(false));
        socket.on("new-threat", (threat: ThreatLog) => {
          setLogs((prev) => {
            if (prev.find(l => l._id === threat._id)) return prev;
            return [threat, ...prev].slice(0, 100);
          });
          toast({
            title: `${threat.threatType} detected`,
            description: `From ${threat.attackerIp}`,
            variant: threat.severity === "High" ? "threat" : threat.severity === "Medium" ? "warning" : "low"
          });
        });

        socket.on("limit-reached", (data) => {
          toast({
            title: "⚠️ Monthly Log Limit Reached",
            description: "New threats are currently being blocked. Please upgrade to PRO.",
            variant: "destructive"
          });
          setProfile((prev: any) => prev ? { ...prev, logCount: data.logCount } : null);
        });
      } catch (err) {
        console.error("Socket setup failed", err);
      } finally {
        setInitialLoading(false);
        setLoading(false);
      }
    };

    setup();
    return () => {
      socketRef.current?.off("new-threat");
      socketRef.current?.off("limit-reached");
      socketRef.current?.disconnect();
    };
  }, [getToken]);

  useEffect(() => {
    if (profile) fetchLogs(null, page);
  }, [page]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Live Threat Feed</h1>
          <p className="text-muted-foreground mt-1 sm:mt-2 text-[10px] sm:text-sm leading-relaxed max-w-2xl">
            Real-time analysis and historical logging.
          </p>
        </div>
        <div className={cn(
          "w-fit flex items-center gap-2 px-3 py-1.5 rounded-lg border font-bold text-[9px] sm:text-[10px] uppercase tracking-widest transition-all duration-500",
          connected ? "bg-primary/10 border-primary/20 text-primary" : "bg-red-500/10 border-red-500/20 text-red-500"
        )}>
          <span className={cn("w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full", connected ? "bg-primary animate-pulse" : "bg-red-500")} />
          {connected ? "Socket Active" : "Disconnected"}
        </div>
      </div>

      <Card className="bg-card border-border shadow-sm overflow-hidden relative">
        {loading && !initialLoading && (
           <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/20 z-50">
             <div className="h-full bg-primary animate-progress-fast w-[40%] shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
           </div>
        )}

        <CardHeader className="border-b border-border/50 pb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
                <ShieldAlert className="w-4.5 h-4.5 text-primary" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-foreground text-[10px] sm:text-[11px] font-bold uppercase tracking-widest truncate">Security Events</CardTitle>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5 uppercase tracking-tight">
                  {total} Records
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2">
               <div className="flex items-center gap-2 px-3 py-1 bg-secondary/50 border border-border rounded-md">
                 <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
                 <span className="text-[10px] font-mono text-muted-foreground">SOC-CONSOLE-1.0</span>
               </div>
            </div>
          </div>
        </CardHeader>
        
        <div className="w-full overflow-x-auto custom-scrollbar min-h-[400px]">
          <table className="w-full text-[10px] sm:text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground bg-secondary/30">
                <th className="text-left py-4 px-4 sm:px-6 font-bold uppercase tracking-widest text-[9px] sm:text-[10px]">Vector</th>
                <th className="text-left py-4 px-4 sm:px-6 font-bold uppercase tracking-widest text-[9px] sm:text-[10px]">Identity</th>
                <th className="text-left py-4 px-4 sm:px-6 font-bold uppercase tracking-widest text-[9px] sm:text-[10px]">Status</th>
                <th className="hidden lg:table-cell text-left py-4 px-6 font-bold uppercase tracking-widest text-[10px]">Payload</th>
                <th className="text-right py-4 px-4 sm:px-6 font-bold uppercase tracking-widest text-[9px] sm:text-[10px]">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-secondary/50 transition-colors group">
                  <td className="py-4 px-4 sm:px-6">
                    <span className="text-foreground font-bold uppercase tracking-tight">{log.threatType}</span>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <code className="text-[9px] font-mono text-muted-foreground bg-background/50 border border-border px-1.5 py-0.5 rounded">
                      {log.attackerIp.replace(/^::ffff:/, '')}
                    </code>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <span className={cn(
                      "px-1.5 py-0.5 rounded-sm text-[8px] sm:text-[9px] font-bold uppercase border",
                      log.severity === "High" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                      log.severity === "Medium" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                      "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    )}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="hidden lg:table-cell py-4 px-6">
                    <div className="max-w-[200px] truncate font-mono text-[10px] text-muted-foreground">
                      {log.payload || "N/A"}
                    </div>
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-right text-muted-foreground font-mono tabular-nums text-[9px]">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CardFooter className="border-t border-border/50 py-4 px-6 flex flex-col sm:flex-row items-center justify-between bg-secondary/10 gap-4">
           <p className="text-[9px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-2">
            <Filter className="w-3.5 h-3.5" />
            Page {page} / {Math.ceil(total / limit) || 1}
          </p>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline" size="sm"
              className="flex-1 sm:flex-none h-8 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >Previous</Button>
            <Button
              variant="outline" size="sm"
              className="flex-1 sm:flex-none h-8 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest"
              onClick={() => setPage(p => Math.min(Math.ceil(total / limit), p + 1))}
              disabled={page >= Math.ceil(total / limit) || loading}
            >Next</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function ThreatLogsPage() {
  return (
    <Suspense fallback={<div className="h-40 animate-pulse bg-muted rounded-xl" />}>
      <ThreatLogsContent />
    </Suspense>
  );
}
