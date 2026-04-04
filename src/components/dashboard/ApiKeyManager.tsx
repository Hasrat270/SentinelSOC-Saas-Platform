"use client";

import * as React from "react";
import { Key, Plus, Copy, Check, Trash2, ShieldAlert, Eye, EyeOff, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ApiKey {
  key: string;
  name: string;
  createdAt: string;
}

interface ApiKeyManagerProps {
  apiKeys: ApiKey[];
  creating: boolean;
  newKeyName: string;
  setNewKeyName: (name: string) => void;
  handleCreateKey: (e: React.FormEvent) => void;
  handleRevokeKey: (key: string) => void;
  revoking: boolean;
}

export function ApiKeyManager({
  apiKeys,
  creating,
  newKeyName,
  setNewKeyName,
  handleCreateKey,
  handleRevokeKey,
  revoking,
}: ApiKeyManagerProps) {
  const { toast } = useToast();
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);
  const [keyToRevoke, setKeyToRevoke] = React.useState<string | null>(null);
  const [revealedKeys, setRevealedKeys] = React.useState<Set<string>>(new Set());

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    toast({ title: "Key copied to clipboard", variant: "success" });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleReveal = (key: string) => {
    setRevealedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const onConfirmRevoke = () => {
    if (keyToRevoke) {
      handleRevokeKey(keyToRevoke);
      setKeyToRevoke(null);
    }
  };

  return (
    <>
      <Card className="bg-card border-border shadow-sm overflow-hidden animate-in fade-in duration-500">
        <CardHeader className="border-b border-border/50 pb-6 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Key className="w-4.5 h-4.5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-foreground text-[11px] font-bold uppercase tracking-widest">API access keys</CardTitle>
              <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-tight">Manage persistent keys for your security agents</p>
            </div>
          </div>
          <form onSubmit={handleCreateKey} className="flex items-center gap-2">
              <Input 
                placeholder="Key label (e.g. Production)" 
                className="h-8 text-[10px] bg-secondary/50 border-border w-44 font-medium uppercase tracking-tight"
                value={newKeyName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewKeyName(e.target.value)}
              />
              <Button 
                  type="submit"
                  disabled={creating || !newKeyName.trim()}
                  className="h-8 text-[10px] font-bold uppercase tracking-widest bg-primary hover:bg-primary/90"
              >
                  {creating ? (
                    <span className="flex items-center gap-1.5"><Loader2 className="w-3 h-3 animate-spin" /> Generating</span>
                  ) : (
                    <span className="flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> New Key</span>
                  )}
              </Button>
          </form>
        </CardHeader>
        
        <div className="overflow-x-auto min-h-[120px] transition-all duration-500">
          <table className="w-full text-[11px] border-collapse tabular-nums">
            <thead>
              <tr className="border-b border-border text-muted-foreground bg-secondary/20 font-bold uppercase tracking-widest">
                <th className="text-left py-4 px-6">Name</th>
                <th className="text-left py-4 px-6">Created At</th>
                <th className="text-left py-4 px-6 w-[400px]">API Key</th>
                <th className="text-right py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {apiKeys.map((k) => (
                <tr key={k.key} className="hover:bg-secondary/40 transition-colors group">
                  <td className="py-4 px-6">
                    <span className="text-foreground font-black uppercase tracking-tight">{k.name}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-muted-foreground font-bold uppercase tabular-nums">
                      {new Date(k.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3 bg-background/50 border border-border px-3 py-1.5 rounded-lg w-fit transition-all duration-300 ease-in-out">
                      <code className="font-mono text-primary font-bold tracking-widest min-w-[280px] sm:min-w-[320px] text-[10px] break-all select-all transition-all duration-300">
                        <span className="animate-in fade-in zoom-in-95 duration-300">
                          {revealedKeys.has(k.key) 
                            ? k.key 
                            : `sentinel_${k.key.slice(0, 3)}••••••••••••••••`}
                        </span>
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-primary shrink-0"
                        onClick={() => toggleReveal(k.key)}
                      >
                        {revealedKeys.has(k.key) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right space-x-1 whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => copyToClipboard(k.key)}
                    >
                      {copiedKey === k.key ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={revoking}
                      className={cn(
                        "h-8 w-8 transition-colors",
                        apiKeys.length === 1 
                          ? "text-muted-foreground/30 cursor-not-allowed" 
                          : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                      )}
                      onClick={() => {
                        if (apiKeys.length === 1) {
                          toast({
                            title: "Security Protocol",
                            description: "At least one API key must remain active to maintain SOC protection.",
                            variant: "destructive"
                          });
                          return;
                        }
                        setKeyToRevoke(k.key);
                      }}
                      title={apiKeys.length === 1 ? "Cannot delete the last active API key" : "Revoke API Key"}
                    >
                      {revoking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {apiKeys.length === 0 && (
            <div className="py-16 flex flex-col items-center justify-center text-muted-foreground">
              <Key className="w-10 h-10 mb-4 opacity-10" />
              <p className="text-[10px] font-black uppercase tracking-widest">Awaiting key generation...</p>
              <p className="text-[10px] mt-1 uppercase tracking-tight opacity-50">Please add a label above to create your access key</p>
            </div>
          )}
        </div>
      </Card>

      <ConfirmModal
        isOpen={!!keyToRevoke}
        onClose={() => setKeyToRevoke(null)}
        onConfirm={onConfirmRevoke}
        title="Revoke API Key"
        description="Are you sure you want to revoke this API key? Any security agents using this key will stop reporting threats immediately This action cannot be undone"
        confirmText="Revoke Key"
        variant="danger"
      />
    </>
  );
}
