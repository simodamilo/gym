import { Button, Input, Modal } from "antd";
import { supabase } from "../../store/supabaseClient";
import { useEffect, useState } from "react";
import DarkModeToggle from "../../components/darkModeToggle/DarkModeToggle";
import { useTranslation } from "react-i18next";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { EditOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../../store";
import { progressHistoryActions } from "../../store/progressHistory/progressHistory.action";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { progressesSelectors } from "../../store/progressHistory/progressHistory.selector";

interface GraphData {
    name: string,
    value: string
}

function formatToShort(dateString: string) {
    const date = new Date(dateString);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const month = months[date.getMonth()];

    return `${month}`;
}

export const Profile = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const [email, setEmail] = useState<string>();
    const [openWeightModal, setOpenWeightModal] = useState<boolean>(false);
    const [newWeight, setNewWeight] = useState<string>();

    const progresses = useSelector(progressesSelectors.getProgresses);
    const [dataWeights, setDataWeights] = useState<GraphData[]>();

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
        dispatch(progressHistoryActions.fetchProgressesByType());
    }, []);

    useEffect(() => {
        if (progresses) {
            setDataWeights(
                progresses.map(progress => {
                    return {
                        name: formatToShort(progress.period.toString()),
                        value: progress.value
                    }
                })
            )
        }
    }, [progresses]);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Logout error:", error.message);
        } else {
            console.log("User logged out");
        }
    };

    const saveWeight = () => {
        const weights = progresses.filter(progress => progress.type === 'weight');
        const today = new Date();
        const date = new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1));
        const existingWeight = weights.find(weight => date.toDateString() == new Date(weight.period).toDateString());
        if (newWeight) {
            dispatch(progressHistoryActions.addWeight(
                {
                    id: existingWeight ? existingWeight.id : uuidv4(),
                    type: existingWeight ? existingWeight.type : 'weight',
                    subtype: existingWeight ? existingWeight.subtype : 'weight',
                    period: existingWeight ? existingWeight.period : date,
                    value: newWeight,
                    unit: existingWeight ? existingWeight.unit : 'kg'
                }
            ))
        }
        setOpenWeightModal(false);
        setNewWeight(undefined);
    }

    return (
        <div className="flex flex-col gap-4 justify-between pb-25">
            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <div className="w-[40%] bg-[var(--primary-color)] color-[var(--white-color)] rounded-md p-2">
                        <img src={'https://api.dicebear.com/8.x/pixel-art/svg?seed=t7xz3urh'} alt="User Avatar" />
                    </div>
                    <div className="w-[60%] bg-[var(--primary-color)] color-[var(--white-color)] rounded-md p-2">{email}</div>
                </div>
                <div className="bg-[var(--primary-color)] color-[var(--white-color)] rounded-md p-4">
                    <div className="flex justify-between items-center mb-4">
                        <p>Weight graph</p>
                        <Button size="large" icon={<EditOutlined />} type="primary" shape="circle" onClick={() => setOpenWeightModal(true)} />
                    </div>

                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dataWeights}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#4d4d4d" />
                        </LineChart>
                    </ResponsiveContainer>
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

            <Modal
                title={t("workouts.workout_page.add_day_modal_title")}
                closable={{ "aria-label": "Custom Close Button" }}
                open={openWeightModal}
                onOk={saveWeight}
                onCancel={() => {
                    setOpenWeightModal(false);
                    setNewWeight(undefined);
                }}
            >
                <Input
                    placeholder={t("workouts.workout_page.day_name_placeholder")}
                    value={newWeight}
                    onChange={(input) => setNewWeight(input.target.value)}
                />
            </Modal>
        </div>
    );
};
