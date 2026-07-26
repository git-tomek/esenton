"use client";

import { Button, TextField } from "@mui/material";
import {
  ArrowForward,
  EmailOutlined,
  LocationOnOutlined,
} from "@mui/icons-material";
import dynamic from "next/dynamic";
import { Phone } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";

import { Container } from "@/components/layout/Container";
import { GridLines } from "@/components/layout/GridLines";
import styles from "./ContactSection.module.scss";

const ContactWaves = dynamic(
  () => import("./ContactWaves").then((mod) => mod.ContactWaves),
  { ssr: false },
);

const WEB3FORMS_ACCESS_KEY = "638d9802-6e34-43e0-b77c-301415c47035";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactSection() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.append("access_key", WEB3FORMS_ACCESS_KEY);
    formData.append("subject", "Nowe zapytanie ze strony esenton");
    formData.append("from_name", "esenton - studio interaktywne");

    setStatus("submitting");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className={styles.contactSection}>
      <ContactWaves />
      <GridLines />
      <Container>
        <div className={styles.contactShell}>
          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <div className={styles.eyebrow}>Kontakt</div>
              <h2 className={styles.title}>Masz projekt do zrealizowania?</h2>
              <p className={styles.lead}>
                Napisz, czy potrzebujesz strony internetowej, sklepu internetowego,
                aplikacji webowej, systemu CRM/ERP, integracji API albo stałej opieki technicznej.
              </p>
              <div className={styles.contactList}>
                <a
                  href="mailto:biuro@esenton.pl"
                  className={styles.contactItem}
                >
                  <ContactIcon icon={<EmailOutlined />} />
                  <div>
                    <div className={styles.contactValue}>
                      biuro@esenton.pl
                    </div>
                    <div className={styles.contactLabel}>Napisz do nas</div>
                  </div>
                </a>
                <a
                  href="tel:+48707123007"
                  className={styles.contactItem}
                >
                  <ContactIcon icon={<Phone size={19} />} />
                  <div>
                    <div className={styles.contactValue}>
                      707 123 007
                    </div>
                    <div className={styles.contactLabel}>Zadzwoń do nas</div>
                  </div>
                </a>
                <div className={styles.contactItem}>
                  <ContactIcon icon={<LocationOnOutlined />} />
                  <div>
                    <div className={styles.contactValue}>Kraków</div>
                    <div className={styles.contactLabel}>Współpracujemy z firmami w całym kraju</div>
                  </div>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Honeypot — bots fill this, humans don't. Web3Forms drops it. */}
              <input
                type="checkbox"
                name="botcheck"
                tabIndex={-1}
                autoComplete="off"
                style={{ display: "none" }}
                aria-hidden="true"
              />
              <div className={styles.fieldGrid}>
                <TextField
                  name="name"
                  label="Imię i nazwisko"
                  required
                  fullWidth
                  className={styles.field}
                />
                <TextField
                  name="email"
                  label="E-mail"
                  type="email"
                  required
                  fullWidth
                  className={styles.field}
                />
              </div>
              <TextField
                name="phone"
                label="Telefon"
                type="tel"
                fullWidth
                autoComplete="tel"
                className={styles.field}
                slotProps={{
                  htmlInput: {
                    inputMode: "tel",
                    pattern: "[0-9+\\s()-]{7,}",
                  },
                }}
              />
              <TextField
                name="message"
                label="Opisz krótko projekt"
                required
                fullWidth
                multiline
                minRows={5}
                className={styles.field}
              />
              <div className={styles.formActions}>
                <Button
                  type="submit"
                  variant="contained"
                  size="medium"
                  disabled={status === "submitting"}
                  endIcon={<ArrowForward />}
                >
                  {status === "submitting" ? "Wysyłanie..." : "Wyślij zapytanie"}
                </Button>
              </div>
              {status === "success" && (
                <p className={`${styles.securityNote} ${styles.statusSuccess}`}>
                  Dziękujemy. Wiadomość została wysłana, wrócimy z odpowiedzią możliwie szybko.
                </p>
              )}
              {status === "error" && (
                <p className={`${styles.securityNote} ${styles.statusError}`}>
                  Coś poszło nie tak. Spróbuj ponownie albo napisz bezpośrednio na e-mail.
                </p>
              )}
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}

function ContactIcon({ icon }: { icon: ReactNode }) {
  return <span className={styles.contactIcon}>{icon}</span>;
}
