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
import { CephListComponent } from './ceph-list/ceph-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
@NgModule({
  declarations: [
    AppComponent,
    AddEditCephelometricsComponent,
    CephelometricsComponent,
    CephLibComponent,
    CephListComponent
  ],
  imports: [
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxPanZoomModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
