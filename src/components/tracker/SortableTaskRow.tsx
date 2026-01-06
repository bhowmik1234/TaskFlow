import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskRow } from "./TaskRow";
import { Task } from "../../types";
import { GripVertical } from "lucide-react";

interface SortableTaskRowProps {
    task: Task;
    dates: Date[];
    completions: Record<string, boolean>;
    onToggle: (date: string) => void;
    onRename: (newTitle: string) => void;
    onDelete: () => void;
}

export const SortableTaskRow: React.FC<SortableTaskRowProps> = (props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: props.task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : "auto",
        position: isDragging ? "relative" as const : undefined,
    };

    return (
        <div ref={setNodeRef} style={style} className={isDragging ? "opacity-50" : ""}>
            <div className="relative flex items-center">
                {/* Drag Handle - Absolute positioned or part of flow? 
            TaskRow has a sticky column. We need the handle INSIDE that sticky column.
            This is tricky because TaskRow encapsulates the sticky column.
            
            Solution: We can't easily inject the handle into TaskRow without modifying TaskRow.
            Let's modify TaskRow to accept an optional 'dragHandle' render prop or just children?
            Or pass attributes/listeners to TaskRow.
        */}
                <TaskRow {...props} dragHandle={
                    <button {...attributes} {...listeners} className="mr-2 text-slate-400 cursor-grab active:cursor-grabbing hover:text-slate-600">
                        <GripVertical size={14} />
                    </button>
                } />
            </div>
        </div>
    );
};
