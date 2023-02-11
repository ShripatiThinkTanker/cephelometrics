export interface pointList{
    pointName : string;
    pointAlias : string;
    isActive : boolean;
}

export const steinerPoints: Array<pointList> = [
    
    {
        pointName : "Calibration Point 1",
        pointAlias : "C1",
        isActive : true,
    },
    {
        pointName : "Calibration Point 2",
        pointAlias : "C2",
        isActive : true,
    },
    {
        pointName : "Sella (s)",
        pointAlias : "S",
        isActive : true,
    },
    {
        pointName : "Nasion (Na)",
        pointAlias : "N",
        isActive : true,
    },
    {
        pointName : "A-point (A)",
        pointAlias : "A",
        isActive : true,
    },
    {
        pointName : "B-point (B)",
        pointAlias : "B",
        isActive : true,
    },
    {
        pointName: "Menton (Me)",
        pointAlias : "Me",
        isActive : true,
    },
    {
        pointName: "Gonion (Go)",
        pointAlias : "Go",
        isActive : true,
    },
    {
        pointName: "Pogonion (Pg)",
        pointAlias : "Pg",
        isActive : true,
    },
    {
        pointName : "Porion (P)",
        pointAlias : "P",
        isActive : true,
    },
    {
        pointName : "Orbitale (O)",
        pointAlias : "O",
        isActive : true
    }
]