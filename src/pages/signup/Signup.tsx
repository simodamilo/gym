import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../utils/auth/AuthProvider";
import { routes } from "../../utils/routing/routes";
import { PageSEO } from "../../components/seo/PageSEO";
import { PublicPageSettings } from "../../components/publicPageSettings/PublicPageSettings";
import logo from "../../assets/logo.png";

export const Signup = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, signUp } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (user) navigate(routes.workouts);
    }, [user, navigate]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error } = await signUp(email, password);
        if (error) setError(error.message);
        else setSuccess(true);

        setLoading(false);
    };

    return (
        <>
            <PageSEO titleKey="seo.titles.signup" descriptionKey="seo.descriptions.signup" />
            <div className="min-h-dvh flex items-center justify-center px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative">
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
                                <p className="text-lg font-medium bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">{t("auth.signup.welcome_text")}</p>
                            </div>
                        </div>

                        {success ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-green-600 dark:text-green-400 font-medium text-lg">{t("auth.signup.success_message")}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSignup} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Email</label>
                                    <input
                                        type="email"
                                        placeholder={t("auth.signup.email_placeholder")}
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] px-4 py-3.5 rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Password</label>
                                    <input
                                        type="password"
                                        placeholder={t("auth.signup.password_placeholder")}
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] px-4 py-3.5 rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
                                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {loading ? t("auth.signup.signing_up") : t("auth.signup.signup_button")}
                                </button>
                            </form>
                        )}

                        <div className="mt-8 pt-6 border-t border-[var(--border-default)] text-center">
                            <p className="text-sm text-[var(--text-secondary)]">
                                {t("auth.signup.have_account_text")}{" "}
                                <span
                                    className="text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 font-semibold cursor-pointer transition-colors"
                                    onClick={() => navigate(routes.login)}
                                >
                                    {t("auth.signup.login_link")}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
