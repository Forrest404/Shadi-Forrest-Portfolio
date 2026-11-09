// Silent loops play only while on screen, at most two at a time, and never with
// reduced motion on: the poster image stays up instead.
const MAX_PLAYING = 2;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduce) {
  const visible = new Map<HTMLVideoElement, number>();

  const sync = () => {
    const winners = [...visible.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_PLAYING)
      .map(([video]) => video);
    document.querySelectorAll<HTMLVideoElement>('video[data-loop]').forEach((video) => {
      if (winners.includes(video)) void video.play().catch(() => {});
      else video.pause();
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) visible.set(video, entry.intersectionRatio);
        else visible.delete(video);
      }
      sync();
    },
    { threshold: [0, 0.25, 0.5, 0.75, 1] },
  );

  document.querySelectorAll<HTMLVideoElement>('video[data-loop]').forEach((video) => observer.observe(video));

  // The theatre pauses everything while a film plays.
  document.addEventListener('theatre', (event) => {
    if ((event as CustomEvent<boolean>).detail) {
      document.querySelectorAll<HTMLVideoElement>('video[data-loop]').forEach((video) => video.pause());
    } else {
      sync();
    }
  });
}
