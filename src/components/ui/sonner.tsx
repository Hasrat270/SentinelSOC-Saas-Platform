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
      richColors
      icons={{
        success: <CircleCheckIcon className="size-5 text-white" />,
        info: <InfoIcon className="size-5 text-white" />,
        warning: <TriangleAlertIcon className="size-5 text-white" />,
        error: <OctagonXIcon className="size-5 text-white" />,
        loading: <Loader2Icon className="size-5 animate-spin text-white" />,
      }}
      toastOptions={{
        classNames: {
          toast: "group toast font-sans",
          description: "group-[.toast]:text-white",
          actionButton: "group-[.toast]:bg-indigo-600 group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-zinc-800 group-[.toast]:text-zinc-400",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
