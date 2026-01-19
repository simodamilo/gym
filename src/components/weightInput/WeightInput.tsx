import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

interface WeightInputProps {
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
    error?: string;
    min?: number;
    max?: number;
    step?: number;
}

export const WeightInput = ({
    value,
    onChange,
    disabled = false,
    error,
    min = 0.5,
    max = 999.9,
    step = 0.5,
}: WeightInputProps) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleIncrement = () => {
        const newValue = Math.min(max, value + step);
        onChange(Number(newValue.toFixed(1)));
    };

    const handleDecrement = () => {
        const newValue = Math.max(min, value - step);
        onChange(Number(newValue.toFixed(1)));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // Allow empty input for user to type
        if (inputValue === "") {
            onChange(0);
            return;
        }

        const numValue = parseFloat(inputValue);

        // Validate and constrain
        if (!isNaN(numValue)) {
            const constrainedValue = Math.min(max, Math.max(min, numValue));
            onChange(Number(constrainedValue.toFixed(1)));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowUp") {
            e.preventDefault();
            handleIncrement();
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            handleDecrement();
        }
    };

    const handleBlur = () => {
        setIsFocused(false);
        // Ensure value is within bounds and formatted
        if (value < min) {
            onChange(min);
        } else if (value > max) {
            onChange(max);
        }
    };

    return (
        <div className="w-full">
            <label className="block text-sm text-neutral-400 mb-2">
                Weight (kg)
            </label>
            <div
                className={`flex items-center rounded-xl bg-neutral-800 border transition-colors ${
                    error
                        ? "border-red-500"
                        : isFocused
                        ? "border-blue-500"
                        : "border-neutral-700"
                } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                {/* Decrement Button */}
                <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={disabled || value <= min}
                    className="w-12 h-12 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-l-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                    aria-label="Decrease weight"
                >
                    <MinusOutlined className="text-lg" />
                </button>

                {/* Weight Input */}
                <input
                    type="number"
                    value={value || ""}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={handleBlur}
                    disabled={disabled}
                    step={step}
                    min={min}
                    max={max}
                    className="flex-1 bg-transparent text-center text-2xl font-semibold text-white outline-none py-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    aria-label="Weight value"
                />

                {/* Increment Button */}
                <button
                    type="button"
                    onClick={handleIncrement}
                    disabled={disabled || value >= max}
                    className="w-12 h-12 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-r-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                    aria-label="Increase weight"
                >
                    <PlusOutlined className="text-lg" />
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-red-500 text-sm mt-1" role="alert">
                    {error}
                </p>
            )}

            {/* Helper Text */}
            {!error && (
                <p className="text-neutral-500 text-xs mt-1">
                    Min: {min}kg, Max: {max}kg
                </p>
            )}
        </div>
    );
};
