import { ServerRoute, RenderMode } from '@angular/ssr';

const languages = ['en', 'ru'];

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