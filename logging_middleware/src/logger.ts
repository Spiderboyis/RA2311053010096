import axios from 'axios';
import { getAuthToken } from './auth';
import { AuthCredentials, LogRequest, LogResponse, Stack, Level, Package } from './types';

// log api url on test server
const LOG_URL = 'http://20.207.122.201/evaluation-service/logs';

// PUT YOUR OWN CREDENTIALS HERE
const CREDENTIALS: AuthCredentials = {
    email: "harshitmathur88@gmail.com",
    name: "harshit mathur",
    rollNo: "ra2311053010096",
    accessCode: "QkbpxH",
    clientID: "af6d1ade-1dd5-4015-b5b6-231411eae5aa",
    clientSecret: "vKvRyfYfeQZDMVEK"
};



export async function Log(stack: Stack, level: Level, pkg: Package, message: string): Promise<string | undefined> {

    try {
        // first get auth token
        const token = await getAuthToken(CREDENTIALS);
        
        // create the log data
        const payload: LogRequest = {
            stack: stack,
            level: level,
            package: pkg,
            message: message
        };

        const response = await axios.post<LogResponse>(LOG_URL, payload, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        });
        
        return response.data.logID;
    } catch (error: any) {
        console.log("Error");
    }
}
