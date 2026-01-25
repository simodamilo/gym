import { useState } from "react";
import { useAuth } from "../../utils/auth/AuthProvider";
import { routes } from "../../utils/routing/routes";
import { useNavigate } from "react-router-dom";
import { PageSEO } from "../../components/seo/PageSEO";

export const ResetPassword = () => {
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
            setError("Le password non corrispondono");
            return;
        }

        // Validate password length
        if (password.length < 6) {
            setError("La password deve essere di almeno 6 caratteri");
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
            <div className="h-dvh flex items-center justify-center px-4 bg-[#2d2d2d]">
                <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">Imposta Nuova Password</h2>

                    {success ? (
                        <div className="text-center">
                            <p className="text-green-600 mb-4">Password aggiornata con successo!</p>
                            <p className="text-gray-600 text-sm">Verrai reindirizzato alla pagina di login...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleReset} className="space-y-4">
                            <input
                                type="password"
                                placeholder="Nuova Password"
                                className="w-full bg-gray-100 border border-gray-200 px-4 py-3 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                            <input
                                type="password"
                                placeholder="Conferma Password"
                                className="w-full bg-gray-100 border border-gray-200 px-4 py-3 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-lg font-medium transition-colors"
                            >
                                {loading ? "Aggiornamento..." : "Aggiorna Password"}
                            </button>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <p className="text-sm">
                            <span className="text-indigo-600 hover:underline cursor-pointer font-medium" onClick={() => navigate(routes.login)}>
                                Torna al login
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};
