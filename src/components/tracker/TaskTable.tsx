import React, { useState } from "react";
import { eachDayOfInterval, addDays, subDays } from "date-fns";
import { useTasks } from "../../context/TaskContext";
import { DayHeader } from "./DayHeader";
import { SortableTaskRow } from "./SortableTaskRow";
import { Plus } from "lucide-react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export const TaskTable: React.FC = () => {
    const { tasks, completions, addTask, toggleCompletion, renameTask, deleteTask, reorderTasks } = useTasks();
    const [newTaskTitle, setNewTaskTitle] = useState("");

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id && over) {
            reorderTasks(active.id as string, over.id as string);
        }
    };

    // Calculate columns starting from Yesterday
    const today = new Date();
    const dates = eachDayOfInterval({
        start: subDays(today, 1),
        end: addDays(today, 10),
    });

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTaskTitle.trim()) {
            addTask(newTaskTitle);
            setNewTaskTitle("");
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Table Header */}
            <div className="flex border-b border-slate-200 bg-white sticky top-0 z-20">
                <div className="sticky left-0 bg-white z-30 min-w-[200px] w-64 border-r border-slate-200 flex items-center px-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">
                    Task
                </div>
                {dates.map((date) => (
                    <DayHeader key={date.toString()} date={date} />
                ))}
            </div>

            {/* Table Body */}
            <div className="flex-1 overflow-auto bg-white">
                {tasks.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">
                        No tasks yet. Add one below to start tracking!
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={tasks.map(t => t.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {tasks.map(task => (
                                <SortableTaskRow
                                    key={task.id}
                                    task={task}
                                    dates={dates}
                                    completions={completions[task.id] || {}}
                                    onToggle={(date) => toggleCompletion(task.id, date)}
                                    onRename={(newTitle) => renameTask(task.id, newTitle)}
                                    onDelete={() => deleteTask(task.id)}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                )}

                {/* Add Task Input Row */}
                <div className="flex items-center border-b border-slate-100 min-h-[48px]">
                    <div className="sticky left-0 bg-white z-10 min-w-[200px] w-64 border-r border-slate-100 flex items-center px-4 py-2">
                        <form onSubmit={handleAddTask} className="flex items-center w-full gap-2">
                            <Plus size={16} className="text-slate-400" />
                            <input
                                type="text"
                                placeholder="Add new task..."
                                className="flex-1 text-sm bg-transparent outline-none placeholder:text-slate-400"
                                value={newTaskTitle}
                                onChange={e => setNewTaskTitle(e.target.value)}
                            />
                        </form>
                    </div>
                    {dates.map(date => (
                        <div key={date.toString()} className="min-w-[60px] bg-slate-50/30 border-r border-slate-50" />
                    ))}
                </div>
                <div className="h-12" />
            </div>
        </div>
    );
};
