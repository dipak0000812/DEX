import React from 'react';
import { cn } from '../../lib/utils';

// Accept any props to avoid strict type issues with framer-motion variants
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    gradient?: boolean;
    [key: string]: any;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, gradient, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'glass-card rounded-2xl p-6 relative overflow-hidden',
                    gradient && 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-secondary/5 before:pointer-events-none',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

export { Card };
