import styles from '../styles/Hero.module.css';

export default function Hero({ strings }) {
  const hero = strings.hero || {};
  return (
    <section className={styles.hero}>
            {/* <iframe
              src="https://player.vimeo.com/video/1139210570?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0&controls=0"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            /> */}
            {/* 插入videos/rad.mp4 视频 去掉播放器UI 自动播放 循环播放 静音 */}
            <video
              src="/videos/rad.mp4"
              autoPlay
              loop
              muted
              className={styles.video}
            />
    </section>
  );
}
