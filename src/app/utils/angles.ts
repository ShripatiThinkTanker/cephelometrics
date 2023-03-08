export interface Angle {
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

export const angles : {[k: string] : Angle} = {
	//SNA
    'S-N^N-A': {
		id: 'S-N^N-A',
		name : "SNA",
		description: 'SNA angle, describes anteroposterior position of the maxilla in relation to the cranial base',
		mean: 82,
		deviation: 2,
		inc: 'Prognathic maxilla',
		dec: 'Retrognathic maxilla',
		norm: 'Normal anteroposterior position of the maxilla',
		typeOfMeasurement : "Angular"
	},
	//SNB
	'S-N^N-B': {
		id: 'S-N^N-B',
		name: 'SNB',
		description: 'SNB angle, describes anteroposterior position of the mandible in relation to the cranial base',
		mean: 80,
		deviation: 2,
		inc: 'Prognathic mandible',
		dec: 'Retrognathic mandible',
		norm: 'Normal anteroposterior position of the mandible',
		typeOfMeasurement : "Angular",
	},
	//ANB
	'N-B^N-A': {
		id: 'N-B^N-A',
		description: 'ANB, a relative determination of the relation­ship of the maxilla to the mandible.',
		name : "ANB",
		mean: 2,
		deviation: 2,
		inc: 'Skeletal Class II relationship',
		dec: 'Skeletal Class III relationship',
		norm: 'Skeletal Class I relationship',
		typeOfMeasurement : "Angular",
	}, 
	//SN-Pg
	'S-N^Pog-N': {
		id: 'S-N^Pog-N',
		name : "SN-Pg",
		description:
			'The angle of convexity is a measure of maxillary protrusion in relation to the total profile and is the angle formed between lines running from N–A to A–Pog.',
		mean: 80,
		deviation: 5.9,
		inc: 'Concave skeletal profile',
		dec: 'Convex skeletal profile',
		norm: 'Straight skeletal profile',
		typeOfMeasurement : "Angular",
	},
	//NPg-FH
	'P-O^N-Pog': {
		id: 'P-O^N-Pog',
		name : "NPg-FH",
		description:
			'The angle of convexity is a measure of maxillary protrusion in relation to the total profile and is the angle formed between lines running from N–A to A–Pog.',
		mean: 87,
		deviation: 5.9,
		inc: 'protrusive or prognathic maxilla',
		dec: 'deficient or retrognathic maxillac',
		norm: 'Straight skeletal profile',
		invert : false,
		abs : true,
		typeOfMeasurement : "Angular",
	},
	//FH-MP
	'P-O^Me-Go' : {
		id : 'P-O^Me-Go',
		name : 'FH-MP',
		description : "Also known as Frankfort Mandibular-Plane Angle (FMA) many orthodontists prefer to use Frankfort Horizontal than SN.",
		mean : 24,
		deviation : 3,
		inc : 'Skeletal open bite, increases facial height',
		dec: 'Skeletal deep bite, decreases facial height',
		norm: 'Normal skeletal bite, normal facial height',
		invert:true,
		typeOfMeasurement : "Angular"
	},

	// SN-MP
	'S-N^Me-Go': {
		id: 'S-N^Me-Go',
		name : "SN-MP",
		description: 'SN-MP, The mandibular plane angle, SN-NP, measure for vertical growth patterns',
		mean: 32,
		deviation: 5,
		inc: 'Clockwise rotation of the mandible growth, unfavorable hyperdivergent pattern',
		norm: 'Normal mandible rotation',
		dec: 'Counterclockwise rotation of the mandible growth',
		invert:true,
		typeOfMeasurement : "Angular"
		
	},
	// Y-Axis SN
	'S-N^Gn-S': {
		id: 'S-N^Gn-S',
		name : "Y-Axis SN",
		description:
			'Y-Axis, SN, Anteroinferior angle formed by the intersect­ion of a line drawn from sella to gnathion and the Frankfort horizontal, determines the overall growth pattern of the face',
		mean: 66,
		deviation: 4,
		inc:
			'Class II division 2 cases usually have a smaller Y-axis',
		dec:
			'Class II division 1 cases usually have an average to high Y- axis.',
		norm: 'Normal mandible rotation',
		invert : true,
		typeOfMeasurement : "Angular"
	},
	// Y-Axis FH
	"P-O^Gn-Go":{
		id : 'P-O^Gn-Go',
		name : "Y-Axis FH",
		description : "The same interpretation as above using Sella-Nasion. Many orthodontists prefer to use Frankfort Horizontal than SN.",
		mean : 59,
		deviation : 3,
		inc : 'Class II division 2 cases usually have a smaller Y-axis',
		dec : 'Class II division 1 cases usually have an average to high Y- axis.',
		norm  : "Normal mandible rotation",
		invert : true,
		typeOfMeasurement : "Angular"

	},

	//NA-FH
	'P-O^N-A': {
		id: 'P-O^N-A',
		name : 'NA-FH',
		description:
			'Facial Angle, Frankfort plane with N-Pog, measure the degree of retrusion or protrusion of the lower jaw.',
		mean: 87,
		deviation: 3.6,
		dec: 'Prominent, prognathic chin & mandible',
		inc: 'Retrognathic chin, mandible',
		norm: 'Normal chin, mandible',
		invert: true,
		abs:true,
		typeOfMeasurement : "Angular"
	},

	// 'ANS-Me^': {
	// 	id: 'ANS-Me^',
	// 	name : "LAFH",
	// 	description: 'MMPA, maxillary-mandibular plane angle',
	// 	mean: 27,
	// 	deviation: 5,
	// 	inc: 'Skeletal open bite, increases facial height',
	// 	dec: 'Skeletal deep bite, decreases facial height',
	// 	norm: 'Normal skeletal bite, normal facial height',
	// },
	
	
}