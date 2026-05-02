// types for depot and vehicle data

export interface Depot {
    ID: number;
    MechanicHours: number;
}

export interface Vehicle {
    TaskID: string;
    Duration: number;
    Impact: number;
}

export interface DepotsResponse {
    depots: Depot[];
}

export interface VehiclesResponse {
    vehicles: Vehicle[];
}

export interface ScheduleResult {
    depotID: number;
    mechanicHoursAvailable: number;
    mechanicHoursUsed: number;
    totalImpactScore: number;
    selectedVehicles: Vehicle[];
}
