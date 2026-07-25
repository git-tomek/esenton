import { Container } from '@/components/layout/Container';
import { GridLines } from '@/components/layout/GridLines';
import styles from './WhyUsSection.module.scss';
import { whyUs } from '@/data/whyUs';

export function WhyUsSection() {
  return (
    <section id="about" className={styles.section}>
      <GridLines />
      <Container>
        <div className={styles.cardWrap}>
          {whyUs.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className={styles.item}>
                <div className={styles.iconWrap}>
                  <Icon className={styles.icon} strokeWidth={1.25} />
                </div>
                <div>
                  <h3 className={styles.title}>{item.title}</h3>
                  <p className={styles.description}>
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
