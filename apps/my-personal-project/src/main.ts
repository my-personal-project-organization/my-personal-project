import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// ? https://blog.stackademic.com/boost-your-angular-app-performance-9f19141162fe
setTimeout(() => {
  bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
});
