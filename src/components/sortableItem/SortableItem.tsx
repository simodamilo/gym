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
        boxShadow: isDragging ? "0 10px 20px rgba(255, 255, 255, 0.2)" : undefined,
        position: isDragging ? ("relative" as CSSProperties["position"]) : undefined,
        zIndex: isDragging ? 10 : undefined,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    );
};
