import {
  Code2,
  Headphones,
  PenTool,
  Rocket,
  Search,
  Users,
  type LucideIcon,
} from 'lucide-react';

export type ProcessStep = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const processSteps: readonly ProcessStep[] = [
  {
    title: 'Rozpoznanie celu',
    description: 'Ustalamy, co ma osiągnąć strona, sklep, aplikacja lub system i jakie potrzeby biznesowe są najważniejsze.',
    icon: Users,
  },
  {
    title: 'Zakres i rekomendacje',
    description:
      'Porządkujemy wymagania, priorytety, ryzyka, budżet oraz technologię potrzebną do stabilnego wdrożenia.',
    icon: Search,
  },
  {
    title: 'Projekt struktury',
    description:
      'Planujemy architekturę, widoki, procesy użytkownika, panel administracyjny i integracje z innymi systemami.',
    icon: PenTool,
  },
  {
    title: 'Development',
    description: 'Tworzymy frontend, backend, logikę biznesową, API oraz elementy potrzebne do pracy rozwiązania.',
    icon: Code2,
  },
  {
    title: 'Testy i optymalizacja',
    description: 'Sprawdzamy responsywność, wydajność, SEO, formularze, integracje i przypadki brzegowe.',
    icon: Rocket,
  },
  {
    title: 'Wdrożenie i rozwój',
    description: 'Publikujemy projekt, monitorujemy działanie i rozwijamy system na podstawie realnych potrzeb firmy.',
    icon: Headphones,
  },
] as const;
