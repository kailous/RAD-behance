import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import strings from '../content/strings/zh.json';
import styles from '../styles/StaticPage.module.css';
import { DEFAULT_USER } from '../lib/constants';

export default function Contact() {
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
    <Layout title="联系我们 | RAD Studio" profile={profile} strings={strings}>
        <section className={styles.pageHero}>
            <p className={styles.eyebrow}>{strings.hero.eyebrow}</p>
            <h1 className={styles.title}>{strings.contact.title}</h1>
            <p className={styles.lede}>{strings.contact.lede}</p>
        </section>
        <section className={styles.formCard}>
            <form className={styles.form}>
                <label>姓名</label>
                <input type="text" name="name" placeholder="请输入您的称呼" />
                <label>邮箱</label>
                <input type="email" name="email" placeholder="name@example.com" />
                <label>需求 / 留言</label>
                <textarea name="message" rows="5" placeholder="请描述您的想法：品牌、作品集、或其他需求"></textarea>
                <button type="button" onClick={() => alert('示例表单未连接后端。如需收件，请在后端配置。')}>
                  发送
                </button>
                <p className={styles.note}>{strings.contact.note}</p>
            </form>
        </section>
    </Layout>
  );
}
