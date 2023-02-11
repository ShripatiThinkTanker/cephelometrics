import { Component } from '@angular/core';
import { convertImageToBase64URL } from '../utils/utilityFunctions';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-edit-cephelometrics',
  templateUrl: './add-edit-cephelometrics.component.html',
  styleUrls: ['./add-edit-cephelometrics.component.scss']
})
export class AddEditCephelometricsComponent {
  files = [];

  constructor(public router : Router){


  }

  uploadFile(event:any){
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      const isLoaded = convertImageToBase64URL(fileList);
      
        console.log("Loaded the image")
        this.router.navigate(['cephelometrics/open']);
       
    }
  }


}
