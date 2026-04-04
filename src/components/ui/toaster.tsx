"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex gap-3">
              <div className="mt-0.5 shrink-0">
                {variant === "success" && <CheckCircle2 className="h-4 w-4 text-white" />}
                {variant === "destructive" && <AlertCircle className="h-4 w-4 text-white" />}
                {variant === "warning" && <AlertTriangle className="h-4 w-4 text-white" />}
                {variant === "info" && <Info className="h-4 w-4 text-white" />}
                {!variant && <Info className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div className="grid gap-0.5">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
