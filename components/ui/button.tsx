import * as React from 'react'
import {Slot} from '@radix-ui/react-slot'
import {cva, type VariantProps} from 'class-variance-authority'
import {cn} from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border bg-background hover:bg-secondary',
        ghost: 'hover:bg-secondary',
        finance: 'bg-indigo-600 text-white shadow-[0_14px_30px_rgba(79,70,229,0.28)] hover:bg-indigo-700',
        financeSoft: 'border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-12 px-5 text-base',
        hero: 'h-14 px-6 py-4 text-lg',
        auto: 'h-auto',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({className, variant, size, asChild = false, ...props}, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({variant, size, className}))} ref={ref} {...props} />
  }
)
Button.displayName = 'Button'

export {Button, buttonVariants}
