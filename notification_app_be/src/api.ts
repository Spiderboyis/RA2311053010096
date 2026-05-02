import axios from 'axios';
import { Notification, NotificationsResponse } from './types';
import { getAuthToken } from 'logging_middleware/dist/auth';
import { AuthCredentials } from 'logging_middleware/dist/types';
import { Log } from 'logging_middleware';

const NOTIFICATIONS_URL = 'http://20.207.122.201/evaluation-service/notifications';

const CREDENTIALS: AuthCredentials = {
    email: "harshitmathur88@gmail.com",
    name: "harshit mathur",
    rollNo: "ra2311053010096",
    accessCode: "QkbpxH",
    clientID: "af6d1ade-1dd5-4015-b5b6-231411eae5aa",
    clientSecret: "vKvRyfYfeQZDMVEK"
};

export async function fetchNotifications(): Promise<Notification[]> {
    try {
        await Log('backend', 'info', 'service', 'Get notifications');

        const token = await getAuthToken(CREDENTIALS);
        const response = await axios.get<NotificationsResponse>(NOTIFICATIONS_URL, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        });

        await Log('backend', 'info', 'service', 'Got notifications: ' + response.data.notifications.length);
        return response.data.notifications;
    } catch (error: any) {
        await Log('backend', 'error', 'service', 'Error');
        throw error;
    }
}
