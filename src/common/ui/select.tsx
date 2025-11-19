"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "./utils";

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  size?: "sm" | "default";
  placeholder?: string;
  onValueChange?: (value: string) => void;
}

function Select({
  children,
  ...props
}: SelectProps) {
  return <div>{children}</div>;
}

function SelectTrigger({
  className,
  size = "default",
  children,
  placeholder,
  onValueChange,
  onChange,
  ...props
}: SelectProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(event);
    onValueChange?.(event.target.value);
  };

  return (
    <div className="relative">
      <select
        data-slot="select"
        className={cn(
          "border-input bg-input-background flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
          size === "default" ? "h-9" : "h-8",
          className,
        )}
        onChange={handleChange}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      <ChevronDownIcon className="absolute right-3 top-1/2 size-4 -translate-y-1/2 opacity-50 pointer-events-none" />
    </div>
  );
}

function SelectValue({ placeholder }: { placeholder?: string }) {
  // This is handled by SelectTrigger
  return null;
}

function SelectContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function SelectItem({ children, ...props }: React.OptionHTMLAttributes<HTMLOptionElement>) {
  return <option {...props}>{children}</option>;
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
