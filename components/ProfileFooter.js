import styles from '../styles/ProfileFooter.module.css';

export default function ProfileFooter({ profile }) {
  if (!profile) {
    return (
      <div className={styles.placeholder}>
        <div className={styles.avatarSkeleton} />
        <div className={styles.lines}>
          <span />
          <span />
        </div>
      </div>
    );
  }

  const fields = profile.fields || [];
  const avatar = profile.images && (profile.images[138] || profile.images[50] || profile.images[100]);

  return (
    <div className={styles.profile}>
      <div className={styles.avatarWrap}>
        {avatar ? <img src={avatar} alt={profile.display_name} /> : <div className={styles.avatarSkeleton} />}
      </div>
      <div className={styles.meta}>
        <p className={styles.name}>{profile.display_name}</p>
        <p className={styles.fields}>{fields.join(' · ')}</p>
        {profile.location ? <p className={styles.location}>{profile.location}</p> : null}
      </div>
    </div>
  );
}
