"use client";

import * as React from "react";
import { Select as MuiSelect, MenuItem, FormControl, InputLabel, SelectChangeEvent } from "@mui/material";
import { cn } from "./utils";

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size" | "onChange"> {
  size?: "sm" | "default";
  placeholder?: string;
  onValueChange?: (value: string) => void;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

function Select({
  children
}: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

function SelectTrigger({
  className,
  size = "default",
  children,
  placeholder,
  onValueChange,
  onChange,
  value,
  id,
  disabled,
  required
}: SelectProps) {
  const handleChange: (event: SelectChangeEvent<string>) => void = (event) => {
    const newValue = event.target.value;
    onValueChange?.(newValue);
    // Create a synthetic event for onChange compatibility
    if (onChange) {
      const syntheticEvent = {
        target: { value: newValue }
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(syntheticEvent);
    }
  };

  return (
    <FormControl
      fullWidth
      size={size === "sm" ? "small" : "medium"}
      className={cn("relative", className)}
      disabled={disabled}
      required={required}
    >
      {placeholder && (
        <InputLabel id={`${id}-label`}>{placeholder}</InputLabel>
      )}
      <MuiSelect
        labelId={placeholder ? `${id}-label` : undefined}
        id={id}
        value={value || ""}
        // @ts-expect-error - MUI Select has complex onChange types that conflict with our interface
        onChange={handleChange}
        displayEmpty
        className={cn(
          "border-input bg-input-background text-sm transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:ring-ring/50",
          size === "default" ? "h-9" : "h-8",
        )}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--border-input)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--border-input)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--ring)',
            borderWidth: '2px',
          },
          '& .MuiSelect-select': {
            backgroundColor: 'var(--bg-input-background)',
            color: 'var(--foreground)',
            padding: size === "sm" ? '4px 12px' : '8px 12px',
            fontSize: '14px',
          },
          '& .MuiInputLabel-root': {
            color: 'var(--muted-foreground)',
            '&.Mui-focused': {
              color: 'var(--ring)',
            },
          },
        }}
      >
        {placeholder && (
          <MenuItem value="" disabled>
            <em>{placeholder}</em>
          </MenuItem>
        )}
        {children}
      </MuiSelect>
    </FormControl>
  );
}

function SelectValue() {
  // This is handled by SelectTrigger
  return null;
}

function SelectContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function SelectItem({ children, value, ...props }: { children: React.ReactNode; value: string } & React.HTMLAttributes<HTMLElement>) {
  return (
    <MenuItem value={value} {...props}>
      {children}
    </MenuItem>
  );
}

function SelectGroup({ className, ...props }: React.HTMLAttributes<HTMLOptGroupElement>) {
  return <optgroup data-slot="select-group" className={className} {...props} />;
}

function SelectLabel({ className, ...props }: React.HTMLAttributes<HTMLOptGroupElement>) {
  return <optgroup className={className} {...props} />;
}

function SelectSeparator() {
  return null;
}

function SelectScrollUpButton() {
  return null;
}

function SelectScrollDownButton() {
  return null;
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
