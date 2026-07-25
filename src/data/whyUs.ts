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
    title: 'Jakość techniczna',
    description:
      'Tworzymy szybkie, skalowalne i łatwe w utrzymaniu rozwiązania, gotowe do rozwóju.',
    icon: SparklesIcon,
  },
  {
    title: 'Jasna komunikacja',
    description:
      'Określamy zakres prac, harmonogram, koszty i decyzje technologiczne, bez niepotrzebnych niespodzianek.',
    icon: UserCircleIcon,
  },
  {
    title: 'Pełny zakres kompetencji',
    description:
      'Łączymy UX/UI, frontend, backend, integracje API, bazy danych i wdrożenia produkcyjne.',
    icon: CodeBracketIcon,
  },
] as const;
