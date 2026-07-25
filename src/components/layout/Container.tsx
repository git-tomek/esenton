import { cn } from '@/utils/cn';

type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

export function Container({ className, children, ...rest }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[1320px] px-5 sm:px-6 lg:px-8',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
