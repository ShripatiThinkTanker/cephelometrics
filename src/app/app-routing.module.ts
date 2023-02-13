import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditCephelometricsComponent } from './add-edit-cephelometrics/add-edit-cephelometrics.component';
import { CephListComponent } from './ceph-list/ceph-list.component';
import { CephelometricsComponent } from './cephelometrics/cephelometrics.component';

const routes: Routes = [
    {
      path : "cephelometrics/addNew",
      component : AddEditCephelometricsComponent,
      data: {title : "Cephelometrics Add page"}
    },
    {
      path : "cephelometrics/open",
      component : CephelometricsComponent,
      data : {title: "Cephelometrics Open"}
    },
    {
      path : "cephelometrics",
      component : CephListComponent,
      data : {title : "Cephelometrics List"}
    },
    {
      path : "cephelometrics/open/:id",
      component : CephelometricsComponent,
      data : {title : "Cephelometrics open With ID"}
    }



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
