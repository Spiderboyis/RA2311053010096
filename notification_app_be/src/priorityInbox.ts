import { Notification, ScoredNotification } from './types';
import { Log } from 'logging_middleware';

export function calculateScore(notification: Notification, currentTime: Date): ScoredNotification {
    let notifTime = new Date(notification.Timestamp);
    let diffMs = currentTime.getTime() - notifTime.getTime();
    let hoursAgo = diffMs / (1000 * 60 * 60);
    if (hoursAgo < 0) {
        hoursAgo = 0;
    }
    
    let weight = 0;
    if (notification.Type === "Placement") {
        weight = 3;
    } else if (notification.Type === "Result") {
        weight = 2;
    } else if (notification.Type === "Event") {
        weight = 1;
    }
    
    let score = weight * (1 / (1 + hoursAgo));
    
    return {
        ID: notification.ID,
        Type: notification.Type,
        Message: notification.Message,
        Timestamp: notification.Timestamp,
        Score: score,
        HoursAgo: hoursAgo
    };
}

export async function getTopPriorityNotifications(notifications: Notification[], n: number = 10): Promise<ScoredNotification[]> {
    await Log('backend', 'info', 'service', 'Starting');
    
    let now = new Date();
    let scoredList: ScoredNotification[] = [];
    
    for (let i = 0; i < notifications.length; i++) {
        let scored = calculateScore(notifications[i], now);
        scoredList.push(scored);
    }
    
    for (let i = 0; i < scoredList.length; i++) {
        for (let j = i + 1; j < scoredList.length; j++) {
            if (scoredList[j].Score > scoredList[i].Score) {
                let temp = scoredList[i];
                scoredList[i] = scoredList[j];
                scoredList[j] = temp;
            }
        }
    }
    
    let topN: ScoredNotification[] = [];
    for (let i = 0; i < n && i < scoredList.length; i++) {
        topN.push(scoredList[i]);
    }
    
    await Log('backend', 'info', 'service', 'Done');
    
    return topN;
}
