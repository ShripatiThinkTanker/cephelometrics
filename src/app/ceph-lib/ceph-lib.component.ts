import { Component, OnInit } from '@angular/core';
import Panzoom from '@panzoom/panzoom';
import { IPoints } from '../interfaces/pointInterface';
import { angles } from '../utils/angles';
import {pointList, steinerPoints } from '../utils/steinerPoints';
import { calculateAngle, calculateIntersection, converDivToJPEG, convertDivToPDF } from '../utils/utilityFunctions';
import { Router,ActivatedRoute } from '@angular/router';
import { CephelometricsService } from '../services/cephelometrics.service';
import { globalSettings } from '../utils/globalSettings';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { distance } from '../utils/distance';
@Component({
  selector: 'app-ceph-lib',
  templateUrl: './ceph-lib.component.html',
  styleUrls: ['./ceph-lib.component.scss']
})
export class CephLibComponent {
  imageURL: string | null = "";
  
  instance : any;
  count:number = 0;
  pointName:string = "";
  options:Array<pointList> = []; 
  pointNameAlias:string = "";
  pointsArray:{[k: string] : IPoints} = {};
  steinerDistance = [distance['C1-C2'],distance['ANS-Me'], distance['ANS-N'], distance['Pog-Arb'], distance['Arb1-Arb2'], distance['apOcP-ppOcP'], distance['A!-B!']]
  strinerAngles = [
    angles['S-N^N-A'],
     angles['S-N^N-B'], 
     angles['N-B^N-A'], 
     angles['S-N^Me-Go'], 
     angles['S-N^Pog-N'], 
     angles['P-O^N-Pog'], 
     angles['P-O^Me-Go'], 
     angles['S-N^Gn-S'], 
     angles['P-O^N-A'], 
     angles['P-O^Gn-Go'], 
     angles['S-N^U1-Arb1'],
     angles['N-A^U1-Arb1'],
     angles['L1-Arb1^N-B'],
    angles['Me-Go^L1-Arb1'],
    angles['U1-Arb1^L1-Arb1']];
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
  div:any;
  element:any;
  pointAID:any;
  pointBID:any;
  ans_me_dist : number = 0;
  ans_n_dist : number = 0;

  panZoomOptions = {disablePan:true}
  calibrationMagnification = this.fb.group({
    magnificationFactor : ['',Validators.required]
  })

  constructor(public router:Router, public activatedRouter : ActivatedRoute, public cephService: CephelometricsService, public fb : FormBuilder, public toasterService: ToastrService){

  }

