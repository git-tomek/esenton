"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Blocks,
  CloudCog,
  Code2,
  Cuboid,
  Database,
  LayoutGrid,
  ServerCog,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { Container } from "@/components/layout/Container";
import { GridLines } from "@/components/layout/GridLines";
import styles from "./TechnologiesSection.module.scss";

gsap.registerPlugin(useGSAP);

type ImageTechnology = {
  kind: "image";
  name: string;
  src: string;
  width?: number;
  height?: number;
};

type ChipTechnology = {
  kind: "chip";
  name: string;
};

type TechnologyItem = ImageTechnology | ChipTechnology;

type TechnologyCategory = {
  id: string;
  label: string;
  eyebrow: string;
  description: string;
  icon: LucideIcon;
  variant: "icons" | "chips";
  items: readonly TechnologyItem[];
};

const technologyCategories = [
  {
    id: "frontend",
    label: "Frontend",
    eyebrow: "Interfejsy",
    description:
      "Warstwa, z którą pracują użytkownicy: szybkość, dostępność, responsywność i czytelne ścieżki prowadzące do celu.",
    icon: Code2,
    variant: "icons",
    items: [
      { kind: "image", name: "React", src: "/images/technologies/frontend/react.svg" },
      {
        kind: "image",
        name: "TypeScript",
        src: "/images/technologies/frontend/typescript.svg",
      },
      { kind: "image", name: "Next.js", src: "/images/technologies/frontend/nextjs.svg" },
      {
        kind: "image",
        name: "Tailwind CSS",
        src: "/images/technologies/frontend/tailwind.svg",
      },
      {
        kind: "image",
        name: "JavaScript",
        src: "/images/technologies/frontend/javascript.svg",
      },
      { kind: "image", name: "HTML5", src: "/images/technologies/frontend/html5.svg" },
      { kind: "image", name: "CSS3", src: "/images/technologies/frontend/css3.svg" },
      { kind: "image", name: "Sass", src: "/images/technologies/frontend/sass.svg" },
      { kind: "image", name: "GSAP", src: "/images/technologies/frontend/gsap.svg" },
      { kind: "image", name: "Three.js", src: "/images/technologies/frontend/threejs.svg" },
      { kind: "image", name: "Redux", src: "/images/technologies/frontend/redux.svg" },
      { kind: "image", name: "Zustand", src: "/images/technologies/frontend/zustand.svg" },
      { kind: "image", name: "Zod", src: "/images/technologies/frontend/zod.svg" },
      { kind: "image", name: "Vite", src: "/images/technologies/frontend/vitejs.svg" },
      { kind: "image", name: "npm", src: "/images/technologies/frontend/npm.svg" },
      { kind: "image", name: "Framer", src: "/images/technologies/frontend/framer.svg" },
      {
        kind: "image",
        name: "Material UI",
        src: "/images/technologies/frontend/material-ui.svg",
      },
      {
        kind: "image",
        name: "Chakra UI",
        src: "/images/technologies/frontend/chakra-ui.svg",
      },
      {
        kind: "image",
        name: "shadcn/ui",
        src: "/images/technologies/frontend/shadcn-ui.png",
      },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    eyebrow: "Logika",
    description:
      "API, integracje, logika biznesowa i stabilne fundamenty dla aplikacji webowych, CRM, ERP oraz sklepów internetowych.",
    icon: ServerCog,
    variant: "icons",
    items: [
      { kind: "image", name: "Node.js", src: "/images/technologies/backend/nodejs.png" },
      { kind: "image", name: "Python", src: "/images/technologies/backend/python.png" },
      { kind: "image", name: "Go", src: "/images/technologies/backend/go.png" },
      {
        kind: "image",
        name: "Express.js",
        src: "/images/technologies/backend/expressjs.svg",
      },
      { kind: "image", name: "FastAPI", src: "/images/technologies/backend/fastapi.webp" },
      { kind: "image", name: "GraphQL", src: "/images/technologies/backend/graphql.png" },
      { kind: "image", name: "Prisma", src: "/images/technologies/backend/prisma.png" },
      { kind: "image", name: "MongoDB", src: "/images/technologies/backend/mongodb.svg" },
      { kind: "image", name: "tRPC", src: "/images/technologies/backend/trpc-io.webp" },
      { kind: "image", name: "Socket.IO", src: "/images/technologies/backend/socket-io.svg" },
      { kind: "image", name: "JWT", src: "/images/technologies/misc/jwt.webp" },
      { kind: "image", name: "PHP", src: "/images/technologies/backend/php.png" },
      { kind: "image", name: "Laravel", src: "/images/technologies/backend/laravel.png" },
      { kind: "image", name: "Composer", src: "/images/technologies/backend/Composer.svg" },
      { kind: "image", name: "WordPress", src: "/images/technologies/backend/wordpress.png" },
      {
        kind: "image",
        name: "WooCommerce",
        src: "/images/technologies/backend/woocommerce.png",
      },
    ],
  },
  {
    id: "database",
    label: "Bazy danych",
    eyebrow: "Dane",
    description:
      "Struktura danych, wyszukiwanie, cache i przechowywanie informacji projektowane pod wydajność, koszty i bezpieczeństwo.",
    icon: Database,
    variant: "icons",
    items: [
      {
        kind: "image",
        name: "PostgreSQL",
        src: "/images/technologies/database/PostgreSQL.png",
      },
      { kind: "image", name: "Redis", src: "/images/technologies/database/redis.svg" },
      {
        kind: "image",
        name: "Elasticsearch",
        src: "/images/technologies/database/Elasticsearch.svg",
      },
      { kind: "image", name: "MySQL", src: "/images/technologies/database/mysql.svg" },
      { kind: "image", name: "MariaDB", src: "/images/technologies/database/mariadb.svg" },
      { kind: "image", name: "Firebase", src: "/images/technologies/database/firebase.svg" },
      { kind: "image", name: "Supabase", src: "/images/technologies/database/supabase.svg" },
      { kind: "image", name: "Qdrant", src: "/images/technologies/database/qdrant.png" },
      {
        kind: "image",
        name: "Azure Storage",
        src: "/images/technologies/database/microsoft-azure-storage-explorer.svg",
      },
      { kind: "image", name: "Amazon S3", src: "/images/technologies/database/Amazon-S3.svg.png" },
    ],
  },
  {
    id: "data-automation",
    label: "Dane i automatyzacja",
    eyebrow: "Procesy",
    description:
      "Automatyzacja workflow, przetwarzanie danych, integracje i narzędzia ograniczające ręczną pracę zespołu.",
    icon: Blocks,
    variant: "icons",
    items: [
      { kind: "image", name: "n8n", src: "/images/technologies/misc/n8n.png" },
      { kind: "image", name: "Apache Airflow", src: "/images/technologies/misc/apache-airflow.webp" },
      { kind: "image", name: "Apache Spark", src: "/images/technologies/misc/apache_spark.png" },
      { kind: "image", name: "RabbitMQ", src: "/images/technologies/misc/rabbitmq.svg" },
      { kind: "image", name: "pandas", src: "/images/technologies/misc/pandas.svg" },
      { kind: "image", name: "NumPy", src: "/images/technologies/misc/numpy.svg" },
      { kind: "image", name: "D3.js", src: "/images/technologies/misc/d3.svg" },
      { kind: "image", name: "Matplotlib", src: "/images/technologies/misc/matplotlib.svg" },
      { kind: "image", name: "LangChain", src: "/images/technologies/misc/langchain.png" },
      { kind: "image", name: "LangGraph", src: "/images/technologies/misc/langgraph.png" },
    ],
  },
  {
    id: "devops",
    label: "DevOps",
    eyebrow: "Infrastruktura",
    description:
      "Deployment, kontenery, CI/CD, monitoring i konfiguracja środowisk, aby system stabilnie działał po wdrożeniu.",
    icon: CloudCog,
    variant: "icons",
    items: [
      { kind: "image", name: "Docker", src: "/images/technologies/devops/docker.png" },
      { kind: "image", name: "Kubernetes", src: "/images/technologies/devops/kubernetes.png" },
      {
        kind: "image",
        name: "GitHub Actions",
        src: "/images/technologies/devops/GitHub%20Actions.svg",
      },
      { kind: "image", name: "NGINX", src: "/images/technologies/devops/NGINX.svg" },
      { kind: "image", name: "AWS", src: "/images/technologies/devops/AWS.svg" },
      {
        kind: "image",
        name: "Terraform",
        src: "/images/technologies/devops/HashiCorp%20Terraform.svg",
      },
      { kind: "image", name: "Azure", src: "/images/technologies/devops/Azure.svg" },
      {
        kind: "image",
        name: "Google Cloud",
        src: "/images/technologies/devops/Google%20Cloud.svg",
      },
      {
        kind: "image",
        name: "DigitalOcean",
        src: "/images/technologies/devops/Digital%20Ocean.svg",
      },
      { kind: "image", name: "GitHub", src: "/images/technologies/devops/GitHub.svg" },
      { kind: "image", name: "GitLab", src: "/images/technologies/misc/gitlab.svg" },
      { kind: "image", name: "Bash", src: "/images/technologies/devops/Bash.svg" },
      { kind: "image", name: "Linux", src: "/images/technologies/devops/Linux.svg" },
      { kind: "image", name: "Nx", src: "/images/technologies/devops/nx.png" },
      { kind: "image", name: "Prometheus", src: "/images/technologies/devops/Prometheus.svg" },
      { kind: "image", name: "Ansible", src: "/images/technologies/devops/ansible.svg" },
      { kind: "image", name: "Grafana", src: "/images/technologies/devops/Grafana.svg" },
      { kind: "image", name: "Cypress", src: "/images/technologies/misc/cypress.svg" },
      { kind: "image", name: "Jest", src: "/images/technologies/misc/jest.svg" },
    ],
  },
  {
    id: "architecture",
    label: "Architektura",
    eyebrow: "Wzorce",
    description:
      "Wzorce, granice modułów i praktyki, które utrzymują system zrozumiały, skalowalny i łatwy w dalszym rozwoju.",
    icon: LayoutGrid,
    variant: "chips",
    items: [
      { kind: "chip", name: "Microservices" },
      { kind: "chip", name: "Event-Driven" },
      { kind: "chip", name: "WebSockets" },
      { kind: "chip", name: "Server-Sent Events" },
      { kind: "chip", name: "gRPC" },
      { kind: "chip", name: "Serverless" },
      { kind: "chip", name: "REST API" },
      { kind: "chip", name: "GraphQL" },
      { kind: "chip", name: "Clean Architecture" },
      { kind: "chip", name: "UML" },
      { kind: "chip", name: "CI/CD" },
      { kind: "chip", name: "GitOps" },
      { kind: "chip", name: "IaC" },
      { kind: "chip", name: "OpenSpec" },
      { kind: "chip", name: "Monorepo" },
      { kind: "chip", name: "API Gateway" },
      { kind: "chip", name: "MVC/SPA" },
      { kind: "chip", name: "Rate Limiting" },
    ],
  },
  {
    id: "creative",
    label: "3D i interakcje",
    eyebrow: "Doświadczenie",
    description:
      "WebGL, 3D i animacje stosowane tam, gdzie wzmacniają przekaz marki, produkt lub kluczową interakcję użytkownika.",
    icon: Cuboid,
    variant: "icons",
    items: [
      { kind: "image", name: "Three.js", src: "/images/technologies/3D/Three.js.svg" },
      { kind: "image", name: "Blender", src: "/images/technologies/3D/Blender.svg" },
      { kind: "image", name: "WebGL", src: "/images/technologies/3D/WebGL.svg" },
      { kind: "image", name: "Figma", src: "/images/technologies/3D/Figma.svg" },
      { kind: "image", name: "GSAP", src: "/images/technologies/3D/gsap-greensock.svg" },
    ],
  },
] as const satisfies readonly TechnologyCategory[];

type TechnologyCategoryId = (typeof technologyCategories)[number]["id"];
type ActivePanelId = "all" | TechnologyCategoryId;

const visiblePreviewCount = 4;
const visibleChipPreviewCount = 6;

function TechnologyChip({
  name,
  isPreview = false,
}: {
  name: string;
  isPreview?: boolean;
}) {
  return (
    <span
      className={isPreview ? styles.chipPreview : styles.chip}
      {...(!isPreview ? { "data-technology-item": true } : {})}
    >
      {name}
    </span>
  );
}

function TechnologyIcon({ item, isPreview = false }: { item: ImageTechnology; isPreview?: boolean }) {
  return (
    <span className={styles.logoFrame} aria-hidden="true">
      <Image
        src={item.src}
        alt=""
        width={item.width ?? 64}
        height={item.height ?? 64}
        sizes={isPreview ? "44px" : "58px"}
        className={styles.techLogo}
      />
    </span>
  );
}

export function TechnologiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activePanelId, setActivePanelId] = useState<ActivePanelId>("all");
  const activeCategory = technologyCategories.find(
    (category) => category.id === activePanelId,
  );

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const panel = root.querySelector<HTMLElement>("[data-technology-panel]");
      const animatedItems = Array.from(
        root.querySelectorAll<HTMLElement>("[data-technology-item]"),
      );
      if (!panel || !animatedItems.length) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const timeline = gsap.timeline({
          defaults: { ease: "power3.out" },
        });

        timeline
          .fromTo(
            panel,
            { autoAlpha: 0, y: 12, scale: 0.985 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.34 },
          )
          .fromTo(
            animatedItems,
            { autoAlpha: 0, y: 18, scale: 0.92 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.46,
              stagger: 0.035,
              clearProps: "visibility",
            },
            "-=0.16",
          );

        return () => {
          timeline.kill();
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef, dependencies: [activePanelId], revertOnUpdate: true },
  );

  return (
    <section id="technologies" ref={sectionRef} className={styles.technologiesSection}>
      <GridLines />
      <Container>
        <div className={styles.shell}>
          <div className={styles.sectionHeader}>
            <div className={styles.headerCopy}>
              <p className={styles.eyebrow}>Technologie</p>
              <h2 className={styles.sectionTitle}>
              Technologie dobrane do projektu.
              </h2>
              <p className={styles.sectionDescription}>
              Nie zaczynamy od wyboru technologii. Najpierw poznajemy cele i wymagania projektu, a następnie dobieramy rozwiązania, które zapewnią wydajność, bezpieczeństwo i możliwość dalszego rozwoju.
              </p>
            </div>

            <aside className={styles.signalCard} aria-label="Jak dobieramy narzędzia">
              <Sparkles size={20} strokeWidth={1.8} />
              <p>
                Technologia ma wspierać sprzedaż, obsługę klienta i procesy firmy,
                a nie komplikować utrzymanie projektu.
              </p>
            </aside>
          </div>

          <div className={styles.tabs} role="tablist" aria-label="Kategorie technologii">
            <button
              type="button"
              className={activePanelId === "all" ? styles.tabActive : styles.tab}
              onClick={() => setActivePanelId("all")}
              aria-pressed={activePanelId === "all"}
            >
              <Blocks size={17} strokeWidth={1.8} />
              Wszystko
            </button>

            {technologyCategories.map((category) => {
              const Icon = category.icon;
              const isActive = activePanelId === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  className={isActive ? styles.tabActive : styles.tab}
                  onClick={() => setActivePanelId(category.id)}
                  aria-pressed={isActive}
                >
                  <Icon size={17} strokeWidth={1.8} />
                  {category.label}
                </button>
              );
            })}
          </div>

          <div data-technology-panel className={styles.board}>
            {activeCategory ? (
              <article className={styles.detailCard}>
                <div className={styles.detailHeader}>
                  <div>
                    <p className={styles.cardEyebrow}>{activeCategory.eyebrow}</p>
                    <h3>{activeCategory.label}</h3>
                    <p>{activeCategory.description}</p>
                  </div>
                  <button
                    type="button"
                    className={styles.backButton}
                    onClick={() => setActivePanelId("all")}
                  >
                    Pokaż wszystko
                  </button>
                </div>

                {activeCategory.variant === "chips" ? (
                  <div className={styles.chipGrid}>
                    {activeCategory.items.map((item) => (
                      <TechnologyChip key={item.name} name={item.name} />
                    ))}
                  </div>
                ) : (
                  <div className={styles.detailGrid}>
                    {activeCategory.items.map((item) => {
                      if (item.kind !== "image") return null;

                      return (
                        <div key={item.name} data-technology-item className={styles.techTile}>
                          <TechnologyIcon item={item} />
                          <span>{item.name}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </article>
            ) : (
              <div className={styles.categoryGrid}>
                {technologyCategories.map((category) => {
                  const Icon = category.icon;
                  const hiddenCount = Math.max(category.items.length - visiblePreviewCount, 0);

                  return (
                    <button
                      key={category.id}
                      type="button"
                      data-technology-item
                      className={styles.categoryCard}
                      onClick={() => setActivePanelId(category.id)}
                    >
                      <span className={styles.categoryHeading}>
                        <Icon size={19} strokeWidth={1.8} />
                        <span>{category.label}</span>
                      </span>
                      {category.variant === "chips" ? (
                        <span className={styles.chipPreviewRow}>
                          {category.items
                            .slice(0, visibleChipPreviewCount)
                            .map((item) => (
                              <TechnologyChip key={item.name} name={item.name} isPreview />
                            ))}
                          {Math.max(category.items.length - visibleChipPreviewCount, 0) > 0 && (
                            <span className={styles.chipMoreBadge}>
                              +{category.items.length - visibleChipPreviewCount}
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className={styles.previewRow}>
                          {category.items.slice(0, visiblePreviewCount).map((item) => {
                            if (item.kind !== "image") return null;

                            return (
                              <span key={item.name} className={styles.previewItem}>
                                <TechnologyIcon item={item} isPreview />
                                <span>{item.name}</span>
                              </span>
                            );
                          })}
                          {hiddenCount > 0 && (
                            <span className={styles.moreBadge}>+{hiddenCount}</span>
                          )}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
