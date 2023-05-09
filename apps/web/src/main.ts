import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localeRu from '@angular/common/locales/ru';
import { LOCALE_ID, importProvidersFrom, isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TuiRootModule } from '@taiga-ui/core';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { errorInterceptor } from './app/core/interceptors/error.interceptor';
import { appEffects } from './app/core/store/effects';
import { appReducers } from './app/core/store/reducers';

registerLocaleData(localeRu, 'ru');

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(APP_ROUTES),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    importProvidersFrom([
      BrowserAnimationsModule,
      TuiRootModule,
      StoreModule.forRoot(appReducers),
      EffectsModule.forRoot(appEffects),
      StoreDevtoolsModule.instrument({
        maxAge: 25,
        logOnly: !isDevMode(),
        autoPause: true,
        trace: false,
        traceLimit: 75
      })
    ]),
    { provide: LOCALE_ID, useValue: 'ru-RU' }
  ]
});
