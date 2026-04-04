"use client";

import * as React from "react";
import { Key, Plus, Copy, Check, Trash2, ShieldAlert } from "lucide-react";
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
}

export function ApiKeyManager({
  apiKeys,
  creating,
  newKeyName,
  setNewKeyName,
  handleCreateKey,
  handleRevokeKey,
}: ApiKeyManagerProps) {
  const { toast } = useToast();
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);
  const [keyToRevoke, setKeyToRevoke] = React.useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    toast({ title: "Key copied to clipboard", variant: "success" });
    setTimeout(() => setCopiedKey(null), 2000);
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
                    <span className="flex items-center gap-1.5"><Plus className="w-3 h-3 animate-spin" /> Generating</span>
                  ) : (
                    <span className="flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> New Key</span>
                  )}
              </Button>
          </form>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-3">
          {apiKeys.map((k) => (
            <div key={k.key} className="flex items-center justify-between p-4 bg-secondary/30 border border-border rounded-lg group hover:border-primary/40 transition-all duration-200">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-foreground uppercase tracking-tight">{k.name}</span>
                <span className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-tighter">
                  Created {new Date(k.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-3">
                 <code className="bg-background/80 border border-border px-3 py-1.5 rounded text-[10px] font-mono text-primary font-bold tracking-widest">
                  sentinel_{k.key.slice(0, 3)}...{k.key.slice(-4)}
                </code>
                <div className="flex items-center gap-1">
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
                    className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    onClick={() => setKeyToRevoke(k.key)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {apiKeys.length === 0 && (
            <div className="py-12 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-secondary/10">
              <Key className="w-8 h-8 mb-3 opacity-20 text-muted-foreground" />
              <p className="text-[10px] font-bold uppercase tracking-widest">No active keys found</p>
              <p className="text-[10px] mt-1 uppercase tracking-tight opacity-60">Generate a key to begin intercepting traffic</p>
            </div>
          )}
        </CardContent>
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
