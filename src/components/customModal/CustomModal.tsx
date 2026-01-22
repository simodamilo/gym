import { Modal } from "antd";
import { DeleteOutlined, EditOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

export type ModalType = "delete" | "edit" | "publish" | "confirm";

interface CustomModalProps {
    open: boolean;
    onOk: () => void;
    onCancel: () => void;
    type?: ModalType;
    title?: string;
    children?: React.ReactNode;
    okText?: string;
    cancelText?: string;
}

export const CustomModal = ({
    open,
    onOk,
    onCancel,
    type = "confirm",
    title,
    children,
    okText,
    cancelText = "Cancel",
}: CustomModalProps) => {
    const getIcon = () => {
        switch (type) {
            case "delete":
                return <DeleteOutlined className="text-[32px] text-[#ff7875] max-[480px]:text-[28px]" />;
            case "edit":
                return <EditOutlined className="text-[32px] text-[var(--brand-primary)] max-[480px]:text-[28px]" />;
            case "publish":
                return <CheckCircleOutlined className="text-[32px] text-[#52c41a] max-[480px]:text-[28px]" />;
            case "confirm":
                return <ExclamationCircleOutlined className="text-[32px] text-[#faad14] max-[480px]:text-[28px]" />;
            default:
                return null;
        }
    };

    const getButtonClass = () => {
        switch (type) {
            case "delete":
                return "bg-gradient-to-br from-[#ff4d4f] to-[#ff7875] shadow-[0_4px_12px_rgba(255,77,79,0.3)] hover:shadow-[0_6px_16px_rgba(255,77,79,0.4)]";
            case "edit":
                return "bg-gradient-to-br from-[var(--brand-primary)] to-[#3b82f6] shadow-[0_4px_12px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_16px_rgba(59,130,246,0.4)]";
            case "publish":
                return "bg-gradient-to-br from-[#52c41a] to-[#73d13d] shadow-[0_4px_12px_rgba(82,196,26,0.3)] hover:shadow-[0_6px_16px_rgba(82,196,26,0.4)]";
            case "confirm":
                return "bg-gradient-to-br from-[#faad14] to-[#ffc53d] shadow-[0_4px_12px_rgba(250,173,20,0.3)] hover:shadow-[0_6px_16px_rgba(250,173,20,0.4)]";
            default:
                return "bg-gradient-to-br from-[#faad14] to-[#ffc53d] shadow-[0_4px_12px_rgba(250,173,20,0.3)] hover:shadow-[0_6px_16px_rgba(250,173,20,0.4)]";
        }
    };

    const getDefaultOkText = () => {
        switch (type) {
            case "delete":
                return "Delete";
            case "edit":
                return "Save";
            case "publish":
                return "Publish";
            case "confirm":
                return "OK";
            default:
                return "OK";
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            closable={false}
            centered
            styles={{
                content: {
                    backgroundColor: 'var(--bg-elevated)',
                    borderRadius: '20px',
                    padding: '0',
                    overflow: 'hidden',
                },
                mask: {
                    backdropFilter: 'blur(8px)',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
            }}
        >
            <div className="px-6 pt-8 pb-6 flex flex-col items-center gap-5 max-[480px]:px-5 max-[480px]:pt-6 max-[480px]:pb-5">
                {/* Icon Header */}
                <div className="w-16 h-16 flex items-center justify-center rounded-full mb-2 max-[480px]:w-14 max-[480px]:h-14">
                    {getIcon()}
                </div>

                {/* Title */}
                {title && <h3 className="m-0 text-xl font-semibold text-[var(--text-primary)] text-center leading-snug max-[480px]:text-lg">{title}</h3>}

                {/* Content */}
                <div className="w-full text-[var(--text-secondary)] text-sm text-center leading-relaxed">{children}</div>

                {/* Buttons */}
                <div className="flex gap-3 w-full mt-2">
                    <motion.button
                        onClick={onCancel}
                        className="flex-1 h-11 rounded-xl border-none text-[15px] font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-light)] hover:bg-[var(--bg-elevated)] max-[480px]:h-10 max-[480px]:text-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {cancelText}
                    </motion.button>
                    <motion.button
                        onClick={onOk}
                        className={`flex-1 h-11 rounded-xl border-none text-[15px] font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center text-white relative overflow-hidden max-[480px]:h-10 max-[480px]:text-sm ${getButtonClass()}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {okText || getDefaultOkText()}
                    </motion.button>
                </div>
            </div>
        </Modal>
    );
};
