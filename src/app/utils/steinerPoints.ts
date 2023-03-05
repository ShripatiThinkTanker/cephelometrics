export interface pointList{
    pointName : string;
    pointAlias : string;
    isActive : boolean;
    imagePath : string;
}

export const steinerPoints: Array<pointList> = [
    
    {
        pointName : "Calibration Point 1",
        pointAlias : "C1",
        isActive : true,
        imagePath : 'assets/img/C1.jpg'
    },
    {
        pointName : "Calibration Point 2",
        pointAlias : "C2",
        isActive : true,
        imagePath : 'assets/img/C2.jpg'
    },
    {
        pointName : "Sella (s)",
        pointAlias : "S",
        isActive : true,
        imagePath : 'assets/img/S.jpg'
    },
    {
        pointName : "Nasion (Na)",
        pointAlias : "N",
        isActive : true,
        imagePath : 'assets/img/Na.jpg'
    },
    {
        pointName : "A-point (A)",
        pointAlias : "A",
        isActive : true,
        imagePath : 'assets/img/A.jpg'
    },
    {
        pointName : "B-point (B)",
        pointAlias : "B",
        isActive : true,
        imagePath : 'assets/img/B.jpg'
    },
    {
        pointName: "Menton (Me)",
        pointAlias : "Me",
        isActive : true,
        imagePath : 'assets/img/Me.jpg'
    },
    {
        pointName: "Gonion (Go)",
        pointAlias : "Go",
        isActive : true,
        imagePath : 'assets/img/Go.jpg'
    },
    {
        pointName: "Pogonion (Pog)",
        pointAlias : "Pog",
        isActive : true,
        imagePath : 'assets/img/Pog.jpg'
    },
    {
        pointName : "Porion (P)",
        pointAlias : "P",
        isActive : true,
        imagePath : 'assets/img/P.jpg'
    },
    {
        pointName : "Orbitale (O)",
        pointAlias : "O",
        isActive : true,
        imagePath : 'assets/img/O.jpg'
    },

    {
        pointName: 'Gnathion (Gn)',
        isActive: true,
        pointAlias: 'Gn',
        imagePath: '',
    },

    {
        pointName: 'Anterior Nasal Spine (ANS)',
        isActive: true,
        pointAlias: 'AN',
        imagePath: '',
    },
    {
        pointName: 'Posterior Nasal Spine (PNS)',
        isActive: true,
        pointAlias: 'PN',
        imagePath: '',
    },
    {
        pointName: 'Basion (Ba)',
        isActive: true,
        pointAlias: 'BA',
        imagePath: '',
    },
    {
        pointName: 'Palatal roof',
        isActive: true,
        pointAlias: 'pr',
        imagePath: '',
    },
    {
        pointName: 'Articulare (Ar)',
        isActive: true,
        pointAlias: 'Ar',
        imagePath: '',
    },
    {
        pointName: 'Porion (Po)',
        isActive: true,
        pointAlias: 'Po',
        imagePath: '',
    },
    {
        pointName: 'Key ridges',
        isActive: true,
        pointAlias: 'kr',
        imagePath: '',
    },
    {
        pointName: 'Anterior Point of Occlusal Plane (apOcP)',
        isActive: true,
        pointAlias: 'apOcP',
        imagePath: '',
    },
    {
        pointName: 'Posterior Point of Occlusal Plane (ppOcP)',
        isActive: true,
        pointAlias: 'ppOcP',
        imagePath: '',
    },
    { pointName: 'AO-point', isActive: true, pointAlias: 'AO', imagePath: '' },
    { pointName: 'BO-point', isActive: true, pointAlias: 'BO', imagePath: '' },
]

// export const basicPoints : Array<pointList> = [
//     {
//         pointName: 'Calibration Point 1 (C1)',
//         isActive: true,
//         pointAlias: 'C1',
//         imagePath: '',
//     },
//     {
//         pointName: 'Calibration Point 2 (C2)',
//         isActive: true,
//         pointAlias: 'C2',
//         imagePath: '',
//     },
//     { pointName: 'Sella (s)', isActive: true, pointAlias: 'S', imagePath: '' },
//     {
//         pointName: 'Nasion (Na)',
//         isActive: true,
//         pointAlias: 'N',
//         imagePath: '',
//     },
//     {
//         pointName: 'A-point (A)',
//         isActive: true,
//         pointAlias: 'A',
//         imagePath: '',
//     },
//     {
//         pointName: 'B-point (B)',
//         isActive: true,
//         pointAlias: 'B',
//         imagePath: '',
//     },

//     {
//         pointName: 'Menton (Me)',
//         isActive: true,
//         pointAlias: 'M',
//         imagePath: '',
//     },

//     { pointName: 'Gonion', isActive: true, pointAlias: 'Go', imagePath: '' },

//     {
//         pointName: 'Pogonion (Pg)',
//         isActive: true,
//         pointAlias: 'P',
//         imagePath: '',
//     },
//     {
//         pointName: 'Gnathion (Gn)',
//         isActive: true,
//         pointAlias: 'G',
//         imagePath: '',
//     },

//     {
//         pointName: 'Anterior Nasal Spine (ANS)',
//         isActive: true,
//         pointAlias: 'AN',
//         imagePath: '',
//     },
//     {
//         pointName: 'Posterior Nasal Spine (PNS)',
//         isActive: true,
//         pointAlias: 'PN',
//         imagePath: '',
//     },
//     {
//         pointName: 'Basion (Ba)',
//         isActive: true,
//         pointAlias: 'BA',
//         imagePath: '',
//     },
//     {
//         pointName: 'Palatal roof',
//         isActive: true,
//         pointAlias: 'pr',
//         imagePath: '',
//     },
//     {
//         pointName: 'Orbitale (Or)',
//         isActive: true,
//         pointAlias: 'or',
//         imagePath: '',
//     },
//     {
//         pointName: 'Articulare (Ar)',
//         isActive: true,
//         pointAlias: 'Ar',
//         imagePath: '',
//     },
//     {
//         pointName: 'Porion (Po)',
//         isActive: true,
//         pointAlias: 'Po',
//         imagePath: '',
//     },
//     {
//         pointName: 'Key ridges',
//         isActive: true,
//         pointAlias: 'kr',
//         imagePath: '',
//     },
//     {
//         pointName: 'Anterior Point of Occlusal Plane (apOcP)',
//         isActive: true,
//         pointAlias: 'apOcP',
//         imagePath: '',
//     },
//     {
//         pointName: 'Posterior Point of Occlusal Plane (ppOcP)',
//         isActive: true,
//         pointAlias: 'ppOcP',
//         imagePath: '',
//     },
//     { pointName: 'AO-point', isActive: true, pointAlias: 'AO', imagePath: '' },
//     { pointName: 'BO-point', isActive: true, pointAlias: 'BO', imagePath: '' },
    
// ]