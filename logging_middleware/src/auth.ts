import axios from 'axios';
import { AuthCredentials, AuthTokenResponse } from './types';

// store the token so we dont call auth api every time
let savedToken: string | null = null;
let tokenExpiry: number | null = null;

// auth api url
const AUTH_URL = 'http://20.207.122.201/evaluation-service/auth';

export async function getAuthToken(credentials: AuthCredentials): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    
    if (savedToken && tokenExpiry && (now + 10) < tokenExpiry) {
        return savedToken;
    }

    // get a new token
    try {
        const response = await axios.post<AuthTokenResponse>(AUTH_URL, credentials);
        savedToken = response.data.access_token;
        tokenExpiry = response.data.expires_in;
        return savedToken;
    } catch (error: any) {
        console.log("Auth failed: " + error.message);
        throw new Error('Failed to get token');
    }
}
