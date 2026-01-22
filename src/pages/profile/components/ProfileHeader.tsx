import { SettingOutlined } from "@ant-design/icons";
import { Button } from "antd";

interface ProfileHeaderProps {
    email?: string;
    onSettingsClick: () => void;
}

export const ProfileHeader = ({ email, onSettingsClick }: ProfileHeaderProps) => {
    return (
        <div className="flex justify-between items-center">
            {/* User Info */}
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--border-light)]">
                    <img
                        src={`https://api.dicebear.com/8.x/pixel-art/svg?seed=1234`}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* User Name and Badge */}
                <div className="flex-1">
                    <h2 className="text-[var(--text-primary)] text-xl font-bold mb-1">
                        {email?.split("@")[0] || ""}
                    </h2>
                </div>
            </div>

            {/* Settings Icon */}
            <Button
                icon={<SettingOutlined />}
                type="text"
                shape="circle"
                size="large"
                onClick={onSettingsClick}
                className="text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
            />
        </div>
    );
};
