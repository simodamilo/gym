import { supabase } from "../../store/supabaseClient";

export const Profile = () => {
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Logout error:", error.message);
        } else {
            console.log("User logged out");
        }
    };

    return (
        <div className="homepage" onClick={handleLogout}>
            Profile
        </div>
    );
};
