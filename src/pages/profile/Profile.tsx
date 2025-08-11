import { Button } from "antd";
import { supabase } from "../../store/supabaseClient";
import { useEffect, useState } from "react";
import DarkModeToggle from "../../components/darkModeToggle/DarkModeToggle";
import { useTranslation } from "react-i18next";

export const Profile = () => {
    const { t } = useTranslation();

    const [email, setEmail] = useState<string>();

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();

            if (error) {
                console.error('Error fetching user:', error.message);
                return;
            }

            if (user) {
                setEmail(user.email);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Logout error:", error.message);
        } else {
            console.log("User logged out");
        }
    };

    return (
        <div className="h-full flex flex-col justify-between pb-22">
            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <div className="w-[40%] bg-[var(--primary-color)] color-[var(--white-color)] rounded-md p-2">
                        <img src={'https://api.dicebear.com/8.x/pixel-art/svg?seed=t7xz3urh'} alt="User Avatar" />
                    </div>
                    <div className="w-[60%] bg-[var(--primary-color)] color-[var(--white-color)] rounded-md p-2">{email}</div>
                </div>
                <div className="bg-[var(--primary-color)] color-[var(--white-color)] rounded-md p-2">
                    Weight graph
                </div>
                <div className="bg-[var(--primary-color)] color-[var(--white-color)] rounded-md p-2">
                    Max graph
                </div>
                <div className="flex flex-col gap-2 bg-[var(--primary-color)] color-[var(--white-color)] rounded-md p-2">
                    <p className="font-bold text-xl">{t('profile.settings_title')}</p>
                    <div className="flex justify-between items-center">Dark Mode<DarkModeToggle /></div>
                </div>
            </div>
            <Button type="primary" danger onClick={handleLogout}>Logout</Button>
        </div>
    );
};
