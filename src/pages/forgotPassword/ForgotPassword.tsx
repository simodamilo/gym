import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../utils/auth/AuthProvider";
import { routes } from "../../utils/routing/routes";
import { useNavigate } from "react-router-dom";
import { PageSEO } from "../../components/seo/PageSEO";
import { PublicPageSettings } from "../../components/publicPageSettings/PublicPageSettings";

export const ForgotPassword = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error } = await resetPassword(email);
        if (error) setError(error.message);
        else setSuccess(true);

        setLoading(false);
    };

    return (
        <>
            <PageSEO titleKey="seo.titles.forgot_password" descriptionKey="seo.descriptions.forgot_password" />
            <div className="h-dvh flex items-center justify-center px-4 bg-[var(--bg-primary)] relative">
                <PublicPageSettings />
                <div className="w-full max-w-md bg-[var(--bg-elevated)] shadow-xl rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-center mb-8 text-[var(--text-primary)]">{t("auth.forgot_password.title")}</h2>

                {success ? (
                    <p className="text-green-600 text-center">{t("auth.forgot_password.success_message")}</p>
                ) : (
                    <form onSubmit={handleReset} className="space-y-4">
                        <input
                            type="email"
                            placeholder={t("auth.forgot_password.email_placeholder")}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] px-4 py-3 rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-colors"
                        >
                            {loading ? t("auth.forgot_password.sending") : t("auth.forgot_password.send_button")}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center">
                    <p className="text-sm">
                        <span className="text-[var(--brand-primary)] hover:underline cursor-pointer font-medium" onClick={() => navigate(routes.login)}>
                            {t("auth.forgot_password.login_link")}
                        </span>
                    </p>
                </div>
            </div>
            </div>
        </>
    );
};
