export type ProgressState = {
    progresses: ProgressHistory[];
    isLoading: boolean;
    isError: boolean;
};

export interface ProgressHistory {
    id: string;
    type: string;
    subtype: string;
    period: Date;
    value: string;
    unit: string;
    notes?: string;
}

export interface AddProgressHistory {
    id: string;
    type: string;
    subtype: string;
    period: Date;
    value: string;
    unit: string;
    notes?: string;
}
