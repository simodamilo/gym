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
import { HelmetProvider } from 'react-helmet-async';

const MIN_SPLASH_TIME = 1000;

// Check if running in PWA/mobile mode
const isMobileOrPWA = () => {
    // Check if running in standalone mode (PWA)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    // Check if mobile device based on screen width
    const isMobile = window.innerWidth < 768;

    return isStandalone || isMobile;
};

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

    // Only show splash on mobile/PWA, skip on Desktop
    const shouldShowSplash = isMobileOrPWA();
    const [showSplash, setShowSplash] = useState(shouldShowSplash);
    const splashStartTime = useRef(Date.now());

    useEffect(() => {
        if (user) {
            dispatch(currentActions.fetchCurrentWorkout());
        }
    }, [user, dispatch]);

    /* Management of Splash screen */
    useEffect(() => {
        // Skip splash screen management if not on mobile/PWA
        if (!shouldShowSplash) {
            setShowSplash(false);
            // Remove HTML splash screen element
            const splashElement = document.getElementById('splash-screen');
            if (splashElement) {
                splashElement.remove();
            }
            return;
        }

        if (!user) {
            const elapsed = Date.now() - splashStartTime.current;
            const remaining = MIN_SPLASH_TIME - elapsed;

            if (remaining > 0) {
                const timer = setTimeout(() => {
                    setShowSplash(false);
                    // Remove HTML splash screen element with fade-out
                    const splashElement = document.getElementById('splash-screen');
                    if (splashElement) {
                        splashElement.classList.add('fade-out');
                        setTimeout(() => splashElement.remove(), 500);
                    }
                }, remaining);
                return () => clearTimeout(timer);
            } else {
                setShowSplash(false);
                // Remove HTML splash screen element with fade-out
                const splashElement = document.getElementById('splash-screen');
                if (splashElement) {
                    splashElement.classList.add('fade-out');
                    setTimeout(() => splashElement.remove(), 500);
                }
            }
        } else if (!isLoadingWorkout) {
            const elapsed = Date.now() - splashStartTime.current;
            const remaining = MIN_SPLASH_TIME - elapsed;

            if (remaining > 0) {
                const timer = setTimeout(() => {
                    setShowSplash(false);
                    // Remove HTML splash screen element with fade-out
                    const splashElement = document.getElementById('splash-screen');
                    if (splashElement) {
                        splashElement.classList.add('fade-out');
                        setTimeout(() => splashElement.remove(), 500);
                    }
                }, remaining);
                return () => clearTimeout(timer);
            } else {
                setShowSplash(false);
                // Remove HTML splash screen element with fade-out
                const splashElement = document.getElementById('splash-screen');
                if (splashElement) {
                    splashElement.classList.add('fade-out');
                    setTimeout(() => splashElement.remove(), 500);
                }
            }
        }
    }, [user, isLoadingWorkout, shouldShowSplash]);

    if (showSplash) return null;

    return <RouterProvider router={router} />;
};

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <HelmetProvider>
            <ThemeProvider>
                <AntdConfigWrapper>
                    <AuthProvider>
                        <RootWithSplash />
                    </AuthProvider>
                </AntdConfigWrapper>
            </ThemeProvider>
        </HelmetProvider>
    </Provider>
);
