import { provideServerRendering, withRoutes } from '@angular/ssr';
import { importProvidersFrom, mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { ServerTransferStateModule } from '@angular/platform-server';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    importProvidersFrom(ServerTransferStateModule)
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
