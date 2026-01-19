import { Input } from "antd";
import { supabase } from "../../store/supabaseClient";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../store";
import { progressHistoryActions } from "../../store/progressHistory/progressHistory.action";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { progressesSelectors } from "../../store/progressHistory/progressHistory.selector";
import { historySelectors } from "../../store/history/history.selectors";
import { historyActions } from "../../store/history/history.actions";
import { personalBestsActions } from "../../store/personalBests/personalBests.actions";
import { ProfileHeader } from "./components/ProfileHeader";
import { WorkoutStatsCard } from "./components/WorkoutStatsCard";
import { BodyWeightChart } from "./components/BodyWeightChart";
import { PersonalBests } from "./components/PersonalBests";
import { SettingsModal } from "./components/SettingsModal";
import { CustomModal } from "../../components/customModal/CustomModal";

interface GraphData {
    name: string;
    value: string;
}

function formatToShort(dateString: string) {
    const date = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    return `${month}`;
}

export const Profile = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const [email, setEmail] = useState<string>();
    const [openWeightModal, setOpenWeightModal] = useState<boolean>(false);
    const [openSettingsModal, setOpenSettingsModal] = useState<boolean>(false);
    const [newWeight, setNewWeight] = useState<string>();

    const progresses = useSelector(progressesSelectors.getProgresses);
    const historyWorkouts = useSelector(historySelectors.getHistoryWorkouts);
    const [dataWeights, setDataWeights] = useState<GraphData[]>([]);

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();

            if (error) {
                console.error("Error fetching user:", error.message);
                return;
            }

            if (user) {
                setEmail(user.email);
            }
        };

        fetchUser();
        dispatch(progressHistoryActions.fetchProgressesByType());
        dispatch(historyActions.fetchHistoryWorkout());
        dispatch(personalBestsActions.fetchPersonalBests());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (progresses) {
            setDataWeights(
                progresses.map((progress) => {
                    return {
                        name: formatToShort(progress.period.toString()),
                        value: progress.value,
                    };
                })
            );
        }
    }, [progresses]);

    const saveWeight = () => {
        const weights = progresses.filter((progress) => progress.type === "weight");
        const today = new Date();
        const date = new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1));
        const existingWeight = weights.find((weight) => date.toDateString() == new Date(weight.period).toDateString());
        if (newWeight) {
            dispatch(
                progressHistoryActions.addWeight({
                    id: existingWeight ? existingWeight.id : uuidv4(),
                    type: existingWeight ? existingWeight.type : "weight",
                    subtype: existingWeight ? existingWeight.subtype : "weight",
                    period: existingWeight ? existingWeight.period : date,
                    value: newWeight,
                    unit: existingWeight ? existingWeight.unit : "kg",
                })
            );
        }
        setOpenWeightModal(false);
        setNewWeight(undefined);
    };

    const currentWeight = dataWeights.length > 0 ? dataWeights[dataWeights.length - 1].value : undefined;

    return (
        <div className="flex flex-col gap-4 p-4 pb-28 overflow-y-auto h-full hide-scrollbar">
            {/* Profile Header */}
            <ProfileHeader
                email={email}
                onSettingsClick={() => setOpenSettingsModal(true)}
            />

            {/* Workout Stats */}
            <WorkoutStatsCard workoutCount={historyWorkouts.length} />

            {/* Body Weight Chart */}
            <BodyWeightChart
                data={dataWeights}
                currentWeight={currentWeight}
                onEditClick={() => setOpenWeightModal(true)}
            />

            {/* Personal Bests */}
            <PersonalBests />

            {/* Weight Modal */}
            <CustomModal
                title={t("profile.weight_modal.title")}
                open={openWeightModal}
                onOk={saveWeight}
                onCancel={() => {
                    setOpenWeightModal(false);
                    setNewWeight(undefined);
                }}
                type="edit"
                okText="Save"
                cancelText="Cancel"
            >
                <Input
                    placeholder={t("profile.weight_modal.placeholder")}
                    value={newWeight}
                    onChange={(input) => setNewWeight(input.target.value)}
                    size="large"
                    className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                />
            </CustomModal>

            {/* Settings Modal */}
            <SettingsModal
                open={openSettingsModal}
                onClose={() => setOpenSettingsModal(false)}
            />
        </div>
    );
};
