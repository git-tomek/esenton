import { cn } from '@/utils/cn';
import styles from './Container.module.scss';

type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

export function Container({ className, children, ...rest }: ContainerProps) {
  return (
    <div className={cn(styles.container, className)} {...rest}>
      {children}
    </div>
  );
}
