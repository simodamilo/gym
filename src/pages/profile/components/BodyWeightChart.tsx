import { EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface GraphData {
    name: string;
    value: string;
}

interface BodyWeightChartProps {
    data: GraphData[];
    currentWeight?: string;
    onEditClick: () => void;
}

export const BodyWeightChart = ({ data, currentWeight, onEditClick }: BodyWeightChartProps) => {
    const { t } = useTranslation();

    return (
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-950 dark:to-neutral-900 rounded-2xl p-6">
            {/* Header */}
            <div className="mb-4">
                <div className="flex justify-between items-center">
                    <p className="text-green-500 text-sm uppercase tracking-wider flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M2 8 L6 4 L10 10 L14 2" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {t("profile.body_weight_progress")}
                    </p>
                    <Button
                        icon={<EditOutlined />}
                        type="text"
                        shape="circle"
                        size="large"
                        onClick={onEditClick}
                        className="text-white hover:bg-white/10"
                    />
                </div>
                {currentWeight && (
                    <p className="text-white text-2xl font-bold">
                        {currentWeight} kg
                    </p>
                )}
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                    <XAxis
                        dataKey="name"
                        stroke="#6B7280"
                        className="text-xs"
                    />
                    <YAxis
                        width={40}
                        domain={[40, "auto"]}
                        stroke="#6B7280"
                        className="text-xs"
                    />
                    <Tooltip
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-black/90 text-white px-3 py-2 rounded-lg text-sm border border-green-500/30">
                                        <p className="mb-0">{`${label}`}</p>
                                        <p className="mb-0 font-bold text-green-500">{`${payload[0].value} kg`}</p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#10B981"
                        strokeWidth={3}
                        dot={{ fill: '#10B981', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
