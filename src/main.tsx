import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Provider, useSelector } from "react-redux";
import store, { useAppDispatch } from "./store/store.config.ts";
import type { RootState } from "./store/reducer.config.ts";
import { currentSelectors } from "./store/current/current.selectors.ts";
import { currentActions } from "./store/current/current.actions.ts";
import AuthProvider, { useAuth } from "./utils/auth/AuthProvider.tsx";
import { router } from "./utils/routing/router.tsx";
import { ConfigProvider, theme as antdTheme } from 'antd';
import { ThemeProvider, useTheme } from "./theme/ThemeProvider.tsx";

const MIN_SPLASH_TIME = 1000;

// Wrapper component that provides Ant Design theme configuration based on app theme
const AntdConfigWrapper = ({ children }: { children: React.ReactNode }) => {
    const { mode } = useTheme();

    const antdThemeConfig = {
        algorithm: mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
            colorPrimary: mode === 'dark' ? '#4096ff' : '#1677ff',
            colorSuccess: mode === 'dark' ? '#73d13d' : '#52c41a',
            colorWarning: mode === 'dark' ? '#ffc53d' : '#faad14',
            colorError: mode === 'dark' ? '#ff7875' : '#ff4d4f',
            colorInfo: mode === 'dark' ? '#4096ff' : '#1677ff',
            borderRadius: 8,
            fontSize: 16,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
        },
        components: {
            Button: {
                borderRadius: 8,
                controlHeight: 40,
            },
            Input: {
                borderRadius: 8,
                controlHeight: 40,
            },
            Select: {
                borderRadius: 8,
                controlHeight: 40,
            },
            Modal: {
                borderRadius: 16,
            },
        },
    };

    return <ConfigProvider theme={antdThemeConfig}>{children}</ConfigProvider>;
};

// eslint-disable-next-line react-refresh/only-export-components
const RootWithSplash = () => {
    const dispatch = useAppDispatch();
    const { user } = useAuth();

    const isLoadingWorkout = useSelector((state: RootState) => currentSelectors.isLoading(state));

    const [showSplash, setShowSplash] = useState(true);
    const splashStartTime = useRef(Date.now());

    useEffect(() => {
        if (user) {
            dispatch(currentActions.fetchCurrentWorkout());
        }
    }, [user, dispatch]);

    /* Management of Splash screen */
    useEffect(() => {
        if (!user) {
            const elapsed = Date.now() - splashStartTime.current;
            const remaining = MIN_SPLASH_TIME - elapsed;

            if (remaining > 0) {
                const timer = setTimeout(() => setShowSplash(false), remaining);
                return () => clearTimeout(timer);
            } else {
                setShowSplash(false);
            }
        } else if (!isLoadingWorkout) {
            const elapsed = Date.now() - splashStartTime.current;
            const remaining = MIN_SPLASH_TIME - elapsed;

            if (remaining > 0) {
                const timer = setTimeout(() => setShowSplash(false), remaining);
                return () => clearTimeout(timer);
            } else {
                setShowSplash(false);
            }
        }
    }, [user, isLoadingWorkout]);

    if (showSplash) return null;

    return <RouterProvider router={router} />;
};

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <ThemeProvider>
            <AntdConfigWrapper>
                <AuthProvider>
                    <RootWithSplash />
                </AuthProvider>
            </AntdConfigWrapper>
        </ThemeProvider>
    </Provider>
);
