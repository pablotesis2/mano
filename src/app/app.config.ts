import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getDatabase, provideDatabase } from '@angular/fire/database';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "kguasdf", appId: "1:407275691789:web:8c9ffdfea47030836f5a44", databaseURL: "https://kguasdf-default-rtdb.firebaseio.com", storageBucket: "kguasdf.firebasestorage.app", apiKey: "AIzaSyDXyTPLTRsOUqDMd-65FUAdqGgq5seOVvY", authDomain: "kguasdf.firebaseapp.com", messagingSenderId: "407275691789" })), provideDatabase(() => getDatabase())]
};
