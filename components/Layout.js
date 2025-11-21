import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import stringsZh from '../content/strings/zh.json';

export default function Layout({ children, title, profile, strings = stringsZh }) {
  return (
    <>
      <Head>
        <title>{title || 'RAD Studio | Portfolio'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={strings.hero?.subtitle || 'Portfolio powered by Behance'} />
      </Head>
      <Header strings={strings} brand={strings.brand} />
      <main>{children}</main>
      <Footer strings={strings} profile={profile} />
    </>
  );
}
