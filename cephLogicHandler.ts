import { ObjectId } from 'bson';
import AngleModel from '../models/cephelometrics/angleSchema';

import cephMasterModel from "../models/cephelometrics/cephMasterSchema";
import LineModel from "../models/cephelometrics/linesSchema";
import pointModel from "../models/cephelometrics/pointsSchema";
const cephLogicHandler = {
    "listAllImages" : async () => {
        const all_xrays:Array<any> = await cephMasterModel.find().select('-__v'); 
        return all_xrays;
    },
    "uploadData": async (payload:any)=> {
       
        const newDataImageURl = payload.dataURl.replace(/['"]/g,'');
        const newPayload = {dataImage : newDataImageURl, xrayName: payload.fileName}
        const res:any = await cephMasterModel.create(newPayload).then(result => {return result}).catch(err => console.log(err));
        return {"message" : "data inserted successfully", "data" : res._id}; 
    },
    "uploadCephData": async(payload:any) => {
        let pointData: any = {}
        let lineData: any = {}
        let angle_info: any  = {}
        let magnificationCalibration: number

        pointData = payload.points;
        lineData = payload.lines;
        angle_info = payload.angles;
        magnificationCalibration = payload.magnificationCalibration;
        // Object.keys(pointData).forEach((element:any) => {
        //     console.log(element)
        //     // element[element]['masterObjectId'] = new ObjectId(payload.ceph_id) 
        // });
        var newPointArr = [];
        for(const point in pointData){
            pointData[point]['masterObjectId'] = new ObjectId(payload.ceph_id) 
            newPointArr.push(pointData[point])
        }
        var LineArr:any = [];
        lineData.forEach((element:any) => {
            if(element.hasOwnProperty('distance')){
                element['masterObjectId'] = new ObjectId(payload.ceph_id);
                LineArr.push(element);
            }
            })
            var angle:any = [];
            angle_info.forEach((element:any) => {
                if(element.interpretation != ""){
                    element['masterObjectId'] = new ObjectId(payload.ceph_id);
                    angle.push(element)
                }
            })
        const lineResult = await LineModel.find({"masterObjectId" : new ObjectId(payload.ceph_id)}).select('-__v');
        const pointResult = await pointModel.find({"masterObjectId" : new ObjectId(payload.ceph_id)}).select('-__v');
        const angleResult = await AngleModel.find({"masterObjectId" : new ObjectId(payload.ceph_id)}).select('-__v');

        if(lineResult.length > 0){
            await LineModel.deleteMany({"masterObjectId": new ObjectId(payload.ceph_id)})
        }
        if(pointResult.length > 0){
            await pointModel.deleteMany({"masterObjectId": new ObjectId(payload.ceph_id)})
        }
        if(angleResult.length > 0){
            await AngleModel.deleteMany({"masterObjectId" : new ObjectId(payload.ceph_id)})
        }
        await LineModel.create(LineArr).then(result => {return result}).catch(err => console.log(err));
        await pointModel.create(newPointArr).then(result => {return result}).catch(err => console.log(err));
        await AngleModel.create(angle).then(result => {return result}).catch(err => console.log(err));
        await cephMasterModel.updateOne({_id : new ObjectId(payload.ceph_id)}, {$set:{magnificationCalibration: magnificationCalibration}})
       
    },

    "getCephData" : async(id:string) => {
        const points:Array<any> = await pointModel.find({"masterObjectId": id}).select('-__v'); 
        const lines: Array<any> = await LineModel.find({"masterObjectId": id}).select('-__v');
        const angles : Array<any> = await AngleModel.find({"masterObjectId" : id}).select('-__v');
        const all_xrays:Array<any> = await cephMasterModel.find({"_id" : id}).select('-__v'); 
        const allObjects = {"points" : points, "lines" : lines,"angles" : angles, "xray_data" : all_xrays};
        return {"message" : "Data Sent Successfully", "data" : allObjects};
    },
    // "updateCephData" : async(id : string) => {
    //     if()
    // }
} 

export default cephLogicHandler;

