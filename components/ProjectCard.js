import Link from 'next/link';
import styles from '../styles/ProjectCard.module.css';

export default function ProjectCard({ project }) {
  const imgSrc =
    (project.covers && (project.covers[808] || project.covers[404] || project.covers[230])) || '';

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        {imgSrc ? <img src={imgSrc} alt={project.name} loading="lazy" /> : <div className={styles.imageFallback} />}
      </div>
      <div className={styles.body}>
        <p className={styles.fields}>{(project.fields || []).join(' · ')}</p>
        <h3 className={styles.title}>
          <Link href={`/project/${project.id}`}>{project.name}</Link>
        </h3>
        <div className={styles.meta}>
          {project.stats?.appreciations ? <span>❤ {project.stats.appreciations}</span> : null}
          {project.stats?.views ? <span>👁 {project.stats.views}</span> : null}
        </div>
      </div>
    </article>
  );
}
