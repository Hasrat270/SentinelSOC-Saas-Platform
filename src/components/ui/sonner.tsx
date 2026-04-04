"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme="dark"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-5 text-emerald-500" style={{ color: '#10b981' }} />,
        info: <InfoIcon className="size-5 text-sky-500" style={{ color: '#0ea5e9' }} />,
        warning: <TriangleAlertIcon className="size-5 text-amber-500" style={{ color: '#f59e0b' }} />,
        error: <OctagonXIcon className="size-5 text-rose-500" style={{ color: '#f43f5e' }} />,
        loading: <Loader2Icon className="size-5 animate-spin text-white" />,
      }}
      toastOptions={{
        style: {
          background: "#0f172a",
          border: "2px solid rgba(255, 255, 255, 0.1)",
          color: "#f8fafc",
          opacity: "1 !important",
          "--success-bg": "#059669",
          "--success-border": "#10b981",
          "--success-text": "#fff",
          "--error-bg": "#dc2626",
          "--error-border": "#f43f5e",
          "--error-text": "#fff",
          "--info-bg": "#0284c7",
          "--info-border": "#38bdf8",
          "--info-text": "#fff",
          "--warning-bg": "#d97706",
          "--warning-border": "#fbbf24",
          "--warning-text": "#fff",
        } as React.CSSProperties,
        classNames: {
          toast: "group toast font-sans !opacity-100 !bg-[#0f172a] !border-2",
          description: "group-[.toast]:text-white",
          actionButton: "group-[.toast]:bg-indigo-600 group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-zinc-800 group-[.toast]:text-zinc-400",
          success: "!bg-[#059669] !border-[#10b981] !text-white !opacity-100",
          error: "!bg-[#dc2626] !border-[#f43f5e] !text-white !opacity-100",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
