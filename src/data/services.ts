import {
  Cloud,
  Code2,
  Database,
  Globe,
  Package,
  Palette,
  Settings2,
  ShoppingCart,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

export type ServiceColor = 'blue' | 'green';

export type ServiceItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  color: ServiceColor;
};

export type HeaderServiceItem = {
  label: string;
  icon: LucideIcon;
};

export const mainServices: readonly ServiceItem[] = [
  {
    title: 'Strony internetowe',
    description:
      'Szybkie strony firmowe i landing page gotowe pod SEO, konwersję i łatwą edycję.',
    icon: Globe,
    color: 'blue',
  },
  {
    title: 'Sklepy internetowe',
    description:
      'Sklepy na WooCommerce i Shoper z płatnościami, dostawami i integracjami.',
    icon: ShoppingCart,
    color: 'blue',
  },
  {
    title: 'Aplikacje webowe',
    description:
      'Portale, dashboardy i narzędzia online dopasowane do procesów firmy.',
    icon: Smartphone,
    color: 'blue',
  },
  {
    title: 'Systemy CRM i ERP',
    description:
      'Systemy do obsługi klientów, zamówień, zadań, dokumentów i pracy zespołu.',
    icon: Settings2,
    color: 'blue',
  },
  {
    title: 'Integracje API',
    description:
      'Łączymy CRM, ERP, płatności, kurierów, magazyn i platformy sprzedażowe.',
    icon: Package,
    color: 'blue',
  },
  {
    title: 'UX/UI i frontend',
    description:
      'Czytelne interfejsy i szybkie frontendy wygodne w codziennym użyciu.',
    icon: Palette,
    color: 'blue',
  },
  {
    title: 'Automatyzacja procesów',
    description:
      'Automatyzacje, importy danych i workflow, które ograniczają ręczną pracę.',
    icon: Sparkles,
    color: 'blue',
  },
  {
    title: 'Wdrożenia i hosting',
    description:
      'Środowiska, Docker, hosting, backupy i produkcyjne uruchomienie projektu.',
    icon: Cloud,
    color: 'blue',
  },
  {
    title: 'Bazy danych i architektura',
    description:
      'Struktura danych, API i fundamenty systemu przygotowane pod dalszy rozwój.',
    icon: Database,
    color: 'blue',
  },
  // {
  //   title: 'Security & audits',
  //   description:
  //     'Practical reviews for permissions, data handling, performance, and production risks.',
  //   icon: ShieldCheck,
  //   color: 'blue',
  // },
  // {
  //   title: 'Mobile apps (React Native)',
  //   description:
  //     'iOS and Android apps powered by one codebase and a product-first interface.',
  //   icon: Smartphone,
  //   color: 'blue',
  // },
  // {
  //   title: 'Hosting & product care',
  //   description:
  //     'Hosting, domains, maintenance, fixes, and steady improvements after launch.',
  //   icon: Cloud,
  //   color: 'blue',
  // },
] as const;

export const headerServices: readonly HeaderServiceItem[] = [
  { label: 'Strony internetowe', icon: Globe },
  { label: 'Sklepy internetowe', icon: ShoppingCart },
  { label: 'Aplikacje webowe', icon: Smartphone },
  { label: 'Systemy CRM i ERP', icon: Settings2 },
  { label: 'Integracje API', icon: Package },
  { label: 'UX/UI i frontend', icon: Palette },
  { label: 'Automatyzacja procesów', icon: Sparkles },
  { label: 'Wdrożenia i hosting', icon: Cloud },
  { label: 'Bazy danych i architektura', icon: Database },
  // { label: 'Security & audits', icon: ShieldCheck },
  // { label: 'Mobile apps (React Native)', icon: Smartphone },
  // { label: 'Hosting & product care', icon: Cloud },
] as const;

export const compactServices: readonly ServiceItem[] = [
  {
    title: 'Strony i aplikacje',
    description:
      'Nowoczesne strony internetowe i aplikacje webowe z dobrą wydajnością, SEO i wygodnym interfejsem.',
    icon: Code2,
    color: 'blue',
  },
  {
    title: 'UX/UI',
    description:
      'Przejrzyste ścieżki użytkownika, spójne widoki i interfejsy zaprojektowane pod cel biznesowy.',
    icon: Palette,
    color: 'green',
  },
  {
    title: 'Systemy biznesowe',
    description:
      'CRM, ERP, panele klienta i narzędzia wewnętrzne dopasowane do procesów firmy.',
    icon: Smartphone,
    color: 'blue',
  },
  {
    title: 'Opieka techniczna',
    description:
      'Utrzymanie, aktualizacje, optymalizacja i rozwój projektu po wdrożeniu.',
    icon: Settings2,
    color: 'green',
  },
] as const;
