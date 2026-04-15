import { useEffect } from 'react';

const INDEX_ROBOTS = 'index, follow, max-image-preview:large';
const NOINDEX_ROBOTS = 'noindex, nofollow';

function setRobotsContent(content: string) {
  let el = document.querySelector('meta[name="robots"]');
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', 'robots');
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Use on /backend/* so admin URLs are not indexed. */
export default function NoIndexHead() {
  useEffect(() => {
    setRobotsContent(NOINDEX_ROBOTS);
    return () => {
      requestAnimationFrame(() => {
        if (!window.location.pathname.startsWith('/backend')) {
          setRobotsContent(INDEX_ROBOTS);
        }
      });
    };
  }, []);
  return null;
}
