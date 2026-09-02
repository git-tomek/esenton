import { ArrowForward } from "@mui/icons-material";
import { Button } from "@mui/material";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { HeroCanvas } from "@/components/three";
import styles from "./HeroSection.module.scss";

const benefits = [
  "Jeden zespół: projekt, kod i wdrożenie",
  "Jasny zakres, terminy i wycena",
  "Rozwiązania gotowe dla dalszego rozwoju",
  "Opieka techniczna po starcie",
];

export function HeroSection() {
  return (
    <section id="hero" className={styles.hero}>
      <HeroCanvas />
      <div className={styles.scrim} aria-hidden="true" />
      <Container className={styles.inner}>
        <div className={styles.content}>
          <div className={styles.eyebrow}>
            Projektowanie i development
          </div>
          <h1 className={styles.title}>
            <span className={styles.titleLead}>Projektujemy i wdrażamy</span>{" "}
            <span className={styles.titleLine2}>
              strony, <span className={styles.titleAccent}>sklepy internetowe</span>
            </span>{" "}
            <span className={styles.titleAccent}>
            oraz aplikacje webowe{" "}
              <span className={styles.highlightWrap}>
                <span className={styles.highlightLabel}>dla firm i instytucji.</span>
              </span>
            </span>
          </h1>
          <p className={styles.lead}>
          Prowadzimy cały projekt — od analizy i UX/UI, przez frontend i backend, po integracje, wdrożenie oraz dalszy rozwój.
          </p>
          <div className={styles.actions}>
            <Button
              variant="contained"
              size="medium"
              href="#contact"
              endIcon={<ArrowForward />}
            >
              Zapytaj o projekt
            </Button>
            <Button
              variant="outlined"
              size="medium"
              href="#services"
              endIcon={<ArrowForward />}
            >
              Zobacz usługi
            </Button>
          </div>
          <div className={styles.benefits}>
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className={styles.benefit}
              >
                <CheckCircle2
                  size={18}
                  strokeWidth={1.75}
                  className={styles.benefitIcon}
                />
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
