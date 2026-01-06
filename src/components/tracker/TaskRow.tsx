import React, { useState } from "react";
import { format } from "date-fns";
import { Check, MoreHorizontal } from "lucide-react";
import clsx from "clsx";
import { Task } from "../../types";

interface TaskRowProps {
    task: Task;
    dates: Date[];
    completions: Record<string, boolean>; // date -> boolean
    onToggle: (date: string) => void;
    onRename: (newTitle: string) => void;
    onDelete: () => void;
    dragHandle?: React.ReactNode;
}

export const TaskRow: React.FC<TaskRowProps> = ({
    task,
    dates,
    completions,
    onToggle,
    onRename,
    onDelete,
    dragHandle,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(task.title);

    const handleRename = () => {
        if (editValue.trim() && editValue !== task.title) {
            onRename(editValue);
        }
        setIsEditing(false);
    }

    return (
        <div className="flex items-center border-b border-slate-100 hover:bg-slate-50 group">
            {/* Sticky Task Name Column */}
            <div className="sticky left-0 bg-white group-hover:bg-slate-50 z-10 flex items-center min-w-[200px] w-64 border-r border-slate-100 px-4 py-2">
                {dragHandle}
                {isEditing ? (
                    <input
                        autoFocus
                        className="w-full bg-slate-100 px-2 py-1 rounded text-sm outline-none border border-blue-400"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        onBlur={handleRename}
                        onKeyDown={e => e.key === "Enter" && handleRename()}
                    />
                ) : (
                    <div className="flex-1 text-sm text-slate-700 truncate cursor-pointer" onDoubleClick={() => setIsEditing(true)}>
                        {task.title}
                    </div>
                )}

                {/* Simple delete button on hover */}
                <button onClick={onDelete} className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-opacity">
                    <MoreHorizontal size={14} />
                    {/* In a real app this would be a menu, using it as delete trigger for simplicity or add a confirm */}
                </button>
            </div>

            {/* Date Columns */}
            {dates.map((date) => {
                const dateKey = format(date, "yyyy-MM-dd");
                const isCompleted = completions[dateKey];
                return (
                    <div key={dateKey} className="flex items-center justify-center min-w-[60px] py-2 border-r border-slate-50">
                        <button
                            onClick={() => onToggle(dateKey)}
                            className={clsx(
                                "w-6 h-6 rounded flex items-center justify-center transition-all duration-200",
                                isCompleted
                                    ? "bg-blue-500 text-white shadow-sm"
                                    : "bg-slate-100 hover:bg-slate-200 text-transparent"
                            )}
                        >
                            <Check size={14} strokeWidth={3} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};
