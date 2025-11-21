import styles from '../styles/PortfolioGrid.module.css';
import ProjectCard from './ProjectCard';

export default function PortfolioGrid({ projects, title, emptyText }) {
  return (
    <section className={styles.section} id="portfolio">
      <div className={styles.header}>
        <p className={styles.eyebrow}>Behance</p>
        <h2 className={styles.title}>{title || '精选作品'}</h2>
      </div>
      <div className={styles.grid}>
        {(projects || []).map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        {(!projects || projects.length === 0) && (
          <div className={styles.empty}>{emptyText || '暂时没有作品'}</div>
        )}
      </div>
    </section>
  );
}
