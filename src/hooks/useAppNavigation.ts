import { useCallback, useEffect, useState } from 'react';

interface Route {
  view: string;
  param?: string;
}

// "#/catalog/Paithani%20Sarees" -> { view: 'catalog', param: 'Paithani Sarees' }
const parseHash = (): Route => {
  const raw = window.location.hash.replace(/^#\/?/, '');
  if (!raw) return { view: 'home' };
  const [view, ...rest] = raw.split('/');
  const param = rest.length ? decodeURIComponent(rest.join('/')) : undefined;
  return { view, param };
};

export function useAppNavigation() {
  const [route, setRoute] = useState<Route>(parseHash);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((view: string, param?: string) => {
    const hash =
      view === 'home' ? '' : `#/${view}${param ? `/${encodeURIComponent(param)}` : ''}`;
    if (hash === window.location.hash) {
      window.scrollTo({ top: 0 });
      return;
    }
    window.location.hash = hash;
  }, []);

  return { view: route.view, param: route.param, navigate };
}