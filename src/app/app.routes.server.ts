import { ServerRoute, RenderMode } from '@angular/ssr';

const languages = ['es', 'vl', 'en', 'ru', 'ua'];

export const serverRoutes: ServerRoute[] = [
  {
    path: ':lang',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () => {
      return Promise.resolve(
        languages.map(lang => ({ lang }))
      );
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];