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
        success: <CircleCheckIcon className="size-5 text-white" />,
        info: <InfoIcon className="size-5 text-white" />,
        warning: <TriangleAlertIcon className="size-5 text-white" />,
        error: <OctagonXIcon className="size-5 text-white" />,
        loading: <Loader2Icon className="size-5 animate-spin text-white" />,
      }}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-[#161b22] group-[.toaster]:text-[#f8fafc] group-[.toaster]:border-[#30363d] group-[.toaster]:shadow-2xl font-bold border-2",
          description: "group-[.toast]:text-[#94a3b8] font-medium text-xs",
          actionButton: "group-[.toast]:bg-indigo-600 group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-zinc-800 group-[.toast]:text-zinc-400",
          success: "group-[.toaster]:bg-emerald-600 group-[.toaster]:text-white group-[.toaster]:border-emerald-400 group-[.toaster]:shadow-[0_0_20px_rgba(16,185,129,0.4)]",
          error: "group-[.toaster]:bg-rose-600 group-[.toaster]:text-white group-[.toaster]:border-rose-400 group-[.toaster]:shadow-[0_0_20px_rgba(244,63,94,0.4)]",
          info: "group-[.toaster]:bg-sky-600 group-[.toaster]:text-white group-[.toaster]:border-sky-400 group-[.toaster]:shadow-[0_0_20px_rgba(14,165,233,0.4)]",
          warning: "group-[.toaster]:bg-amber-600 group-[.toaster]:text-white group-[.toaster]:border-amber-400 group-[.toaster]:shadow-[0_0_20px_rgba(245,158,11,0.4)]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
