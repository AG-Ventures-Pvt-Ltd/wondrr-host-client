import React from 'react'
import { Select as MuiSelect, MenuItem, FormControl, SelectChangeEvent } from '@mui/material'
import { cn } from '@/common/ui/utils'

interface CustomSelectProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  options: { value: string; label: string }[]
  className?: string
  required?: boolean
  id?: string
  disabled?: boolean
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  placeholder,
  options,
  className,
  required,
  id,
  disabled = false
}) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value)
  }

  return (
    <FormControl
      fullWidth
      className={cn('relative', className)}
      required={required}
    >
      <MuiSelect
        labelId={placeholder ? `${id}-label` : undefined}
        id={id}
        value={value}
        label={placeholder}
        onChange={handleChange}
        displayEmpty
        disabled={disabled}
        className="w-full px-4 rounded-2xl border border-neutral-200 text-sm text-maintext bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '& .MuiSelect-select': {
            padding: '8px 8px',
            fontSize: '14px',
            backgroundColor: 'white',
            color: 'var(--color-maintext)',
          },
          '& .MuiInputLabel-root': {
            color: 'var(--color-subtext)',
            '&.Mui-focused': {
              color: 'var(--color-primary)',
            },
          },
        }}
      >
        {value && placeholder && (
          <MenuItem value="" disabled>
            <span className="text-subtext">{placeholder}</span>
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  )
}

export default CustomSelect