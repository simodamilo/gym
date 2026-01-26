import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../utils/auth/AuthProvider";
import { routes } from "../../utils/routing/routes";
import { PageSEO } from "../../components/seo/PageSEO";
import { PublicPageSettings } from "../../components/publicPageSettings/PublicPageSettings";
import logo from "../../assets/logo.png";

export const Login = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, signInWithEmail } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) navigate(routes.workouts);
    }, [user, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error } = await signInWithEmail(email, password);
        if (error) setError(error.message);

        setLoading(false);
    };

    return (
        <>
            <PageSEO titleKey="seo.titles.login" descriptionKey="seo.descriptions.login" />
            <div className="min-h-dvh flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative">
                <PublicPageSettings />

                <div className="w-full max-w-md">
                    {/* Form Container */}
                    <div className="bg-[var(--bg-elevated)] shadow-xl rounded-2xl p-4 md:p-8">
                        <div className="flex gap-4 md:gap-8 items-center mb-4">
                            {/* Logo */}
                            <div className="w-24 h-24 flex items-center">
                                <img src={logo} alt={t("accessibility.logo_alt")} />
                            </div>

                            {/* Title and Welcome Text with Gradient */}
                            <div className="text-left">
                                <p className="text-md md:text-lg font-medium bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">{t("auth.login.welcome_text")}</p>
                            </div>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Email</label>
                                <input
                                    type="email"
                                    placeholder={t("auth.login.email_placeholder")}
                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] px-4 py-3.5 rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Password</label>
                                <input
                                    type="password"
                                    placeholder={t("auth.login.password_placeholder")}
                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] px-4 py-3.5 rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
                                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {loading ? t("auth.login.logging_in") : t("auth.login.login_button")}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-[var(--border-default)] space-y-3 text-center">
                            <p className="text-sm text-[var(--text-secondary)]">
                                {t("auth.login.no_account_text")}{" "}
                                <span
                                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-semibold cursor-pointer transition-colors"
                                    onClick={() => navigate(routes.signup)}
                                >
                                    {t("auth.login.signup_link")}
                                </span>
                            </p>
                            <p className="text-sm">
                                <span
                                    className="text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 font-medium cursor-pointer transition-colors"
                                    onClick={() => navigate(routes.forgotPassword)}
                                >
                                    {t("auth.login.forgot_password_link")}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
