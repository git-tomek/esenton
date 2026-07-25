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
            esenton – studio interaktywne
          </div>
          <h1 className={styles.title}>
          Strony, sklepy i aplikacje webowe,{" "}
            <span className={styles.titleAccent}>
            które{" "}
              <span className={styles.highlightWrap}>
                <span className={styles.highlightLabel}>pracują na Twój biznes.</span>
              </span>
            </span>
          </h1>
          <p className={styles.lead}>
          Projektujemy i wdrażamy strony internetowe, sklepy oraz aplikacje webowe dla małych i średnich firm. Od pierwszej rozmowy po opiekę techniczną.
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
