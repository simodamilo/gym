import React from "react";
import { notification } from "antd";
import { setNotificationApi } from "../../utils/notificationService";
import type { NotificationInstance } from "antd/es/notification/interface";

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [api, contextHolder] = notification.useNotification();

    React.useEffect(() => {
        const wrapWithClass = (fn: (args: any) => void) => (args: any) => {
            fn({
                className: "custom-notification",
                placement: "topRight",
                ...args,
            });
        };

        const wrappedApi: NotificationInstance = {
            ...api,
            open: wrapWithClass(api.open),
            success: wrapWithClass(api.success),
            error: wrapWithClass(api.error),
            info: wrapWithClass(api.info),
            warning: wrapWithClass(api.warning),
        };

        setNotificationApi(wrappedApi); // Store globally
    }, [api]);

    return (
        <>
            {contextHolder}
            {children}
        </>
    );
};
