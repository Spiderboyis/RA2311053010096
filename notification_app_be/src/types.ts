export type NotificationType = "Event" | "Result" | "Placement";

export interface Notification {
    ID: string;
    Type: NotificationType;
    Message: string;
    Timestamp: string;
}

export interface NotificationsResponse {
    notifications: Notification[];
}

export interface ScoredNotification extends Notification {
    Score: number;
    HoursAgo: number;
}
