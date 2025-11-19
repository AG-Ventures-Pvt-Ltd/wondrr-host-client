'use client' 

import React from 'react'
import { Button as MuiButton } from '@mui/material'

type ButtonProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  style?: React.CSSProperties;
  disabled?: boolean;
  type?: "reset" | "button" | "submit" | undefined;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ 
  className = '', 
  children, 
  onClick = () => {}, 
  style = {}, 
  disabled = false, 
  type = undefined,
  variant = 'contained',
  color = 'primary',
  fullWidth = false,
  startIcon,
  endIcon
}) => {

  return (
    <MuiButton
      className={`!py-2 ${className}`}
      onClick={onClick}
      style={style}
      disabled={disabled}
      type={type}
      variant={variant}
      color={color}
      fullWidth={fullWidth}
      startIcon={startIcon}
      endIcon={endIcon}
    >
      {children}
    </MuiButton>
  );
};

export default Button