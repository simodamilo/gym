import type { NotificationInstance } from "antd/es/notification/interface";

let notificationApi: NotificationInstance | null = null;

export const setNotificationApi = (api: NotificationInstance) => {
    notificationApi = api;
};

export const getNotificationApi = () => {
    if (!notificationApi) {
        throw new Error("Notification API not set. Make sure NotificationProvider is mounted.");
    }
    return notificationApi;
};
