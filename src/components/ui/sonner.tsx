"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-emerald-400" />,
        info: <InfoIcon className="size-4 text-sky-400" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-400" />,
        error: <OctagonXIcon className="size-4 text-rose-400" />,
        loading: <Loader2Icon className="size-4 animate-spin text-primary" />,
      }}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-[#161b22] group-[.toaster]:text-[#f8fafc] group-[.toaster]:border-[#30363d] group-[.toaster]:shadow-2xl font-bold",
          description: "group-[.toast]:text-[#8b949e] font-medium",
          actionButton: "group-[.toast]:bg-[#4f46e5] group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-[#21262d] group-[.toast]:text-[#8b949e]",
          success: "group-[.toaster]:bg-emerald-600 group-[.toaster]:text-white group-[.toaster]:border-emerald-400 group-[.toaster]:shadow-[0_0_20px_rgba(16,185,129,0.3)]",
          error: "group-[.toaster]:bg-rose-600 group-[.toaster]:text-white group-[.toaster]:border-rose-400 group-[.toaster]:shadow-[0_0_20px_rgba(244,63,94,0.3)]",
          info: "group-[.toaster]:bg-sky-600 group-[.toaster]:text-white group-[.toaster]:border-sky-400 group-[.toaster]:shadow-[0_0_20px_rgba(14,165,233,0.3)]",
          warning: "group-[.toaster]:bg-amber-600 group-[.toaster]:text-white group-[.toaster]:border-amber-400 group-[.toaster]:shadow-[0_0_20px_rgba(245,158,11,0.3)]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
