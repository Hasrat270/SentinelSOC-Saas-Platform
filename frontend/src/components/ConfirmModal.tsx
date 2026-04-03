"use client";

import * as React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "default";
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  loading = false,
}: ConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-2xl p-6">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2.5 rounded-full border",
              variant === "danger" 
                ? "bg-red-500/10 border-red-500/20 text-red-500" 
                : "bg-primary/10 border-primary/20 text-primary"
            )}>
              {variant === "danger" ? <AlertTriangle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            </div>
            <DialogTitle className="text-foreground text-lg font-bold tracking-tight uppercase">
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 flex gap-3 bg-transparent border-none p-0 -mx-0 -mb-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 h-10 text-[11px] font-bold uppercase tracking-widest border-border bg-transparent hover:bg-secondary transition-all"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "flex-1 h-10 text-[11px] font-bold uppercase tracking-widest transition-all",
              variant === "danger" 
                ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20" 
                : "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
            )}
          >
            {loading ? "Confirming..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
