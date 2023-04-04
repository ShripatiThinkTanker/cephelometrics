export interface pointToLine{
    id : string;
	name : string;
}

export const pointsLines : {[k: string] : pointToLine} = {
    'PogVN-B':{
        id : 'PogVN-B',
        name : "Pg-NB"
    },
    'UIeVN-A':{
        id : 'UIeVN-A',
        name : "U1-NA(Linear)"
    },
    'LIeVN-B':{
        id : 'LIeVN-B',
        name : "L1-NB(Linear)"
    }
}
