import styles from '../styles/Loading.module.css';

export default function Loading({ text = '载入中...' }) {
  return (
    <div className={styles.loading}>
      <div className={styles.spinner} />
      <span>{text}</span>
    </div>
  );
}
