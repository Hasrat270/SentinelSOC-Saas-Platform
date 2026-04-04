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
          toast: "group toast group-[.toaster]:bg-[#161b22] group-[.toaster]:text-[#f8fafc] group-[.toaster]:border-[#30363d] group-[.toaster]:shadow-2xl group-[.toaster]:backdrop-blur-xl",
          description: "group-[.toast]:text-[#8b949e]",
          actionButton: "group-[.toast]:bg-[#4f46e5] group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-[#21262d] group-[.toast]:text-[#8b949e]",
          success: "group-[.toaster]:border-emerald-500/50 group-[.toaster]:bg-emerald-500/5",
          error: "group-[.toaster]:border-rose-500/50 group-[.toaster]:bg-rose-500/5",
          info: "group-[.toaster]:border-sky-500/50 group-[.toaster]:bg-sky-500/5",
          warning: "group-[.toaster]:border-amber-500/50 group-[.toaster]:bg-amber-500/5",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
