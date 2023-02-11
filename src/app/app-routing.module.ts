import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditCephelometricsComponent } from './add-edit-cephelometrics/add-edit-cephelometrics.component';
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
    }



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
