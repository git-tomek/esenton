'use client';

import { Container } from '@/components/layout/Container';
import { GridLines } from '@/components/layout/GridLines';
import { cn } from '@/utils/cn';
import gsap from 'gsap';
import { processSteps } from '@/data/process';
import styles from './ProcessSection.module.scss';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';

gsap.registerPlugin(useGSAP);

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const root = sectionRef.current;
      if (!root || !contextSafe) return;

      const steps = Array.from(
        root.querySelectorAll<HTMLElement>('[data-process-step]'),
      );
      const wavePath = root.querySelector<SVGPathElement>(
        '[data-process-wave-path]',
      );
      const activePath = root.querySelector<SVGPathElement>(
        '[data-process-wave-active]',
      );
      const pulse = root.querySelector<SVGCircleElement>('[data-process-pulse]');
      const pulseHalo = root.querySelector<SVGCircleElement>(
        '[data-process-pulse-halo]',
      );
      if (!wavePath || !activePath || !pulse || !pulseHalo) return;

      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const waveLength = wavePath.getTotalLength();
        const progress = { value: 0 };
        const pulseTargets = [pulse, pulseHalo];
        const duration = 12.17;
        const travelStart = 0.35;

        gsap.set(steps, {
          willChange: 'transform',
        });
        gsap.set(steps, { autoAlpha: 0, y: 22, scale: 0.94 });
        gsap.set(activePath, {
          strokeDasharray: waveLength,
          strokeDashoffset: waveLength,
        });

        const movePulse = () => {
          const point = wavePath.getPointAtLength(waveLength * progress.value);
          gsap.set(pulseTargets, {
            attr: {
              cx: point.x,
              cy: point.y,
            },
          });
        };

        movePulse();

        const intro = gsap.timeline({
          defaults: { ease: 'power3.out', duration: 0.72 },
        });

        intro.to(steps, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          stagger: 0.09,
          clearProps: 'visibility',
        });

        const haloTween = gsap.to(pulseHalo, {
          attr: { r: 17 },
          duration: 1.18,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });

        const processLoop = gsap.timeline({
          repeat: -1,
          repeatDelay: 0.2,
          defaults: { ease: 'power2.out' },
        });

        processLoop
          .set(activePath, { opacity: 1, strokeDashoffset: waveLength })
          .set(pulse, { opacity: 0 })
          .set(pulseHalo, { opacity: 0 })
          .set(progress, { value: 0 })
          .call(movePulse)
          .to(pulse, { opacity: 1, duration: 0.45, ease: 'sine.inOut' }, 0)
          .to(
            pulseHalo,
            { opacity: 0.12, duration: 0.45, ease: 'sine.inOut' },
            0,
          )
          .to(
            activePath,
            {
              strokeDashoffset: 0,
              duration,
              ease: 'none',
            },
            travelStart,
          )
          .to(
            progress,
            {
              value: 1,
              duration,
              onUpdate: movePulse,
              onRepeat: movePulse,
              ease: 'none',
            },
            travelStart,
          )
          .to(
            [activePath, pulse, pulseHalo],
            {
              opacity: 0,
              duration: 0.9,
              ease: 'sine.inOut',
            },
            travelStart + duration + 0.45,
          );

        steps.forEach((step, index) => {
          const marker = step.querySelector<HTMLElement>(
            '[data-process-marker]',
          );
          const icon = step.querySelector<HTMLElement>('[data-process-icon]');
          const title = step.querySelector<HTMLElement>('[data-process-title]');
          const at =
            travelStart + (index / Math.max(steps.length - 1, 1)) * duration;
          const targets = [marker, icon].filter(
            (target): target is HTMLElement => Boolean(target),
          );

          if (targets.length) {
            processLoop
              .to(
                targets,
                {
                  y: -6,
                  scale: 1.045,
                  duration: 0.48,
                  ease: 'power2.out',
                  overwrite: 'auto',
                },
                at,
              )
              .to(
                targets,
                {
                  y: 0,
                  scale: 1,
                  duration: 0.82,
                  ease: 'power3.out',
                  overwrite: 'auto',
                },
                at + 0.5,
              );
          }

          if (title) {
            processLoop
              .to(
                title,
                {
                  color: 'var(--color-tm-blue)',
                  duration: 0.34,
                  overwrite: 'auto',
                },
                at,
              )
              .to(
                title,
                {
                  color: '#122640',
                  duration: 0.68,
                  overwrite: 'auto',
                },
                at + 0.7,
              );
          }
        });

        return () => {
          intro.kill();
          haloTween.kill();
          processLoop.kill();
        };
      });

      const liftStep = contextSafe((step: HTMLElement) => {
        const card = step.querySelector<HTMLElement>('[data-process-card]');

        if (card) {
          gsap.to(card, {
            y: -5,
            duration: 0.34,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      });

      const settleStep = contextSafe((step: HTMLElement) => {
        const card = step.querySelector<HTMLElement>('[data-process-card]');

        if (card) {
          gsap.to(card, {
            y: 0,
            duration: 0.46,
            ease: 'power2.inOut',
            overwrite: 'auto',
          });
        }
      });

      const handlers: Array<() => void> = [];

      steps.forEach((step) => {
        const onEnter = () => liftStep(step);
        const onLeave = () => settleStep(step);
        step.addEventListener('mouseenter', onEnter);
        step.addEventListener('mouseleave', onLeave);
        step.addEventListener('focusin', onEnter);
        step.addEventListener('focusout', onLeave);
        handlers.push(() => {
          step.removeEventListener('mouseenter', onEnter);
          step.removeEventListener('mouseleave', onLeave);
          step.removeEventListener('focusin', onEnter);
          step.removeEventListener('focusout', onLeave);
        });
      });

      return () => {
        handlers.forEach((off) => off());
        mm.revert();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section id="process" ref={sectionRef} className={styles.processSection}>
      <GridLines />
      <Container>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Proces współpracy</p>
            <h2 className={styles.heroTitle}>
              Od pomysłu
              <br />
              do działającego rozwiązania
            </h2>
            <div className={styles.cue} aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="none">
                <path
                  d="M5 8L10 13L15 8"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className={styles.workLabel}>Każdy projekt dzielimy na czytelne etapy. Przed rozpoczęciem prac znasz zakres oraz plan działania.</p>
          </div>
        </div>

        <div className={styles.timeline}>
          <svg
            className={styles.wave}
            viewBox="0 0 1200 112"
            aria-hidden="true"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient
                id="processWaveGradient"
                x1="100"
                y1="56"
                x2="1100"
                y2="56"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="var(--color-tm-blue)" />
                <stop offset="1" stopColor="var(--color-tm-green)" />
              </linearGradient>
            </defs>
            <path
              data-process-wave-path
              className={styles.wavePath}
              d="M100 56 C165 14 235 14 300 56 C365 98 435 98 500 56 C565 14 635 14 700 56 C765 98 835 98 900 56 C965 14 1035 14 1100 56"
            />
            <path
              data-process-wave-active
              className={styles.waveActive}
              stroke="url(#processWaveGradient)"
              d="M100 56 C165 14 235 14 300 56 C365 98 435 98 500 56 C565 14 635 14 700 56 C765 98 835 98 900 56 C965 14 1035 14 1100 56"
            />
            <circle
              data-process-pulse-halo
              className={styles.wavePulseHalo}
              cx="100"
              cy="56"
              r="13"
            />
            <circle
              data-process-pulse
              className={styles.wavePulse}
              cx="100"
              cy="56"
              r="7"
            />
          </svg>
          <ol className={styles.steps} aria-label="Proces współpracy">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              const isGreen = index % 2 === 1;
              const stepNumber = index + 1;

              return (
                <li
                  key={step.title}
                  data-process-step
                  className={styles.step}
                  data-tone={isGreen ? 'green' : 'blue'}
                >
                  <article data-process-card className={styles.stepCard}>
                    <div className={styles.stepMeta}>
                      <span>Etap</span>
                      <strong>{String(stepNumber).padStart(2, '0')}</strong>
                    </div>
                    <div data-process-marker className={styles.marker}>
                      <div
                        data-process-icon
                        className={cn(
                          styles.stepIcon,
                          isGreen && styles.stepIconGreen,
                        )}
                      >
                        <Icon size={30} strokeWidth={1.55} />
                      </div>
                      <span className={styles.stepNumber}>{stepNumber}</span>
                    </div>
                    <h3 data-process-title className={styles.stepTitle}>
                      {step.title}
                    </h3>
                    <p className={styles.stepDescription}>
                      {step.description}
                    </p>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
