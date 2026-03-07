import * as React from "react";
import { cn } from "./utils";

interface ToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  checkedLabel?: string;
  uncheckedLabel?: string;
  className?: string;
  size?: "sm" | "default" | "lg";
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      checked,
      onCheckedChange,
      disabled = false,
      checkedLabel,
      uncheckedLabel,
      className,
      size = "default",
    },
    ref
  ) => {
    const handleClick = () => {
      if (!disabled) {
        onCheckedChange(!checked);
      }
    };

    const trackSize = {
      sm: "w-8 h-4",
      default: "w-11 h-6",
      lg: "w-14 h-7",
    };

    const knobSize = {
      sm: "w-3 h-3",
      default: "w-5 h-5",
      lg: "w-6 h-6",
    };

    const knobTranslate = {
      sm: "translate-x-4",
      default: "translate-x-5",
      lg: "translate-x-7",
    };

    const labelSize = {
      sm: "text-xs",
      default: "text-sm",
      lg: "text-sm",
    };

    return (
      <div className={cn("inline-flex items-center gap-2", className)}>
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={handleClick}
          className={cn(
            "relative inline-flex shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
            trackSize[size],
            checked
              ? "bg-green-500 focus:ring-green-500"
              : "bg-gray-300 focus:ring-gray-400"
          )}
        >
          <span
            className={cn(
              "rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out",
              knobSize[size],
              checked ? knobTranslate[size] : "translate-x-0"
            )}
          />
        </button>
        {(checkedLabel || uncheckedLabel) && (
          <span
            className={cn(
              "font-medium select-none",
              labelSize[size],
              checked ? "text-green-700" : "text-amber-700"
            )}
          >
            {checked ? checkedLabel : uncheckedLabel}
          </span>
        )}
      </div>
    );
  }
);

Toggle.displayName = "Toggle";

export { Toggle };
