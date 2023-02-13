import { ObjectId } from 'bson';
import AngleModel from "../models/cephelometrics/angleSchema";
import cephMasterModel from "../models/cephelometrics/cephMasterSchema";
import LineModel from "../models/cephelometrics/linesSchema";
import pointModel from "../models/cephelometrics/pointsSchema";
const cephLogicHandler = {
    "listAllImages" : async () => {
        const all_xrays:Array<any> = await cephMasterModel.find().select('-__v'); 
        return all_xrays;
    },
    "uploadData": async (payload:any)=> {
       
        const newDataImageURl = payload.dataImage.replace(/['"]/g,'');
        const newPayload = {dataImage : newDataImageURl, xrayName: payload.xrayName}
        const res:any = await cephMasterModel.create(newPayload).then(result => {return result}).catch(err => console.log(err));
       
        return {"message" : "data inserted successfully", "data" : res._id}; 
    },
    "uploadCephData": async(payload:any) => {
        let pointData: any = {}
        let lineData: any = {}
        let angle_info: any  = {}
        pointData['masterObjectId'] = new ObjectId(payload.ceph_id);
        lineData['masterObjectId'] = new ObjectId(payload.ceph_id);
        angle_info['masterObjectId'] = new ObjectId(payload.ceph_id);

        pointData = payload.points;
        lineData = payload.lines;
        angle_info = payload.angle_info;

        pointData.forEach((element:any) => {
            element['masterObjectId'] = new ObjectId(payload.ceph_id) 
        });

        lineData.forEach((element:any) => {
            element['masterObjectId'] = new ObjectId(payload.ceph_id);
        })

        angle_info.forEach((element:any) => {
            element['masterObjectId'] = new ObjectId(payload.ceph_id);
        })

        await pointModel.create(pointData).then(result => {return result}).catch(err => console.log(err));
        await LineModel.create(lineData).then(result => {return result}).catch(err => console.log(err));
        await AngleModel.create(angle_info).then(result => {return result}).catch(err => console.log(err));
       
    },

    "getCephData" : async(id:string) => {
        const points:Array<any> = await pointModel.find({"masterObjectId": id}).select('-__v'); 
        const lines: Array<any> = await LineModel.find({"masterObjectId": id}).select('-__v');
        const angles : Array<any> = await AngleModel.find({"masterObjectId" : id}).select('-__v');
        const all_xrays:Array<any> = await cephMasterModel.find().select('-__v'); 
        const allObjects = {"points" : points, "lines" : lines, "angles" : angles, "xray_data" : all_xrays};
        return {"message" : "Data Sent Successfully", "data" : allObjects};
    }
} 

export default cephLogicHandler;

