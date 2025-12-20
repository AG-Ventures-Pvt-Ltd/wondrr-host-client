import React from 'react'
import { Input } from '@/common/ui/input'
import { Textarea } from '@/common/ui/textarea'
import { cn } from '@/common/ui/utils'

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  variant?: 'input' | 'textarea'
  rows?: number
  className?: string
}

const CustomInput: React.FC<CustomInputProps> = ({
  variant = 'input',
  rows = 3,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = "w-full px-4 py-2.5 rounded-2xl border border-neutral-200 text-sm text-maintext placeholder:text-neutral-500 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
  const disabledClasses = disabled ? "bg-neutral-100 cursor-not-allowed opacity-60" : ""

  if (variant === 'textarea') {
    return (
      <Textarea
        rows={rows}
        className={cn(baseClasses, disabledClasses, className)}
        disabled={disabled}
        {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
      />
    )
  }

  return (
    <Input
      className={cn(baseClasses, disabledClasses, className)}
      disabled={disabled}
      {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
    />
  )
}

export default CustomInput