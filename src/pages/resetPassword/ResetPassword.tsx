import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../utils/auth/AuthProvider";
import { routes } from "../../utils/routing/routes";
import { useNavigate } from "react-router-dom";
import { PageSEO } from "../../components/seo/PageSEO";
import { PublicPageSettings } from "../../components/publicPageSettings/PublicPageSettings";

export const ResetPassword = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { updatePassword } = useAuth();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validate passwords match
        if (password !== confirmPassword) {
            setError(t("auth.reset_password.error_passwords_mismatch"));
            return;
        }

        // Validate password length
        if (password.length < 6) {
            setError(t("auth.reset_password.error_password_length"));
            return;
        }

        setLoading(true);

        const { error } = await updatePassword(password);
        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate(routes.login);
            }, 2000);
        }
    };

    return (
        <>
            <PageSEO titleKey="seo.titles.reset_password" descriptionKey="seo.descriptions.reset_password" />
            <div className="h-dvh flex items-center justify-center px-4 bg-[var(--bg-primary)] relative">
                <PublicPageSettings />
                <div className="w-full max-w-md bg-[var(--bg-elevated)] shadow-xl rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-center mb-8 text-[var(--text-primary)]">{t("auth.reset_password.title")}</h2>

                    {success ? (
                        <div className="text-center">
                            <p className="text-green-600 mb-4">{t("auth.reset_password.success_message")}</p>
                            <p className="text-[var(--text-secondary)] text-sm">{t("auth.reset_password.redirect_message")}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleReset} className="space-y-4">
                            <input
                                type="password"
                                placeholder={t("auth.reset_password.new_password_placeholder")}
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] px-4 py-3 rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                            <input
                                type="password"
                                placeholder={t("auth.reset_password.confirm_password_placeholder")}
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] px-4 py-3 rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-colors"
                            >
                                {loading ? t("auth.reset_password.updating") : t("auth.reset_password.update_button")}
                            </button>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <p className="text-sm">
                            <span className="text-[var(--brand-primary)] hover:underline cursor-pointer font-medium" onClick={() => navigate(routes.login)}>
                                {t("auth.reset_password.login_link")}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};
