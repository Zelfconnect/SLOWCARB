import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:outline-2 focus-visible:outline-sage-500 focus-visible:outline-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-[#10b981] text-white hover:bg-[#059669] shadow-surface active:shadow-surface-pressed active:translate-y-[1px]",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 shadow-surface active:shadow-surface-pressed active:translate-y-[1px]",
        outline:
          "bg-white text-sage-700 border-0 shadow-surface hover:bg-sage-50 active:shadow-surface-pressed active:translate-y-[1px]",
        secondary:
          "bg-stone-100 text-stone-700 hover:bg-stone-200 shadow-surface active:shadow-surface-pressed active:translate-y-[1px]",
        ghost:
          "hover:bg-stone-100 hover:text-stone-900",
        link: "text-sage-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-14 px-5 py-2.5",
        sm: "h-11 gap-1.5 px-3.5",
        lg: "h-14 px-6",
        xl: "h-14 px-6 text-base",
        icon: "size-10",
        "icon-sm": "size-8 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
