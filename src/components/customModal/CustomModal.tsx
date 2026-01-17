import { Modal } from "antd";
import { DeleteOutlined, EditOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import styles from "./CustomModal.module.css";

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
                return <DeleteOutlined className={styles.iconDelete} />;
            case "edit":
                return <EditOutlined className={styles.iconEdit} />;
            case "publish":
                return <CheckCircleOutlined className={styles.iconSuccess} />;
            case "confirm":
                return <ExclamationCircleOutlined className={styles.iconConfirm} />;
            default:
                return null;
        }
    };

    const getButtonClass = () => {
        switch (type) {
            case "delete":
                return styles.buttonDelete;
            case "edit":
                return styles.buttonEdit;
            case "publish":
                return styles.buttonPublish;
            case "confirm":
                return styles.buttonConfirm;
            default:
                return styles.buttonConfirm;
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
            className={styles.modal}
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
            <div className={styles.modalContent}>
                {/* Icon Header */}
                <div className={styles.iconContainer}>
                    {getIcon()}
                </div>

                {/* Title */}
                {title && <h3 className={styles.title}>{title}</h3>}

                {/* Content */}
                <div className={styles.content}>{children}</div>

                {/* Buttons */}
                <div className={styles.buttonContainer}>
                    <motion.button
                        onClick={onCancel}
                        className={styles.buttonCancel}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {cancelText}
                    </motion.button>
                    <motion.button
                        onClick={onOk}
                        className={`${styles.buttonOk} ${getButtonClass()}`}
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
