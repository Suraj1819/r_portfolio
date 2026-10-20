import { cn } from '../../lib/utils';
import { forwardRef } from 'react';

const variants = {
  primary:
    'bg-accent text-[#171714] hover:bg-accent-hover focus-visible:ring-accent disabled:opacity-50',
  secondary:
    'bg-transparent border border-border text-text-primary hover:bg-surface-hover hover:border-accent/40 focus-visible:ring-accent',
  ghost:
    'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-hover focus-visible:ring-accent',
  destructive:
    'bg-error text-white hover:opacity-90 focus-visible:ring-error',
  icon:
    'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-hover p-2 focus-visible:ring-accent',
};

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'h-10 w-10',
};

export const Button = forwardRef(function Button(
  {
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    children,
    type = 'button',
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:pointer-events-none',
        variants[variant],
        size === 'icon' ? sizes.icon : sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      )}
      {children}
    </button>
  );
});
