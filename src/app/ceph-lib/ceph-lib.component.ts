import { Component, OnInit } from '@angular/core';
import Panzoom from '@panzoom/panzoom';
import { IPoints } from '../interfaces/pointInterface';
import { angles } from '../utils/angles';
import {pointList, steinerPoints } from '../utils/steinerPoints';
import { calculateAngle, calculateIntersection, calculatePointToLine, calculateWitsAppraisal, converDivToJPEG, convertDivToPDF } from '../utils/utilityFunctions';
import { Router,ActivatedRoute } from '@angular/router';
import { CephelometricsService } from '../services/cephelometrics.service';
import { globalSettings } from '../utils/globalSettings';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { distance } from '../utils/distance';
import { MenuItem, MessageService } from 'primeng/api';
@Component({
  selector: 'app-ceph-lib',
  templateUrl: './ceph-lib.component.html',
  styleUrls: ['./ceph-lib.component.scss']
})
export class CephLibComponent {
  imageURL: string | null = "";
  items: MenuItem[];

  instance : any;
  showImageSettingsPanel = false;
  contrastSetting:number = 100;
  brightnessSetting:number = 100
  invertSetting:number = 0;
  count:number = 0;
  pointName:string = "";
  options:Array<pointList> = []; 
  pointNameAlias:string = "";
  pointsArray:{[k: string] : IPoints} = {};
  steinerDistance = [distance['C1-C2'],distance['ANS-Me'], distance['ANS-N'], distance['Pog-NB'], distance['apOcP-ppOcP'], distance['UIe-Arb'], distance['LIe-Arb']]
  strinerAngles = [angles['S-N^N-A'],angles['S-N^N-B'], angles['N-B^N-A'], angles['S-N^Me-Go'], angles['P-O^N-Pog'], angles['P-O^Me-Go'], angles['S-N^Gn-S'], angles['P-O^N-A'], angles['P-O^Gn-S'], angles['S-N^UIe-UIa'],angles['UIe-UIa^N-A'],angles['LIe-LIa^N-B'],angles['Me-Go^LIe-LIa'],angles['UIe-UIa^LIe-LIa']];
  width:string|null = "";
  height:string|null = "";
  previewImage:string = "";
  payload: {} = {};
  lineArr:any = [];
  anglesArr:any = [];
  calibrationDist:number = 0
  calibrationx1:number = 0;
  calibrationx2:number = 0;
  calibrationy1:number = 0;
  calibrationy2:number = 0;
  calibrationdistance : number = 0;
  calibrationdistanceinmm: number = 0;
  tempPointArray:{[k:string] : IPoints} = {};
  tempLineArr : Array<any> =  [];
  tempanglesArr : Array<any> = [];
  allPointsCompleted:boolean = false
  magnifier:any;
  div:any
  ImageElement:any;
  TableElement:any;

  pointAID:any;
  pointBID:any;
  ans_me_dist : number = 0;
  ans_n_dist : number = 0;
  tempCount:number = 0;
  isPointRemoved:boolean = false;
  panZoomOptions = {disablePan:true}
  index:number = 0
  calibrationMagnification = this.fb.group({
    magnificationFactor : ['',Validators.required]
  })

  imageSettings = this.fb.group({
    contrastSlider : [0],
    brightnessSlider : [0],
    invertSlider : [0]
  })