  ngOnInit(){
    
    this.instance = Panzoom(document.querySelector('.overlay') as HTMLElement);
    this.options = steinerPoints;
    this.element = document.querySelector('.card-body') as HTMLElement;
    this.div = document.querySelector('.overlay') as HTMLDivElement;
    this.cephService.getCephInnerData({id: atob(this.activatedRouter.snapshot.params['id'])}).subscribe((result:any) => {
      this.count = Object.keys(result.data.points).length;
     
      this.imageURL = result.data.xray_data[0].dataImage;
      this.tempLineArr = result.data.lines;
    
      this.lineArr = result.data.lines;
     
      result.data.points.forEach((element:any) => {
        this.tempPointArray[element.point_name_alias] = {
          pointName : element.poinName,
          x: element.x,
          y: element.y,
          point_name_alias : element.point_name_alias
        }

        this.pointsArray[element.point_name_alias] = {
          pointName : element.poinName,
          x: element.x,
          y: element.y,
          point_name_alias : element.point_name_alias
        }
      })

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
          top = Math.floor((y1 + y2) / 2 - 1 / 2);
          angle = Math.floor(Math.atan2(y1 - y2, x1 - x2) * (180 / Math.PI));
          x_left = Math.floor((x1 + x2) / 2 - 3000 / 2);
          x_top = Math.floor((y1 + y2) / 2 - 1 / 2);
          x_angle = Math.floor(Math.atan2(y1 - y2, x1 - x2) * (180 / Math.PI));
          
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

  findIndex(array:any, callback:(point:any) => boolean){
    for(let index = 0; index < array.length; index++){
      if(callback(array[index])){
        return index;
      }
    }
    return - 1;
  }

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
  calculateDistance(pointA:any, pointB:any){
    if(pointA !== undefined || pointB.x !== undefined){
      let x1 = pointA.x;
      let y1 = pointA.y;
      let x2 = pointB.x;
      let y2 = pointB.y;

      if(pointA.point_name_alias == "C1" && pointB.point_name_alias == "C2"){
        this.calibrationdistance = Math.floor(Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)));
        this.calibrationdistanceinmm = Math.floor(Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) * (0.2645833333));
    }
      if(pointA.point_name_alias == "ANS" && pointB.point_name_alias == "Me"){
        this.ans_me_dist = Math.floor(Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) * (0.2645833333) * this.calibrationDist);// LAFH
      }
      if(pointA.point_name_alias == "ANS" && pointB.point_name_alias == "N"){
        this.ans_n_dist = Math.floor(Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) * (0.2645833333) * this.calibrationDist);// UAFH
      }
      this.calibrationDist = parseInt(this.magnifier)/this.calibrationdistanceinmm 
      var distanceinmm = 0;
      if(pointA.point_name_alias == "ANS" && pointB.point_name_alias == "Me" || pointB.point_name_alias == "N"){  
        distanceinmm =  parseFloat((this.ans_n_dist/this.ans_me_dist).toPrecision(1))
      }else{
        distanceinmm = Math.floor(Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) * (0.2645833333) * this.calibrationDist);
      }
      return distanceinmm
    }
  }


  addPoint(event: MouseEvent){
    
    if(this.options[this.count - 1] != undefined){
      this.pointAID = this.options[this.count - 1].pointAlias
    }
    console.log(this.anglesArr)
    console.log(this.options[this.count])
    if(this.options[this.count] != undefined){
    this.options[this.count].isActive = false;
    this.pointName = this.options[this.count].pointName;
    this.pointNameAlias = this.options[this.count].pointAlias;
    this.count++;
    console.log(this.options[this.count - 2])
    console.log(this.pointAID)
    console.log(this.options.length)
    if(this.count == this.options.length){
      console.log(true)
      this.allPointsCompleted = true 
    }else{
      console.log(this.options.length,this.count)
      console.log(false)
    }
    
    if(this.options.length > this.count){
    this.previewImage = this.options[this.count].imagePath;
    }

    if(this.pointNameAlias == "Pog"){
      let pointBXCoord = this.pointsArray['B'].x
      this.pointsArray['Arb'] = {
        pointName : "",
        x: pointBXCoord,
        y : 620,
        point_name_alias : ''
      }
    }

    console.log(this.pointsArray)
    if(this.pointNameAlias == "U1"){
      this.pointsArray['Arb1'] = {
        pointName : "",
        x : event.offsetX + 30,
        y : event.offsetY + 70,
        point_name_alias : ''
      }

      this.pointsArray['Arb2'] = {
        pointName : "",
        x : this.pointsArray['Arb1'].x + 20,
        y : this.pointsArray['Arb1'].y,
        point_name_alias : ''
      }


    }
    console.log(event.offsetX, event.offsetY)
    if(event.offsetX < 10 && event.offsetY < 10) {
      console.log("condition true")
      return false
    }
    
    this.pointsArray[this.pointNameAlias] = {
      pointName: this.pointName,
      x: event.offsetX - 3,
      y:event.offsetY - 3,
      point_name_alias: this.pointNameAlias
    }
    console.log(this.pointsArray['apOcP'], this.pointsArray['ppOcP'])
    if(this.pointsArray['N'] != undefined && this.pointsArray['B'] != undefined && this.pointsArray['apOcP'] != undefined && this.pointsArray['ppOcP'] != undefined){
    console.log("inside the condition")
    let pointn : any = {"x" : this.pointsArray['N'].x, "y" : this.pointsArray['N'].y}
    let pointb : any = {"x" : this.pointsArray['B'].x, "y" : this.pointsArray['B'].y}
    let pointapOcP : any = {"x" : this.pointsArray['apOcP'].x, "y": this.pointsArray['apOcP'].y}
    let pointppOcP : any = {"x" : this.pointsArray['ppOcP'].x, "y" : this.pointsArray['ppOcP'].y}

    const newPoint = calculateIntersection(pointn,pointb,pointapOcP,pointppOcP);
    this.pointsArray['B!'] = {
      pointName : "B Compliment",
      x: newPoint.x,
      y : newPoint.y,
      point_name_alias : "B!"
    }
    }
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
        point_name_alias : "A!"
      }

    }
   
    this.lineArr = this.lines;
    this.anglesArr = this.anglesValues.concat(this.distanceValues);
  }
    
    return true
  }

  removePoint(index:number){
     this.options[index].isActive = true;
     this.allPointsCompleted = false 
     let newPoints = Object.keys(this.pointsArray)
    
     
      newPoints.forEach((element) => {
        this.lineArr.forEach((element1:any) => {  
          if(this.pointsArray[element] != undefined){ 
          if(this.pointsArray[element].point_name_alias == this.options[index].pointAlias){
            delete this.pointsArray[element]
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
    //this.instance.pan(100, 100);
    this.panZoomOptions.disablePan = false;

    
    return false;

  }

  submitPayload(){
   
    this.payload = {
      "ceph_id" : atob(this.activatedRouter.snapshot.params['id']),
      "points" : this.pointsArray,
      "lines" : this.lines,
      "angles" : this.anglesValues,
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
  prevent(event:MouseEvent) {
    event.preventDefault()
  }
  dontDrag(event:any){
    event.preventDefault()
  }

   exportToJPEG(){
    
     converDivToJPEG(this.element, "CephalometricAnalysis")
  }
   exportToPDF(){
    convertDivToPDF(this.element, "CephalometricAnalysis")
   }
}
