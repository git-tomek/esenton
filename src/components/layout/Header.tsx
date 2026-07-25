'use client';

import {
  ArrowForward,
  EmailOutlined,
  ExpandMore,
  LocationOnOutlined,
} from '@mui/icons-material';
import { useEffect, useState, type MouseEvent } from 'react';

import { Button } from '@mui/material';
import { Container } from './Container';
import Image from 'next/image';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import { cn } from '@/utils/cn';
import { headerServices } from '@/data/services';
import styles from './Header.module.scss';

const navItems = [
  { label: 'Start', href: '#hero' },
  { label: 'Technologie', href: '#technologies' },
  { label: 'Proces', href: '#process' },
  { label: 'Kontakt', href: '#contact' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  function handleSectionLinkClick(
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    if (!href.startsWith('#')) return;

    const target = document.getElementById(href.slice(1));
    if (!target) return;

    event.preventDefault();

    const headerHeight = document
      .querySelector('header')
      ?.getBoundingClientRect().height ?? 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    window.history.pushState(null, '', href);
    window.scrollTo({
      top: Math.max(top, 0),
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }

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
            href="mailto:biuro@esenton.pl"
            className={styles.contactItem}
          >
            <EmailOutlined sx={{ fontSize: 16 }} color="primary" />
            biuro@esenton.pl
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
            onClick={(event) => handleSectionLinkClick(event, '#hero')}
          >
            Start
          </Link>
          <div className={styles.serviceMenu}>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded="false"
              className={styles.serviceButton}
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
                      onClick={(event) => handleSectionLinkClick(event, '#services')}
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
              onClick={(event) => handleSectionLinkClick(event, item.href)}
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
      </Container>
    </header>
  );
}
