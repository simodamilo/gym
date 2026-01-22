import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CSSProperties, ReactNode } from "react";

interface SortableItemProps {
    id: string;
    children: ReactNode;
}

export const SortableItem = ({ id, children }: SortableItemProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style: CSSProperties = {
        transform: transform ? CSS.Transform.toString(transform) : undefined,
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={isDragging ? "relative z-10 shadow-[0_10px_20px_rgba(255,255,255,0.2)]" : ""}
            {...attributes}
            {...listeners}
        >
            {children}
        </div>
    );
};
