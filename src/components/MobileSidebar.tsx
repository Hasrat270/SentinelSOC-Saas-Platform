"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { SidebarContent } from "./Sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scrolling when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      {/* Mobile Top Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-md border-b border-border z-40 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-foreground">
                Sentinel<span className="text-primary">SOC</span>
            </span>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Drawer */}
      <aside 
        className={cn(
          "fixed top-0 right-0 h-full w-[280px] bg-card border-l border-border z-50 p-6 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between mb-8">
            <span className="text-lg font-bold tracking-tight text-foreground">
                Sentinel<span className="text-primary">SOC</span>
            </span>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            <SidebarContent />
        </div>
      </aside>
    </div>
  );
}
