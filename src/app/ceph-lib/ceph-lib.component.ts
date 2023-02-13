import { Component, OnInit } from '@angular/core';
import Panzoom from '@panzoom/panzoom';
import { IPoints } from '../interfaces/pointInterface';
import { angles } from '../utils/angles';
import { pointList, steinerPoints } from '../utils/steinerPoints';
import { calculateAngle } from '../utils/utilityFunctions';
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
  strinerAngles = [angles['C1-C2^C2-C1'],angles['S-N^N-A'], angles['S-N^N-B'], angles['N-B^N-A'], angles['S-N^Me-Go'], angles['S-N^Pog-N']];
  width:string|null = "";
  height:string|null = "";
  previewImage:string = "";
  ngOnInit(){
    this.imageURL = localStorage.getItem("imageData");
    this.instance = Panzoom(document.getElementById('divBG') as HTMLElement);
    this.options = steinerPoints;
    
    this.width = localStorage.getItem("width");
    console.log(this.strinerAngles)
    this.height = localStorage.getItem("height");
  }
  get lines() {
    return (
			this.strinerAngles.map((angle) => angle.id).reduce((arr: string[], angleID) => {
        angleID.split('^').forEach((x) => (arr.indexOf(x) === -1 ? arr.push(x) : ''));
        return arr;
      }, [])).map((id) => {
        const pointAID:string = id.split('-')[0];
        const pointBID = id.split('-')[1];
        
        const pointACoordinates = this.pointsArray[pointAID];
        const pointBCoordinates = this.pointsArray[pointBID];
        var x1,x2,y1,y2,distance,left,top,angle,x_left,x_top,x_angle,distanceinPx;
       
        if(pointACoordinates != undefined && pointBCoordinates != undefined){
           x1 = pointACoordinates.x;
					 x2 = pointBCoordinates.x;
					 y1 = pointACoordinates.y;
					 y2 = pointBCoordinates.y;
          distance = Math.floor(Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)));
          //distanceinPx = Math.floor(Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)));
          left = Math.floor((x1 + x2) / 2 - distance / 2)  +5 ;
          top = Math.floor((y1 + y2) / 2 - 1 / 2) + 5;
          angle = Math.floor(Math.atan2(y1 - y2, x1 - x2) * (180 / Math.PI));
 
          x_left = Math.floor((x1 + x2) / 2 - 3000 / 2);
          x_top = Math.floor((y1 + y2) / 2 - 1 / 2);
          x_angle = Math.floor(Math.atan2(y1 - y2, x1 - x2) * (180 / Math.PI));
        }
      return {
        distance ,
        distanceinPx,
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
			const lineAID = angle.id.split('^')[0];
			const lineBID = angle.id.split('^')[1];

			const lineAIndex = this.findIndex(this.lines, (line:any) => line.id === lineAID);
			const lineBIndex = this.findIndex(this.lines, (line:any) => line.id === lineBID);

			const lineA:any = this.lines[lineAIndex];
			const lineB:any = this.lines[lineBIndex];

      //let top =  lineA.top + 20
			const angleValue = lineA && lineB ? calculateAngle(lineA, lineB) : 'NA';

			const max = angle.mean + angle.deviation;
			const min = angle.mean - angle.deviation;

			return {
				id: angle.id,
        name : angle.name,
				description: angle.description,
				mean: angle.mean,
        top: lineA.top,
        left: lineB.left + 20,
				deviation: angle.deviation,
				value: angleValue,
				interpretation:
					angleValue === 'NA' || angleValue === undefined
						? ''
						: angleValue > max ? angle.inc : angleValue < min ? angle.dec : angle.norm
			};
		});
	}

  addPoint(event: MouseEvent){
    
    this.options[this.count].isActive = false;
    this.pointName = this.options[this.count].pointName;
    this.pointNameAlias = this.options[this.count].pointAlias;
    this.previewImage = this.options[this.count + 1].imagePath
    this.pointsArray[this.pointNameAlias] = {
      pointName: this.pointName,
      x:event.offsetX,
      y:event.offsetY,
      point_name_alias: this.pointNameAlias
    }
    this.lines.forEach((element) => {
     
      if(element.distance === undefined){
        const index = this.lines.indexOf(element);
        this.lines.splice(index, 1);
      }
    })
    console.log(this.lines)
    console.log(this.anglesValues);
    this.count++;
  }

  removePoint(index:number){
     this.options[index].isActive = true;
    //  this.pointsArray.forEach((element) => {

    //   if(element.pointName == this.options[index].pointName){
    //     const index = this.pointsArray.indexOf(element);
    //     this.pointsArray.splice(index,1);
    //   }
    //  })
     this.count--;

  }

zoomIn() {
    this.instance.zoomIn();
}

zoomOut() {
    this.instance.zoomOut();
}

reset() {
  this.instance.reset();
}  

disableContextMenu(){
  //this.instance.pan(100, 100);
  console.log(this.instance)
  return false;

}

}
