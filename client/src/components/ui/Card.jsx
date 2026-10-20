import { cn } from '../../lib/utils';

export function Card({ className, hover = false, children, as: Component = 'div', ...props }) {
  return (
    <Component
      className={cn('card', hover && 'card-hover', className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ className, children }) {
  return <div className={cn('p-5 pb-0', className)}>{children}</div>;
}

export function CardContent({ className, children }) {
  return <div className={cn('p-5', className)}>{children}</div>;
}

export function CardFooter({ className, children }) {
  return <div className={cn('p-5 pt-0', className)}>{children}</div>;
}
