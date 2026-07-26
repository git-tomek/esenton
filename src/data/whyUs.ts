import {
  CodeBracketIcon,
  SparklesIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import type { ComponentType, SVGProps } from 'react';

export type WhyUsIcon = ComponentType<SVGProps<SVGSVGElement>>;

export type WhyUsItem = {
  title: string;
  description: string;
  icon: WhyUsIcon;
};

export const whyUs: readonly WhyUsItem[] = [
  {
    title: 'Stabilne rozwiązania',
    description:
      'Tworzymy szybkie, skalowalne, bezpieczne i łatwe w utrzymaniu rozwiązania, przygotowane do dalszego rozwoju.',
    icon: SparklesIcon,
  },
  {
    title: 'Jasna komunikacja',
    description:
      'Jasno ustalamy zakres, terminy i koszty. Na każdym etapie omawiamy najważniejsze decyzje.',
    icon: UserCircleIcon,
  },
  {
    title: 'Pełny zakres kompetencji',
    description:
      'Prowadzimy projekt od UX/UI, przez frontend i backend, aż po integracje, wdrożenie i dalszy rozwój.',
    icon: CodeBracketIcon,
  },
] as const;
