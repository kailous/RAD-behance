import styles from '../styles/ProjectModules.module.css';

function getBestImage(module) {
  if (!module || !module.sizes) return '';
  const sizes = module.sizes;
  const order = [
    'original',
    'max_1920',
    'max_1400',
    'max_1200',
    'max_808',
    'max_800',
    'max_632',
    'max_600',
    'max_316',
    'disp'
  ];
  for (let i = 0; i < order.length; i += 1) {
    if (sizes[order[i]]) return sizes[order[i]];
  }
  return '';
}

export default function ProjectModules({ modules }) {
  if (!modules || !modules.length) {
    return <p className={styles.empty}>该作品暂无详细内容。</p>;
  }

  return (
    <div className={styles.modules}>
      {modules.map((module, idx) => {
        const type = module.type || 'image';
        const key = `${type}-${idx}`;

        if ((type === 'image' || type === 'media') && getBestImage(module)) {
          return (
            <div className={`${styles.module} ${styles.image}`} key={key}>
              <img src={getBestImage(module)} alt={module.caption || 'Project media'} loading="lazy" />
              {module.caption ? <p className={styles.caption}>{module.caption}</p> : null}
            </div>
          );
        }

        if (type === 'text' && module.text) {
          return (
            <div className={`${styles.module} ${styles.text}`} key={key}>
              <div dangerouslySetInnerHTML={{ __html: module.text }} />
            </div>
          );
        }

        if ((type === 'embed' || type === 'video') && module.embed) {
          return (
            <div className={`${styles.module} ${styles.embed}`} key={key} dangerouslySetInnerHTML={{ __html: module.embed }} />
          );
        }

        return null;
      })}
    </div>
  );
}
