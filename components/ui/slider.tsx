import * as React from 'react'
import {cn} from '@/lib/utils'

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(({className, ...props}, ref) => {
  return (
    <input
      ref={ref}
      type="range"
      className={cn(
        'h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
})
Slider.displayName = 'Slider'

export {Slider}
