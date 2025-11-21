import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Loading from '../../components/Loading';
import ProjectModules from '../../components/ProjectModules';
import strings from '../../content/strings/zh.json';
import { DEFAULT_USER } from '../../lib/constants';
import styles from '../../styles/ProjectPage.module.css';

export default function ProjectPage() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        setLoading(true);
        const [projectRes, profileRes] = await Promise.all([
          fetch(`/api/behance/projects/${id}`),
          fetch(`/api/behance?user=${encodeURIComponent(DEFAULT_USER)}`)
        ]);
        const projectBody = await projectRes.json();
        const profileBody = await profileRes.json();

        if (projectRes.ok) {
          setProject(projectBody.project || projectBody);
        } else {
          throw new Error(projectBody.error || 'Project fetch failed');
        }

        if (profileRes.ok && profileBody.user) {
          setProfile(profileBody.user);
        }
      } catch (err) {
        setError(strings.project.error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <Layout title="加载中 | RAD Studio" profile={profile} strings={strings}>
        <Loading text={strings.project.loading} />
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout title="错误 | RAD Studio" profile={profile} strings={strings}>
        <div className="page-error">{error || strings.project.error}</div>
      </Layout>
    );
  }

  const cover =
    (project.covers && (project.covers[808] || project.covers[404] || project.covers[230])) ||
    (project.modules && project.modules[0] && project.modules[0].sizes && project.modules[0].sizes.max_808);

  return (
    <Layout title={`${project.name} | RAD Studio`} profile={profile} strings={strings}>
      <article className={styles.page}>
        <header className={styles.hero}>
          <div className={styles.meta}>
            <p className={styles.fields}>{(project.fields || []).join(' · ')}</p>
            <h1 className={styles.title}>{project.name}</h1>
            <div className={styles.stats}>
              {project.stats?.appreciations ? <span>❤ {project.stats.appreciations}</span> : null}
              {project.stats?.views ? <span>👁 {project.stats.views}</span> : null}
              {project.url ? (
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  {strings.project.viewOnBehance}
                </a>
              ) : null}
            </div>
          </div>
          <div className={styles.cover}>
            {cover ? <img src={cover} alt={project.name} /> : <div className={styles.coverFallback} />}
          </div>
        </header>

        <section className={styles.body}>
          <ProjectModules modules={project.modules} />
        </section>

        <div className={styles.back}>
          <a href="/">{strings.project.back}</a>
        </div>
      </article>
    </Layout>
  );
}
