import styles from '../styles/Footer.module.css';
import ProfileFooter from './ProfileFooter';

export default function Footer({ strings, profile }) {
  const footerCopy = strings?.footer || {};
  return (
    <footer className={styles.footer}>
      <div className={styles.profileBlock}>
        <ProfileFooter profile={profile} />
      </div>
      <div className={styles.meta}>
        <p>{footerCopy.powered || 'Powered by Behance'}</p>
        <p className={styles.rights}>{footerCopy.rights || '© RAD Studio'}</p>
      </div>
    </footer>
  );
}
