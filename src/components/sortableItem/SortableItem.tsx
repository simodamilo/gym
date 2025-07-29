import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";

interface SortableItemProps {
    id: string;
    children: ReactNode;
}

export const SortableItem = ({id, children}: SortableItemProps) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: transform ? CSS.Transform.toString(transform) : undefined,
        transition,
        touchAction: "none",
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    );
};