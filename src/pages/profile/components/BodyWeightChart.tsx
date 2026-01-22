import { EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";

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

    // Compute colors from CSS variables for chart
    const [axisColor, setAxisColor] = useState("#6B7280");
    const [tooltipBg, setTooltipBg] = useState("#000000");
    const [tooltipText, setTooltipText] = useState("#ffffff");

    useEffect(() => {
        const updateColors = () => {
            const styles = getComputedStyle(document.documentElement);
            setAxisColor(styles.getPropertyValue('--text-tertiary').trim());
            setTooltipBg(styles.getPropertyValue('--bg-elevated').trim());
            setTooltipText(styles.getPropertyValue('--text-primary').trim());
        };

        updateColors();

        // Listen for theme changes
        const observer = new MutationObserver(updateColors);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class', 'data-theme']
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="bg-[var(--bg-profile-card)] shadow-var-md rounded-2xl p-6">
            {/* Header */}
            <div className="mb-4">
                <div className="flex justify-between items-center">
                    <p className="text-[var(--semantic-success)] text-sm uppercase tracking-wider flex items-center gap-2">
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
                        className="text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                    />
                </div>
                {currentWeight && (
                    <p className="text-[var(--text-primary)] text-2xl font-bold">
                        {currentWeight} kg
                    </p>
                )}
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                    <XAxis
                        dataKey="name"
                        stroke={axisColor}
                        className="text-xs"
                    />
                    <YAxis
                        width={40}
                        domain={[40, "auto"]}
                        stroke={axisColor}
                        className="text-xs"
                    />
                    <Tooltip
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div
                                        className="px-3 py-2 rounded-lg text-sm border-[var(--border-default)] shadow-var-md"
                                        style={{
                                            backgroundColor: tooltipBg,
                                            color: tooltipText,
                                            borderWidth: '1px',
                                            borderStyle: 'solid'
                                        }}
                                    >
                                        <p className="mb-0">{`${label}`}</p>
                                        <p className="mb-0 font-bold text-[var(--semantic-success)]">{`${payload[0].value} kg`}</p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="var(--semantic-success)"
                        strokeWidth={3}
                        dot={{ fill: 'var(--semantic-success)', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
