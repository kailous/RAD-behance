import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import PortfolioGrid from '../components/PortfolioGrid';
import Loading from '../components/Loading';
import strings from '../content/strings/zh.json';
import { DEFAULT_USER } from '../lib/constants';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/behance?user=${encodeURIComponent(DEFAULT_USER)}`);
        const body = await res.json();
        if (!res.ok) {
          throw new Error(body.error || 'Fetch failed');
        }
        setData(body);
      } catch (err) {
        setError('无法获取作品数据，请稍后重试。');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const projectList = Array.isArray(data?.projects) ? data.projects : data?.projects?.projects || [];

  return (
    <Layout title="RAD Studio | Portfolio" profile={data?.user} strings={strings}>
      <Hero strings={strings} />
      {loading ? (
        <Loading text="正在加载作品..." />
      ) : error ? (
        <div className="page-error">{error}</div>
      ) : (
        <PortfolioGrid projects={projectList} title={strings.portfolio.title} emptyText={strings.portfolio.empty} />
      )}
    </Layout>
  );
}
