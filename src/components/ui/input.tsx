/**
 * Input — shadcn text field primitive, token-colored (border-input, bg-surface, text-content).
 * Use for generic form fields. Prefer catalog NumberInput / SearchBar when those already fit.
 * Lives in `components/ui/`.
 */
import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-8 w-full min-w-0 rounded-lg border border-input bg-surface px-3 py-1 text-sm text-content shadow-sm transition-colors",
        "placeholder:text-content-muted",
        "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