  constructor(public router:Router, public activatedRouter : ActivatedRoute, public cephService: CephelometricsService, public fb : FormBuilder, public toasterService: ToastrService ){
    this.items = [
      {
          label: 'Export To JPEG',
          icon: 'pi pi-fw pi-file',
          command : ()=>{
            this.exportToJPEG()
          }
      },

      {
        label: 'Export To PDF',
        icon: 'pi pi-fw pi-file',
        command : ()=>{
          this.exportToPDF()
        }
    },
     
      {
          separator: true
      },
  ];
  }
  // This function loads up when the component is initialized.
  ngOnInit(){
    
    this.instance = Panzoom(document.querySelector('.container') as HTMLElement);
    this.options = steinerPoints;
   
    this.TableElement = document.querySelector('.data-table')
    this.div = document.querySelector('.container') as HTMLDivElement;
    this.cephService.getCephInnerData({id: atob(this.activatedRouter.snapshot.params['id'])}).subscribe((result:any) => {
      
      this.imageURL = result.data.xray_data[0].dataImage;
      this.tempLineArr = result.data.lines;
      this.lineArr = result.data.lines;
      
      result.data.points.forEach((element:any) => {
        this.tempPointArray[element.point_name_alias] = {
          pointName : element.poinName,
          x: element.x,
          y: element.y,
          point_name_alias : element.point_name_alias,
          isAdded : true
        }
        
        this.pointsArray[element.point_name_alias] = {
          pointName : element.poinName,
          x: element.x,
          y: element.y,
          point_name_alias : element.point_name_alias,
          isAdded : true,
        }
      })
      this.count = Object.keys(this.pointsArray).length;
      console.log(this.count)
      if(this.count == this.options.length){
        console.log(true)
        this.allPointsCompleted = true 
      }
      result.data.points.forEach((element:any) => {
        this.options.forEach((element1:any) => {
          if(element.point_name_alias == element1.pointAlias){
            element1.isActive = false
          }
        })
      })
      this.tempanglesArr = result.data.angles
      this.anglesArr = result.data.angles
      if(result.data.xray_data[0].magnificationCalibration){

        this.calibrationMagnification.patchValue({"magnificationFactor" : result.data.xray_data[0].magnificationCalibration.toString()})
      }else{
        this.calibrationMagnification.patchValue({"magnificationFactor" : globalSettings.calibrationDistanceInmm.toString()})
      }
    })
    
   
  }
  // This Getter derives the line to be drawn between two points based on the relationship defined in the angle.ts and distance.ts file
  get lines() {
    return (
      this.strinerAngles.map((angle) => angle).reduce((arr: string[], angleID) => {
        angleID.id.split('^').forEach((x) => (arr.indexOf(x) === -1 ? arr.push(x) : ''));
        return arr;
      }, []))
      .concat(this.steinerDistance.length ? [ '0mm-10mm' ] : [])
      .concat(this.steinerDistance.map((x) => x.id)).map((id) => {
        const pointAID = id.split('-')[0];
        const pointBID = id.split('-')[1];
        
        const pointACoordinates = this.pointsArray[pointAID];
        const pointBCoordinates = this.pointsArray[pointBID];
        var x1,x2,y1,y2,distance,left,top,angle,x_left,x_top,x_angle,distanceinmm,typeOfMeasurement,calibrationDist:any;
       
        this.magnifier = this.calibrationMagnification.value.magnificationFactor; 
        if(pointACoordinates != undefined && pointBCoordinates != undefined){
          this.calibrationDist = parseInt(this.magnifier)/this.calibrationdistanceinmm 
           x1 = pointACoordinates.x;
					 x2 = pointBCoordinates.x;
					 y1 = pointACoordinates.y;
					 y2 = pointBCoordinates.y;


           if(this.pointAID == "C1" && this.pointBID == "C2"){
              this.calibrationdistance = Math.floor(Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)));
              this.calibrationdistanceinmm = Math.floor(Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) * (0.2645833333));
            }

          distance = Math.floor(Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)));
          distanceinmm = Math.floor(Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) * (0.2645833333) * this.calibrationDist);
          // console.log(distanceinmm * this.calibrationDist)
          left = Math.floor((x1 + x2) / 2 - distance / 2);
          top = Math.floor((y1 + y2) / 2 - distance / 2);
          angle = Math.atan2(y1 - y2, x1 - x2) * (180 / Math.PI);

          if(id == "Me-Go" || id == "Gn-S" || id == "Pog-Arb"){
            x_left = Math.floor((x1 + x2) / 2 - 3000 / 2)  + 2
            x_top = Math.floor((y1 + y2) / 2 - 1 / 2) + 2;
          }
          else{
            x_left = Math.floor((x1 + x2) / 2 - 3000 / 2)  + 3;
            x_top = Math.floor((y1 + y2) / 2 - 1 / 2)  + 4;
          }
          x_angle = Math.atan2(y1 - y2, x1 - x2) * (180 / Math.PI);
          console.log(id)
        }
      return {
        distance,
        distanceinmm,
        left,
        top,
        angle,
        x1,
        y1,
        x2,
        y2,
        id,
        x: { x_left, x_top, x_angle, x_distance: 3000 }
      };
      })
  }
  selectedIndex(index:number){
      this.index = index
      if(this.options[this.index + 1] != undefined){
        this.previewImage = this.options[this.index].imagePath;
      }
  }
  findIndex(array:any, callback:(point:any) => boolean){
    for(let index = 0; index < array.length; index++){
      if(callback(array[index])){
        return index;
      }
    }
    return - 1;
  }
  // A getter to get the angle values
  // This Getter has been used to derive values out of the Constant list in the angles.ts file
  get anglesValues() {
		return this.strinerAngles.map((angle) => {
      var lineAID:string,lineBID:string;
         lineAID = angle.id.split('^')[0];
         lineBID = angle.id.split('^')[1];

        const lineAIndex = this.findIndex(this.lines, (line:any) => line.id === lineAID);
        const lineBIndex = this.findIndex(this.lines, (line:any) => line.id === lineBID);
  
        const lineA:any = this.lines[lineAIndex];
        const lineB:any = this.lines[lineBIndex];

        //let top =  lineA.top + 20
        const angleValue = lineA && lineB ? calculateAngle(lineA, lineB, angle.invert, angle.abs) : 'NA';
  
        const max = angle.mean + angle.deviation;
        const min = angle.mean - angle.deviation;
        var top  = this.pointsArray[this.pointAID].y
        var left = this.pointsArray[this.pointAID].x
			return {
				id: angle.id,
        name : angle.name,
				description: angle.description,
				mean: angle.mean,
				deviation: angle.deviation,
        typeOfMeasurement : angle.typeOfMeasurement,
				value: angleValue,
				interpretation:
					angleValue === 'NA' || angleValue === undefined
						? ''
						: angleValue > max ? angle.inc : angleValue < min ? angle.dec : angle.norm
			};
		});
	}

  // Another getter which dreives the distance between two points
  get distanceValues(){
    return this.steinerDistance.map((distance) => {
      const pointAID = distance.id.split('-')[0];
      const pointBID = distance.id.split('-')[1];
      const pointA = this.pointsArray[pointAID];
      const pointB = this.pointsArray[pointBID];
      var distanceValue;
      if(pointA != undefined && pointB != undefined){
        distanceValue = this.calculateDistance(pointA,pointB);
      }
			const max = distance.mean + distance.deviation;
			const min = distance.mean - distance.deviation;
      console.log(distanceValue)
      if(distance.name == "LAFH"){
        console.log("Nothing");
        return {
          id: "",
          name : "",
          description : "",
          mean : 0,
          deviation : 0,
          value : 0,
          interpretation  :"",typeOfMeasurement: ''
        }
      }
      let distanceObj = calculatePointToLine(this.pointsArray)
      console.log(distanceObj)
      let witsAppraisal = calculateWitsAppraisal(this.pointsArray)
     if(distance.name == "Pg-NB" && distanceObj!["Pg-NB"] != undefined|| distance.name == "U1-NA(Linear)" && distanceObj!["U1-NA(Linear)"] != undefined || distance.name == "L1-NB(Linear)" && distanceObj!["L1-NB(Linear)"] != undefined){
      return {
        id : distance.id,
        name : distance.name,
        description: distance.description,
        mean: distance.mean,
        deviation: distance.deviation,
        value: distanceObj[distance.name].final_measurement,
        typeOfMeasurement : distance.typeOfMeasurement,
        interpretation:
          distanceValue === undefined
            ? ''
            : distanceValue > max ? distance.inc : distanceValue < min ? distance.dec : distance.norm
      }
     }

     if(distance.name == "apOcP-ppOcP" && witsAppraisal!= undefined){
      return {
        id : distance.id,
        name : distance.name,
        description: distance.description,
        mean: distance.mean,
        deviation: distance.deviation,
        value: Math.floor(witsAppraisal[distance.name].final_measurement * this.calibrationDist),
        typeOfMeasurement : distance.typeOfMeasurement,
        interpretation:
          distanceValue === undefined
            ? ''
            : distanceValue > max ? distance.inc : distanceValue < min ? distance.dec : distance.norm
      }
     }
    return {
      id: distance.id,
      name : distance.name,
      description: distance.description,
      mean: distance.mean,
      deviation: distance.deviation,
      value: distanceValue,
      typeOfMeasurement : distance.typeOfMeasurement,
      interpretation:
        distanceValue === undefined
          ? ''
          : distanceValue > max ? distance.inc : distanceValue < min ? distance.dec : distance.norm
    };
    })
  }
  calculateDistance(pointA:IPoints, pointB:IPoints){
    if(pointA !== undefined || pointB.x !== undefined){
      let x1 = pointA.x;
      let y1 = pointA.y;
      let x2 = pointB.x;
      let y2 = pointB.y;
      // Need to handle specific cases as these cases are not handled by the user but the system itself
      if(pointA.point_name_alias == "C1" && pointB.point_name_alias == "C2"){
        this.calibrationdistance = Math.floor(Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)));
        this.calibrationdistanceinmm = Math.floor(Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) * (0.2645833333));
    }
    // this block is used to derive the UAFH and LAFH Ratio. 

    // Calculate LAFH
      if(pointA.point_name_alias == "ANS" && pointB.point_name_alias == "Me"){
        this.ans_me_dist = Math.floor(Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) * (0.2645833333) * this.calibrationDist);// LAFH
      }
    // Calculate UAFH
      if(pointA.point_name_alias == "ANS" && pointB.point_name_alias == "N"){
        this.ans_n_dist = Math.floor(Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) * (0.2645833333) * this.calibrationDist);// UAFH
      }
      // This is to calculate the Magnification factor. 
      this.calibrationDist = parseInt(this.magnifier)/this.calibrationdistanceinmm 
      var distanceinmm = 0;

      // Get the ratio
      if(pointA.point_name_alias == "ANS" && pointB.point_name_alias == "Me" || pointB.point_name_alias == "N"){  
        distanceinmm =  parseFloat((this.ans_n_dist/this.ans_me_dist).toPrecision(1))
      }
      // end of block
      
      else{
        // Calculate the distance as it is. 
        distanceinmm = Math.floor(Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) * (0.2645833333) * this.calibrationDist);
      }
      return distanceinmm
    }
  }
  //This is the Old implementation where the point was added only when the xray div was clicked 
  addPoint(event: MouseEvent){
    this.pointAID = this.options[this.index].pointAlias
    this.options[this.index].isActive = false;
    this.pointName = this.options[this.index].pointName;
    this.pointNameAlias = this.options[this.index].pointAlias;
    this.count++;
    console.log(this.count)
    if(this.count == this.options.length){
      console.log(true)
      this.allPointsCompleted = true 
    }
   
    console.log(event.clientX, event.clientY)
    

    this.pointsArray[this.pointNameAlias] = {
      pointName: this.pointName,
      x: event.offsetX + 8,
      y: event.offsetY - 5,
      point_name_alias: this.pointNameAlias,
      isAdded: true
    }
    // check Specific Cases
    // this.checkSpecificCases(event);
    this.lineArr = this.lines;
    this.anglesArr = this.anglesValues.concat(this.distanceValues);
    console.log(this.anglesArr)
    
    return true
  }
  checkSpecificCases(event:any){
  

  console.log(this.pointsArray)
   // Checking for the intersection of the points. 
    // This is for the measurement of Wit's Appraisal
    // Initialize the intersection only if the blow listed points in the condition exist
    if(this.pointsArray['N'] != undefined && this.pointsArray['B'] != undefined && this.pointsArray['apOcP'] != undefined && this.pointsArray['ppOcP'] != undefined){
      let pointn : any = {"x" : this.pointsArray['N'].x, "y" : this.pointsArray['N'].y}
      let pointb : any = {"x" : this.pointsArray['B'].x, "y" : this.pointsArray['B'].y}
      let pointapOcP : any = {"x" : this.pointsArray['apOcP'].x, "y": this.pointsArray['apOcP'].y}
      let pointppOcP : any = {"x" : this.pointsArray['ppOcP'].x, "y" : this.pointsArray['ppOcP'].y}
  
      const newPoint = calculateIntersection(pointn,pointb,pointapOcP,pointppOcP);
      this.pointsArray['B!'] = {
        pointName : "B Compliment",
        x: newPoint.x,
        y : newPoint.y,
        point_name_alias : "B!",
        isAdded : true,
      }
      }
      // End of B! 
  
      if(this.pointsArray['N'] != undefined && this.pointsArray['A'] != undefined && this.pointsArray['apOcP'] != undefined && this.pointsArray['ppOcP'] != undefined){
        let pointn : any = {"x" : this.pointsArray['N'].x, "y" : this.pointsArray['N'].y}
        let pointa : any = {"x" : this.pointsArray['B'].x, "y" : this.pointsArray['B'].y}
        let pointapOcP : any = {"x" : this.pointsArray['apOcP'].x, "y": this.pointsArray['apOcP'].y}
        let pointppOcP : any = {"x" : this.pointsArray['ppOcP'].x, "y" : this.pointsArray['ppOcP'].y}
  
        const newPoint = calculateIntersection(pointn,pointa,pointapOcP,pointppOcP);
  
        this.pointsArray['A!'] = {
          pointName : "A Compliment",
          x : newPoint.x + 5,
          y : newPoint.y + 5,
          point_name_alias : "A!",
          isAdded : true
        }
  
      }
  } 
  removePoint(index:number){
    this.isPointRemoved = true
    //this.tempCount = this.count;
     this.options[index].isActive = true;
     this.allPointsCompleted = false 
     let newPoints = Object.keys(this.pointsArray)
      newPoints.forEach((element) => {
        this.lineArr.forEach((element1:any) => {  
          if(this.pointsArray[element] != undefined){ 
            this.pointsArray[element].isAdded = false
          if(this.pointsArray[element].point_name_alias == this.options[index].pointAlias){
            delete this.pointsArray[element]
            // this.count = index
          }
          let id = element1.id.split('-');
          if(id[0] == this.options[index].pointAlias || id[1] == this.options[index].pointAlias){
              const index = this.lineArr.indexOf(element1);

              this.lineArr.splice(index,1);
          }
        }
        });
      })
      this.count--;
  }
  zoomIn() {
      this.instance.zoomIn();
  }
  analysisChange(event:any){
    const options:any = {
      steinerAnalysis : steinerPoints,
    }
    this.options = options[event.target.value]
  }
  zoomOut() {
      this.instance.zoomOut();
  }
  reset() {
    this.instance.reset();
  }  
  disableContextMenu(){
    this.panZoomOptions.disablePan = false;
    return false;
  }
  submitPayload(){
    this.payload = {
      "ceph_id" : atob(this.activatedRouter.snapshot.params['id']),
      "points" : this.pointsArray,
      "lines" : this.lines,
      "angles" : this.anglesArr,
      "magnificationCalibration" : this.magnifier
    }
    this.cephService.uploadCephData(this.payload).subscribe((result)=> {
      this.toasterService.success("data uploaded successfully","Data Submitted")
      this.ngOnInit()
    })
  }

  goBackToMainPage(){
    if(this.tempLineArr.length < this.lineArr.length || this.tempanglesArr.length < this.anglesArr.length || Object.keys(this.tempPointArray).length < Object.keys(this.tempPointArray).length){
      if(confirm("Are you sure you want to quit without saving changes")){
        this.router.navigate(["cephelometrics"])
      }
    }else{
      this.router.navigate(["cephelometrics"])
    }
  }
   exportToJPEG(){
    this.ImageElement = document.querySelector('.containmentDiv') as HTMLElement;
    console.log(this.ImageElement)
    converDivToJPEG(this.ImageElement, "CephalometricAnalysis")
  }
   exportToPDF(){
    convertDivToPDF(this.ImageElement,this.TableElement,"CephalometricAnalysis")
   }

   showImageSettings(){
    this.showImageSettingsPanel = true
   }
   changeImageSettings(settingType : string, event:any){
    if(settingType == "Contrast"){
      this.contrastSetting = event.target.value
    }
    if(settingType == "Brightness"){
      this.brightnessSetting = event.target.value
    }
    if(settingType == "Invert"){
      this.invertSetting = event.target.value
    }

   }
   resetAllPoints(){
    this.lineArr = [];
    this.pointsArray = {};
    this.options.forEach(element => {
      element.isActive = true
    })
    this.count = 0
    this.allPointsCompleted = false
    this.anglesArr = []
   }
   resetAllSettings(){
    this.brightnessSetting = 100;
    this.contrastSetting = 100;
    this.invertSetting = 0
    this.imageSettings.patchValue({brightnessSlider : this.brightnessSetting, contrastSlider:this.contrastSetting, invertSlider : this.invertSetting})
   }

   
}
