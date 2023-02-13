import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddEditCephelometricsComponent } from './add-edit-cephelometrics/add-edit-cephelometrics.component';
import { CephelometricsComponent } from './cephelometrics/cephelometrics.component';
import { CephLibComponent } from './ceph-lib/ceph-lib.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { NgxPanZoomModule } from 'ngx-panzoom';
@NgModule({
  declarations: [
    AppComponent,
    AddEditCephelometricsComponent,
    CephelometricsComponent,
    CephLibComponent
  ],
  imports: [
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxPanZoomModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
