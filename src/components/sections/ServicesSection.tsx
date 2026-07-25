"use client";

import { Card, CardContent } from "@mui/material";

import { Container } from "@/components/layout/Container";
import { GridLines } from "@/components/layout/GridLines";
import Image from "next/image";
import { mainServices } from "@/data/services";
import styles from "./ServicesSection.module.scss";

const showcaseServices: Record<
  number,
  {
    image: string;
    imageWidth: number;
    imageHeight: number;
    tone:
      | "web"
      | "commerce"
      | "apps"
      | "crm"
      | "warehouse"
      | "design"
      | "ai"
      | "cloud"
      | "database"
      | "security"
      | "mobile"
      | "hosting";
  }
> = {
  0: {
    image: "/images/service_t_01.png",
    imageWidth: 1254,
    imageHeight: 1254,
    tone: "web",
  },
  1: {
    image: "/images/service_t_02.png",
    imageWidth: 1024,
    imageHeight: 1024,
    tone: "commerce",
  },
  2: {
    image: "/images/service_t_03.png",
    imageWidth: 1024,
    imageHeight: 1024,
    tone: "apps",
  },
  3: {
    image: "/images/service_t_04.png",
    imageWidth: 1536,
    imageHeight: 1024,
    tone: "crm",
  },
  4: {
    image: "/images/service_t_05.png",
    imageWidth: 1536,
    imageHeight: 1024,
    tone: "warehouse",
  },
  5: {
    image: "/images/service_t_06.png",
    imageWidth: 1536,
    imageHeight: 1024,
    tone: "design",
  },
  6: {
    image: "/images/service_t_07.png",
    imageWidth: 1536,
    imageHeight: 1024,
    tone: "ai",
  },
  7: {
    image: "/images/service_t_08.png",
    imageWidth: 1403,
    imageHeight: 1121,
    tone: "cloud",
  },
  8: {
    image: "/images/service_t_09.png",
    imageWidth: 1536,
    imageHeight: 1024,
    tone: "database",
  },
  9: {
    image: "/images/service_t_10.png",
    imageWidth: 1536,
    imageHeight: 1024,
    tone: "security",
  },
  10: {
    image: "/images/service_t_11.png",
    imageWidth: 1536,
    imageHeight: 1024,
    tone: "mobile",
  },
  11: {
    image: "/images/service_t_12.png",
    imageWidth: 1536,
    imageHeight: 1024,
    tone: "hosting",
  },
};

export function ServicesSection() {
  return (
    <section id="services" className={styles.servicesSection}>
      <GridLines />
      <Container>
        <div className={styles.sectionHeader}>
          <div>
            <div className={styles.eyebrow}>
              Usługi
            </div>
          </div>
          <div className={styles.highlightBlueWrap}>
            <h2 className={styles.sectionTitle}>
            Co możemy dla Ciebie zbudować?
            </h2>
            <Image
              src="/images/highlight-blue.svg"
              alt=""
              aria-hidden
              width={417}
              height={50}
              className={styles.highlightBlueSvg}
            />
          </div>
        </div>
        <div className={styles.servicesGrid}>
          {mainServices.map((service, index) => {
            const Icon = service.icon;
            const showcase = showcaseServices[index];

            if (showcase) {
              return (
                <Card
                  key={service.title}
                  data-service-card
                  data-showcase-tone={showcase.tone}
                  className={styles.serviceShowcaseCard}
                >
                  <Image
                    src="/images/cart-top2.svg"
                    alt=""
                    aria-hidden
                    width={123}
                    height={67}
                    className={styles.serviceCardTab}
                  />
                  <div className={styles.serviceShowcaseIcon}>
                    <Icon size={26} strokeWidth={1.6} />
                  </div>
                  <CardContent className={styles.serviceShowcaseContent}>
                    <div className={styles.serviceShowcaseCopy}>
                      <h3 className={styles.serviceShowcaseTitle}>
                        {service.title}
                      </h3>
                      <p className={styles.serviceShowcaseDescription}>
                        {service.description}
                      </p>
                    </div>
                    <div className={styles.serviceShowcaseImageWrap}>
                      <Image
                        src={showcase.image}
                        alt=""
                        aria-hidden
                        width={showcase.imageWidth}
                        height={showcase.imageHeight}
                        sizes="(min-width: 1200px) 270px, (min-width: 600px) 36vw, 58vw"
                        className={styles.serviceShowcaseImage}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            }

            return (
              <Card
                key={service.title}
                data-service-card
                className={styles.serviceCard}
              >
                <Image
                  src="/images/cart-top2.svg"
                  alt=""
                  aria-hidden
                  width={123}
                  height={67}
                  className={styles.serviceCardTab}
                />
                <CardContent className={styles.serviceCardContent}>
                  <div className={styles.serviceIcon}>
                    <Icon size={26} strokeWidth={1.5} />
                  </div>
                  <h3 className={styles.serviceTitle}>
                    {service.title}
                  </h3>
                  <p className={styles.serviceDescription}>
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
