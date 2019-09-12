import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './signin/signin.component';

import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, en_US, NzButtonModule, NzSelectModule  } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import {RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RequestComponent } from './request/request.component';
import { NewsComponent } from './news/news.component';
import { RouteComponent } from './route/route.component';
import { AuthGuard } from './service/alwaysAuthGuard/auth-guard';
import { StorageServiceModule} from 'angular-webstorage-service';
import { AngularWebStorageModule } from 'angular-web-storage';
import { ParticlesModule } from 'angular-particle';
registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    HomeComponent,
    RequestComponent,
    NewsComponent,
    RouteComponent
  ],
  imports: [
    BrowserModule,
    AngularWebStorageModule,
    AppRoutingModule,
    NgZorroAntdModule,
    NzButtonModule,
    NzSelectModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StorageServiceModule,
    ParticlesModule,
    RouterModule.forRoot([
      {path:'',component: SigninComponent},
      {path:'signin',component: SigninComponent},
      {path:'home',component: HomeComponent,canActivate: [AuthGuard]},
      {path:'request',component: RequestComponent,canActivate: [AuthGuard]},
      {path:'news',component: NewsComponent,canActivate: [AuthGuard]},
      
    ])
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US },AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
