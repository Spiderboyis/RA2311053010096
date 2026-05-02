import axios from 'axios';
import { Depot, Vehicle, DepotsResponse, VehiclesResponse } from './types';
import { getAuthToken } from 'logging_middleware/dist/auth';
import { AuthCredentials } from 'logging_middleware/dist/types';
import { Log } from 'logging_middleware';

const DEPOTS_URL = 'http://20.207.122.201/evaluation-service/depots';
const VEHICLES_URL = 'http://20.207.122.201/evaluation-service/vehicles';

const CREDENTIALS: AuthCredentials = {
    email: "harshitmathur88@gmail.com",
    name: "harshit mathur",
    rollNo: "ra2311053010096",
    accessCode: "QkbpxH",
    clientID: "af6d1ade-1dd5-4015-b5b6-231411eae5aa",
    clientSecret: "vKvRyfYfeQZDMVEK"
};

export async function fetchDepots(): Promise<Depot[]> {
    try {
        await Log('backend', 'info', 'service', 'Fetching depots');

        var token = await getAuthToken(CREDENTIALS);

        var response = await axios.get<DepotsResponse>(DEPOTS_URL, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        });

        await Log('backend', 'info', 'service', 'Got depots: ' + response.data.depots.length);
        return response.data.depots;
    } catch (error: any) {
        await Log('backend', 'error', 'service', 'Failed to get depots: ' + error.message);
        throw error;
    }
}

export async function fetchVehicles(): Promise<Vehicle[]> {
    try {
        await Log('backend', 'info', 'service', 'Fetching vehicles');

        const token = await getAuthToken(CREDENTIALS);

        const response = await axios.get<VehiclesResponse>(VEHICLES_URL, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        });

        await Log('backend', 'info', 'service', 'Got vehicles: ' + response.data.vehicles.length);
        return response.data.vehicles;
    } catch (error: any) {
        await Log('backend', 'error', 'service', 'Failed to get vehicles: ' + error.message);
        throw error;
    }
}
