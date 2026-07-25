import {
  ArrowForward,
  ChevronRight,
  EmailOutlined,
  LocationOnOutlined,
} from '@mui/icons-material';

import { Container } from './Container';
import { GridLines } from './GridLines';
import Image from 'next/image';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import { mainServices } from '@/data/services';
import styles from './Footer.module.scss';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <GridLines tone="light" />
      <Container>
        {/* <div className={styles.cta}>
          <div className={styles.ctaCopy}>
            <h3 className={styles.ctaTitle}>Porozmawiajmy o Twoim pomyśle.</h3>
          </div>
          <Link href="#contact" className={styles.ctaButton}>
            <span>Skontaktuj się</span>
            <ArrowForward className={styles.ctaButtonIcon} />
          </Link>
        </div> */}
        <div className={styles.footerGrid}>
          <div>
            <Link
              href="/"
              aria-label="esenton - strona główna"
              className={styles.logoLink}
            >
              <Image
                src="/images/logo-white.svg"
                alt="esenton"
                width={416}
                height={106}
                className={styles.logo}
              />
            </Link>
            <p className={styles.description}>
            Esenton pomaga firmom rozwijać i budować solidne zaplecze technologiczne.
            </p>
            <div className={styles.planeWrap} aria-hidden="true">
              <Image
                src="/images/plane.svg"
                alt=""
                width={56}
                height={81}
                className={styles.plane}
              />
            </div>
          </div>
          <div>
            <h3 className={styles.columnTitle}>Usługi</h3>
            <div className={styles.servicesColumns}>
              {splitIntoColumns(mainServices, 2).map((column, colIdx) => (
                <ul key={colIdx} className={styles.serviceList}>
                  {column.map((service) => (
                    <li key={service.title}>
                      <Link
                        href="#services"
                        className={styles.serviceLink}
                      >
                        <span
                          aria-hidden
                          className={styles.serviceIconWrap}
                        >
                          <ChevronRight className={styles.serviceIcon} />
                        </span>
                        <span>{service.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
          <FooterColumn title="Kontakt">
            <span className={styles.contactItem}>
              <LocationOnOutlined className={styles.contactIcon} />
              Kraków
            </span>
            <a href="tel:+48707123007" className={styles.contactItem}>
              <Phone className={styles.contactIcon} size={18} />
              707 123 007
            </a>
            <span className={styles.contactItem}>
              <EmailOutlined className={styles.contactIcon} />
              biuro@esenton.pl
            </span>
            <Image
              src="/images/signature.svg"
              alt="signature"
              width={557}
              height={142}
              className={styles.signature}
            />
          </FooterColumn>
        </div>
        <div className={styles.bottomBar}>
          <p>
            © {new Date().getFullYear()} esenton - studio interaktywne. Wszelkie prawa zastrzeżone.
          </p>
          <div className={styles.legalLinks}>
            <a
              href="/assets/Polityka_prywatnosci_i_cookies.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Polityka prywatności
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function splitIntoColumns<T>(items: readonly T[], columns: number): T[][] {
  const perColumn = Math.ceil(items.length / columns);
  return Array.from({ length: columns }, (_, i) =>
    items.slice(i * perColumn, (i + 1) * perColumn),
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className={styles.columnTitle}>{title}</h3>
      <div className={styles.contactList}>
        {children}
      </div>
    </div>
  );
}
