import Link from 'next/link';
import styles from '../styles/Header.module.css';

export default function Header({ strings, brand }) {
  const nav = strings?.nav || {};
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label={brand || 'Home'}>
          <span className={styles.dot} />
          <span className={styles.wordmark}>{brand || 'Studio'}</span>
        </Link>
        <nav className={styles.nav}>
          <Link href="/">{nav.home || '作品集'}</Link>
          <Link href="/about">{nav.about || '关于我们'}</Link>
          <Link href="/contact">{nav.contact || '联系我们'}</Link>
        </nav>
      </div>
    </header>
  );
}
