export interface Distance{
    id : string;
	name?: string
    description : string;
    mean: number;
    deviation : number;
    inc : string;
    dec : string;
    norm : string;
	invert ?:boolean;
	typeOfMeasurement ?: string;
	abs?: boolean;
}
export const distance: {[k:string] : Distance} = {
	//LAFH
	'ANS-Me^': {
		id: 'AN-Me^',
		name : "LAFH",
		description: 'MMPA, maxillary-mandibular plane angle',
		mean: 27,
		deviation: 5,
		inc: 'Skeletal open bite, increases facial height',
		dec: 'Skeletal deep bite, decreases facial height',
		norm: 'Normal skeletal bite, normal facial height',
	},
	// //UAFH
	'ANS-N^': {
		id: 'AN-N^',
		name : 'UAFH',
		description: 'Maxillary plane to cranial base',
		mean: 8,
		deviation: 3,
		inc: 'Increased maxillary plane downward growth',
		dec: 'Decreased maxillary plane downward growth',
		norm: 'Normal maxillary plane growth',
	}
}