'use client';

import {
  ArrowForward,
  EmailOutlined,
  ExpandMore,
  LocationOnOutlined,
} from '@mui/icons-material';
import { useCallback, useEffect, useState, type MouseEvent } from 'react';

import { Button } from '@mui/material';
import { Container } from './Container';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, Phone, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { headerServices } from '@/data/services';
import styles from './Header.module.scss';

const navItems = [
  { label: 'Start', href: '#hero' },
  { label: 'Technologie', href: '#technologies' },
  { label: 'Proces', href: '#process' },
  { label: 'Kontakt', href: '#contact' },
];

// Matches the breakpoint at which the desktop nav appears in Header.module.scss.
const DESKTOP_NAV_QUERY = '(min-width: 1024px)';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    setIsServicesOpen(false);
  }, []);

  const scrollToSection = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith('#')) return;

      const target = document.getElementById(href.slice(1));
      if (!target) return;

      event.preventDefault();
      closeMenu();

      const headerHeight = document
        .querySelector('header')
        ?.getBoundingClientRect().height ?? 0;
      const top =
        target.getBoundingClientRect().top + window.scrollY - headerHeight;
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      window.history.pushState(null, '', href);
      window.scrollTo({
        top: Math.max(top, 0),
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    },
    [closeMenu],
  );

  useEffect(() => {
    const updateHeaderState = () => {
      const hasScrolled = window.scrollY > 48;
      setIsScrolled((current) => current === hasScrolled ? current : hasScrolled);
    };

    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateHeaderState);
    };
  }, []);

  // The panel is a mobile/tablet affordance only. CSS hides it once the inline
  // nav appears, so the open state has to be dropped too — otherwise the body
  // scroll lock below would survive a rotation to landscape tablet.
  useEffect(() => {
    const desktopNav = window.matchMedia(DESKTOP_NAV_QUERY);
    const syncMenuState = () => {
      if (desktopNav.matches) closeMenu();
    };

    syncMenuState();
    desktopNav.addEventListener('change', syncMenuState);

    return () => desktopNav.removeEventListener('change', syncMenuState);
  }, [closeMenu]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isMenuOpen, closeMenu]);

  return (
    <header className={cn(styles.header, isScrolled && styles.headerScrolled)}>
      <div className={styles.topBar}>
        <Container className={styles.topBarInner}>
          <span className={styles.contactItem}>
            <LocationOnOutlined sx={{ fontSize: 16 }} color="primary" />
            Kraków
          </span>
          <a
            href="tel:+48707123007"
            className={styles.contactItem}
          >
            <Phone size={16} color="var(--color-tm-blue)" />
            707 123 007
          </a>
          <a
            href="mailto:info@esenton.pl"
            className={styles.contactItem}
          >
            <EmailOutlined sx={{ fontSize: 16 }} color="primary" />
            info@esenton.pl
          </a>
        </Container>
      </div>
      <Container className={styles.mainBar}>
        <Link href="/" aria-label="esenton - strona główna" className={styles.logoLink}>
          <Image
            src="/images/logo.svg"
            alt="esenton"
            width={416}
            height={106}
            priority
            className={styles.logoHeader}
          />
        </Link>
        <nav className={styles.nav}>
          <Link
            href="#hero"
            className={styles.navLink}
            onClick={(event) => scrollToSection(event, '#hero')}
          >
            Start
          </Link>
          <div
            className={styles.serviceMenu}
            data-open={isServicesOpen ? 'true' : undefined}
            onMouseLeave={() => setIsServicesOpen(false)}
          >
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={isServicesOpen}
              className={styles.serviceButton}
              onClick={() => setIsServicesOpen((open) => !open)}
            >
              Usługi
              <ExpandMore
                sx={{ fontSize: 18 }}
                className={styles.serviceChevron}
              />
            </button>
            <div
              role="menu"
              className={styles.serviceDropdown}
            >
              <div className={styles.servicePanel}>
                {headerServices.map((service) => {
                  const Icon = service.icon;
                  return (
                    <Link
                      key={service.label}
                      href="#services"
                      role="menuitem"
                      className={styles.serviceLink}
                      onClick={(event) => scrollToSection(event, '#services')}
                    >
                      <Icon size={18} strokeWidth={1.5} />
                      {service.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          {navItems.slice(1).map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={styles.navLink}
              onClick={(event) => scrollToSection(event, item.href)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Button
          variant="contained"
          size="medium"
          href="#contact"
          endIcon={<ArrowForward />}
          className={styles.cta}
        >
          Zapytaj o projekt
        </Button>
        <button
          type="button"
          className={styles.menuToggle}
          aria-expanded={isMenuOpen}
          aria-controls="header-mobile-menu"
          aria-label={isMenuOpen ? 'Zamknij menu' : 'Otwórz menu'}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? (
            <X size={24} strokeWidth={2} aria-hidden />
          ) : (
            <Menu size={24} strokeWidth={2} aria-hidden />
          )}
        </button>
      </Container>

      <div
        id="header-mobile-menu"
        className={styles.mobilePanel}
        hidden={!isMenuOpen}
      >
        <Container className={styles.mobilePanelInner}>
          <nav className={styles.mobileNav} aria-label="Menu główne">
            {navItems.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={styles.mobileNavLink}
                onClick={(event) => scrollToSection(event, item.href)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <p className={styles.mobileGroupTitle}>Usługi</p>
          <div className={styles.mobileServices}>
            {headerServices.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.label}
                  href="#services"
                  className={styles.mobileServiceLink}
                  onClick={(event) => scrollToSection(event, '#services')}
                >
                  <Icon size={18} strokeWidth={1.5} aria-hidden />
                  {service.label}
                </Link>
              );
            })}
          </div>

          <div className={styles.mobileContact}>
            <a href="tel:+48707123007" className={styles.mobileContactItem}>
              <Phone size={18} aria-hidden />
              707 123 007
            </a>
            <a href="mailto:info@esenton.pl" className={styles.mobileContactItem}>
              <EmailOutlined sx={{ fontSize: 18 }} aria-hidden />
              info@esenton.pl
            </a>
            <span className={styles.mobileContactItem}>
              <LocationOnOutlined sx={{ fontSize: 18 }} aria-hidden />
              Kraków
            </span>
          </div>

          <Button
            variant="contained"
            size="medium"
            href="#contact"
            endIcon={<ArrowForward />}
            className={styles.mobileCta}
            onClick={closeMenu}
          >
            Zapytaj o projekt
          </Button>
        </Container>
      </div>
    </header>
  );
}
