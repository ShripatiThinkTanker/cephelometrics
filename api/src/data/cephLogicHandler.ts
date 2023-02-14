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
       
        const newDataImageURl = payload.fileName.replace(/['"]/g,'');
        const newPayload = {dataImage : newDataImageURl, xrayName: payload.xrayName}
        const res:any = await cephMasterModel.create(newPayload).then(result => {return result}).catch(err => console.log(err));
        console.log(res)
        return {"message" : "data inserted successfully", "data" : res._id}; 
    },
    "uploadCephData": async(payload:any) => {
        let pointData: any = {}
        let lineData: any = {}
        let angle_info: any  = {}

        pointData = payload.points;
        lineData = payload.lines;
        angle_info = payload.angles;
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
            
        await LineModel.create(LineArr).then(result => {return result}).catch(err => console.log(err));
        await pointModel.create(newPointArr).then(result => {return result}).catch(err => console.log(err));
        await AngleModel.create(angle).then(result => {return result}).catch(err => console.log(err));
       
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

