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
      richColors
      icons={{
        success: <CircleCheckIcon className="size-5 text-white" />,
        info: <InfoIcon className="size-5 text-white" />,
        warning: <TriangleAlertIcon className="size-5 text-white" />,
        error: <OctagonXIcon className="size-5 text-white" />,
        loading: <Loader2Icon className="size-5 animate-spin text-white" />,
      }}
      toastOptions={{
        style: {
          background: "#0f172a",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          color: "#f8fafc",
        },
        classNames: {
          toast: "group toast font-sans",
          description: "group-[.toast]:text-white",
          actionButton: "group-[.toast]:bg-indigo-600 group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-zinc-800 group-[.toast]:text-zinc-400",
          success: "!bg-[#059669] !border-[#10b981] !text-white !opacity-100",
          error: "!bg-[#dc2626] !border-[#f43f5e] !text-white !opacity-100",
          info: "!bg-[#0284c7] !border-[#38bdf8] !text-white !opacity-100",
          warning: "!bg-[#d97706] !border-[#fbbf24] !text-white !opacity-100",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
