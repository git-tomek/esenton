'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import { Container } from '@/components/layout/Container';
import { GridLines } from '@/components/layout/GridLines';
import { industries } from '@/data/industries';
import styles from './IndustriesSection.module.scss';

gsap.registerPlugin(useGSAP);

export function IndustriesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const textElement = textRef.current;
      const caretElement = caretRef.current;
      if (!textElement || !caretElement) return;

      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: reduce)', () => {
        textElement.textContent = industries[0];
        gsap.set(caretElement, { autoAlpha: 1 });
      });

      media.add('(prefers-reduced-motion: no-preference)', () => {
        const timeline = gsap.timeline({ repeat: -1 });
        const caretTween = gsap.to(caretElement, {
          autoAlpha: 0,
          duration: 0.55,
          ease: 'none',
          repeat: -1,
          yoyo: true,
        });

        industries.forEach((stat) => {
          const typingState = { visibleCharacters: 0 };
          const typingDuration = Math.min(Math.max(stat.length * 0.035, 1.2), 5.2);
          const deletingDuration = Math.min(Math.max(stat.length * 0.012, 0.45), 1.4);

          timeline
            .set(typingState, { visibleCharacters: 0 })
            .set(textElement, { textContent: '' })
            .to(typingState, {
              visibleCharacters: stat.length,
              duration: typingDuration,
              ease: 'none',
              onUpdate: () => {
                textElement.textContent = stat.slice(
                  0,
                  Math.round(typingState.visibleCharacters),
                );
              },
            })
            .to({}, { duration: 2.2 })
            .to(typingState, {
              visibleCharacters: 0,
              duration: deletingDuration,
              ease: 'none',
              onUpdate: () => {
                textElement.textContent = stat.slice(
                  0,
                  Math.round(typingState.visibleCharacters),
                );
              },
            })
            .to({}, { duration: 0.28 });
        });

        return () => {
          caretTween.kill();
          timeline.kill();
        };
      });

      return () => media.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section id="industries" ref={sectionRef} className={styles.section}>
      <GridLines tone="light" />
      <Container>
        <div className={styles.row}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>Dla kogo</p>
            <h2 className={styles.title}>
              Piszemy oprogramowanie dla realnych biznesów.
            </h2>
          </div>

          <p
            className={styles.typing}
            aria-label="Przykładowe branże, z którymi pracujemy"
          >
            <span className={styles.prompt} aria-hidden="true">
              m.in.
            </span>
            <span className={styles.line}>
              <span ref={textRef}>{industries[0]}</span>
              <span className={styles.caret} ref={caretRef} aria-hidden="true" />
            </span>
          </p>
        </div>

        <ul className={styles.srList}>
          {industries.map((industry) => (
            <li key={industry}>{industry}</li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
