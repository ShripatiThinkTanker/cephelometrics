import { Component,OnInit } from '@angular/core';
import { convertImageToBase64URL } from '../utils/utilityFunctions';
import { Router } from '@angular/router';
import { FormArray,FormGroup,FormBuilder, Validators } from '@angular/forms';
import { CephelometricsService } from '../services/cephelometrics.service';
@Component({
  selector: 'app-add-edit-cephelometrics',
  templateUrl: './add-edit-cephelometrics.component.html',
  styleUrls: ['./add-edit-cephelometrics.component.scss']
})
export class AddEditCephelometricsComponent {
  files = [];
  payload = {};
  appDataForm = this.fb.group({
    fileName : ['', Validators.required]
  })
  constructor(public router : Router, public fb : FormBuilder, public cephService : CephelometricsService){


  }
 
  uploadFile(event:any){
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
        convertImageToBase64URL(fileList);
        console.log("Loaded the image")
    }
  }

  submitPayload(){
      this.payload = {
        fileName: this.appDataForm.value.fileName,
        dataURl : localStorage.getItem("imageData"),
      }

      this.cephService.uploadXRayData(this.payload).subscribe((result:any) => {
        console.log("Result _id" + JSON.stringify(result));
        this.router.navigate(['cephelometrics/open/',btoa(result.data)])
      })
  }


}
