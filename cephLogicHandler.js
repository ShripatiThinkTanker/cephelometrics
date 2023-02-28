"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bson_1 = require("bson");
const angleSchema_1 = __importDefault(require("../models/cephelometrics/angleSchema"));
const cephMasterSchema_1 = __importDefault(require("../models/cephelometrics/cephMasterSchema"));
const linesSchema_1 = __importDefault(require("../models/cephelometrics/linesSchema"));
const pointsSchema_1 = __importDefault(require("../models/cephelometrics/pointsSchema"));
const cephLogicHandler = {
    "listAllImages": () => __awaiter(void 0, void 0, void 0, function* () {
        const all_xrays = yield cephMasterSchema_1.default.find().select('-__v');
        return all_xrays;
    }),
    "uploadData": (payload) => __awaiter(void 0, void 0, void 0, function* () {
        const newDataImageURl = payload.dataURl.replace(/['"]/g, '');
        const newPayload = { dataImage: newDataImageURl, xrayName: payload.fileName };
        const res = yield cephMasterSchema_1.default.create(newPayload).then(result => { return result; }).catch(err => console.log(err));
        return { "message": "data inserted successfully", "data": res._id };
    }),
    "uploadCephData": (payload) => __awaiter(void 0, void 0, void 0, function* () {
        let pointData = {};
        let lineData = {};
        let angle_info = {};
        let magnificationCalibration;
        pointData = payload.points;
        lineData = payload.lines;
        angle_info = payload.angles;
        magnificationCalibration = payload.magnificationCalibration;
        // Object.keys(pointData).forEach((element:any) => {
        //     console.log(element)
        //     // element[element]['masterObjectId'] = new ObjectId(payload.ceph_id) 
        // });
        var newPointArr = [];
        for (const point in pointData) {
            pointData[point]['masterObjectId'] = new bson_1.ObjectId(payload.ceph_id);
            newPointArr.push(pointData[point]);
        }
        var LineArr = [];
        lineData.forEach((element) => {
            if (element.hasOwnProperty('distance')) {
                element['masterObjectId'] = new bson_1.ObjectId(payload.ceph_id);
                LineArr.push(element);
            }
        });
        var angle = [];
        angle_info.forEach((element) => {
            if (element.interpretation != "") {
                element['masterObjectId'] = new bson_1.ObjectId(payload.ceph_id);
                angle.push(element);
            }
        });
        const lineResult = yield linesSchema_1.default.find({ "masterObjectId": new bson_1.ObjectId(payload.ceph_id) }).select('-__v');
        const pointResult = yield pointsSchema_1.default.find({ "masterObjectId": new bson_1.ObjectId(payload.ceph_id) }).select('-__v');
        const angleResult = yield angleSchema_1.default.find({ "masterObjectId": new bson_1.ObjectId(payload.ceph_id) }).select('-__v');
        if (lineResult.length > 0) {
            const deleteManyResult = yield linesSchema_1.default.remove({ "masterObjectId": new bson_1.ObjectId(payload.ceph_id) });
            console.log(deleteManyResult);
        }
        if (pointResult.length > 0) {
            const deleteManyRes = yield pointsSchema_1.default.remove({ "masterObjectId": new bson_1.ObjectId(payload.ceph_id) });
            console.log(deleteManyRes);
        }
        if (angleResult.length > 0) {
            const deleteManyRes1 = yield angleSchema_1.default.remove({ "masterObjectId": new bson_1.ObjectId(payload.ceph_id) });
            console.log(deleteManyRes1);
        }
        yield linesSchema_1.default.create(LineArr).then(result => { return result; }).catch(err => console.log(err));
        yield pointsSchema_1.default.create(newPointArr).then(result => { return result; }).catch(err => console.log(err));
        yield angleSchema_1.default.create(angle).then(result => { return result; }).catch(err => console.log(err));
        yield cephMasterSchema_1.default.updateOne({ _id: new bson_1.ObjectId(payload.ceph_id) }, { $set: { magnificationCalibration: magnificationCalibration } });
    }),
    "getCephData": (id) => __awaiter(void 0, void 0, void 0, function* () {
        const points = yield pointsSchema_1.default.find({ "masterObjectId": id }).select('-__v');
        const lines = yield linesSchema_1.default.find({ "masterObjectId": id }).select('-__v');
        const angles = yield angleSchema_1.default.find({ "masterObjectId": id }).select('-__v');
        const all_xrays = yield cephMasterSchema_1.default.find({ "_id": id }).select('-__v');
        const allObjects = { "points": points, "lines": lines, "angles": angles, "xray_data": all_xrays };
        return { "message": "Data Sent Successfully", "data": allObjects };
    }),
    // "updateCephData" : async(id : string) => {
    //     if()
    // }
};
exports.default = cephLogicHandler;
