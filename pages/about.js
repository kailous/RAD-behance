import Layout from '../components/Layout';
import strings from '../content/strings/zh.json';
import styles from '../styles/StaticPage.module.css';
import { DEFAULT_USER } from '../lib/constants';
import { useEffect, useState } from 'react';

export default function About() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/behance?user=${encodeURIComponent(DEFAULT_USER)}`);
        const body = await res.json();
        if (res.ok && body.user) {
          setProfile(body.user);
        }
      } catch (err) {
        // silent
      }
    }
    load();
  }, []);

  return (
    <Layout title="关于我们 | RAD Studio" profile={profile} strings={strings}>
      <section className={styles.pageHero}>
        <p className={styles.eyebrow}>{strings.hero.eyebrow}</p>
        <h1 className={styles.title}>{strings.about.title}</h1>
        <p className={styles.lede}>{strings.about.lede}</p>
      </section>
      <section className={styles.cards}>
        {strings.about.bullets.map((item) => (
          <article key={item} className={styles.card}>
            <div className={styles.dot} />
            <p>{item}</p>
          </article>
        ))}
      </section>
    </Layout>
  );
}
