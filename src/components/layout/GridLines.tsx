import { Container } from '@/components/layout/Container';
import { cn } from '@/utils/cn';

type GridLinesProps = {
  /**
   * `dark` draws faint dark-gray lines for light backgrounds (default)
   * `light` draws faint white lines for dark/colored backgrounds
   */
  tone?: 'dark' | 'light';
  className?: string;
};

/**
 * Decorative vertical "column grid" overlay, aligned to the page Container.
 * Renders a single row of cells whose borders form the guide lines:
 * 2 columns on mobile, 4 on tablet (md), 6 on desktop (xl) — mirroring the
 * 12-col grid behind the content. Purely presentational and inert:
 * `aria-hidden`, `pointer-events-none`, and sat behind content via `-z-[1]`,
 * so the host <section> only needs `position: relative`.
 */
const COLUMN_CLASSES = [
  'col-span-6 md:col-span-3 xl:col-span-2',
  'col-span-6 md:col-span-3 xl:col-span-2',
  'hidden md:block md:col-span-3 xl:col-span-2',
  'hidden md:block md:col-span-3 xl:col-span-2',
  'hidden xl:block xl:col-span-2',
  'hidden xl:block xl:col-span-2',
] as const;

export function GridLines({ tone = 'dark', className }: GridLinesProps) {
  const lineColor =
    tone === 'light'
      ? 'border-[rgba(255,255,255,0.10)]'
      : 'border-[rgba(0,0,0,0.06)]';

  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 -z-[1] select-none',
        className,
      )}
    >
      <Container className="h-full">
        <div className="grid h-full grid-cols-12">
          {COLUMN_CLASSES.map((columnClass, index) => (
            <div
              key={index}
              className={cn(
                columnClass,
                'h-full border-r',
                index === 0 && 'border-l',
                lineColor,
              )}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}
