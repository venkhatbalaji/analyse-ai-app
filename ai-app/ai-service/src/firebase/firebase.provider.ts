import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FIREBASE_PROVIDER } from './firebase.constants';
import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app';

export const FirebaseProvider: Provider<FirebaseApp> = {
  provide: FIREBASE_PROVIDER,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const firebaseConfig: FirebaseOptions = {
      apiKey: configService.get('FIREBASE_API_KEY'),
      authDomain: configService.get('FIREBASE_AUTH_DOMAIN'),
      projectId: configService.get('FIREBASE_PROJECT_ID'),
      storageBucket: configService.get('FIREBASE_STORAGE_BUCKET'),
      messagingSenderId: configService.get('FIREBASE_SENDER_ID'),
      appId: configService.get('FIREBASE_APP_ID'),
      measurementId: configService.get('FIREBASE_MEASUREMENT_ID'),
    };
    return initializeApp(firebaseConfig);
  },
};
