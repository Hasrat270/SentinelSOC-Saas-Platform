"use client";

import * as React from "react";
import { Key, Plus, Copy, Check, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
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
    toast({ title: "Key copied", variant: "success" });
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
      <Card className="bg-card border-border shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border/50 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
              <Key className="w-4.5 h-4.5 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-foreground text-[10px] sm:text-[11px] font-bold uppercase tracking-widest truncate">API Access Tokens</CardTitle>
              <p className="text-[9px] text-muted-foreground mt-0.5 uppercase tracking-tight">Active Credentials</p>
            </div>
          </div>
          <form onSubmit={handleCreateKey} className="flex items-center gap-2 w-full sm:w-auto">
              <Input 
                placeholder="Key label" 
                className="h-8 text-[9px] sm:text-[10px] bg-secondary/50 border-border flex-1 sm:w-44 font-medium uppercase"
                value={newKeyName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewKeyName(e.target.value)}
              />
              <Button type="submit" disabled={creating || !newKeyName.trim()} className="h-8 text-[9px] sm:text-[10px] font-bold uppercase px-3 bg-primary">
                  {creating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              </Button>
          </form>
        </CardHeader>
        
        <div className="w-full overflow-x-auto custom-scrollbar">
          <table className="w-full text-[9px] sm:text-[11px] min-w-[450px] sm:min-w-0">
            <thead>
              <tr className="border-b border-border text-muted-foreground bg-secondary/20 font-bold uppercase tracking-widest">
                <th className="text-left py-4 px-4 sm:px-6">Name</th>
                <th className="hidden sm:table-cell text-left py-4 px-6">Created</th>
                <th className="text-left py-4 px-4 sm:px-6">API Key</th>
                <th className="text-right py-4 px-4 sm:px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {apiKeys.map((k) => (
                <tr key={k.key} className="hover:bg-secondary/40 transition-colors group">
                  <td className="py-4 px-4 sm:px-6">
                    <span className="text-foreground font-black uppercase tracking-tight truncate max-w-[80px] block">{k.name}</span>
                  </td>
                  <td className="hidden sm:table-cell py-4 px-6 text-muted-foreground">
                    {new Date(k.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-2 bg-background/50 border border-border px-2 py-1 rounded-lg w-fit">
                      <code className="font-mono text-primary font-bold text-[9px] sm:text-[10px] tracking-tight sm:tracking-widest max-w-[150px] sm:max-w-none truncate sm:whitespace-pre">
                        {revealedKeys.has(k.key) ? k.key : `sentinel_${k.key.slice(0, 3)}••`}
                      </code>
                      <button onClick={() => toggleReveal(k.key)} className="text-muted-foreground hover:text-primary transition-all p-1 shrink-0">
                        {revealedKeys.has(k.key) ? <EyeOff className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-right space-x-1 whitespace-nowrap">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => copyToClipboard(k.key)}>
                      {copiedKey === k.key ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                    <Button variant="ghost" size="icon" disabled={revoking} className="h-7 w-7 text-muted-foreground hover:text-red-500" onClick={() => setKeyToRevoke(k.key)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <ConfirmModal isOpen={!!keyToRevoke} onClose={() => setKeyToRevoke(null)} onConfirm={onConfirmRevoke} title="Revoke Key" description="Any agents using this key will stop functioning." confirmText="Revoke" variant="danger" />
    </>
  );
}
