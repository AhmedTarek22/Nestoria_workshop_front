/// <reference types="@angular/localize" />
import { provideHttpClient } from '@angular/common/http';

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
//appConfig دول حطتهم فى ملف 
// import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
/* bootstrapApplication(AppComponent, {
  providers: [provideCharts(withDefaultRegisterables())],
}).catch((err) => console.error(err)); */
bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
