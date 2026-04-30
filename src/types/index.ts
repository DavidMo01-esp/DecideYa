import type { ReactNode } from 'react';

export type { Decision } from './api';

export interface ButtonProps {
  label?: string;
  children?: ReactNode;
  onClick?: () => void | Promise<void>;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}   
