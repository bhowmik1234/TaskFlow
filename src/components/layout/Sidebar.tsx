import { useState } from "react";
import { CheckSquare, BarChart2, History, Trash2 } from "lucide-react";
import clsx from "clsx";
import { useTasks } from "../../context/TaskContext";
import { ConfirmDialog } from "./ConfirmDialog";


interface SidebarProps {
    currentView: "tracker" | "analytics" | "history";
    onChangeView: (view: "tracker" | "analytics" | "history") => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
    const { clearData } = useTasks();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const btnClass = (active: boolean) =>
        clsx(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            active
                ? "bg-slate-200 text-slate-900"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        );

    const handleClearData = () => {
        clearData();
        setIsConfirmOpen(false);
    };

    return (
        <div className="w-64 bg-slate-50 h-screen border-r border-slate-200 flex flex-col pt-10 px-4">
            {/* Draggable region for macOS traffic lights */}
            <div data-tauri-drag-region className="absolute top-0 left-0 w-full h-10" />

            <div className="mb-8 px-2 flex items-center gap-3">
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">TaskFlow</h1>
            </div>

            <nav className="flex flex-col gap-1">
                <button
                    onClick={() => onChangeView("tracker")}
                    className={btnClass(currentView === "tracker")}
                >
                    <CheckSquare size={18} />
                    Tracker
                </button>
                <button
                    onClick={() => onChangeView("analytics")}
                    className={btnClass(currentView === "analytics")}
                >
                    <BarChart2 size={18} />
                    Analytics
                </button>
                <button
                    onClick={() => onChangeView("history")}
                    className={btnClass(currentView === "history")}
                >
                    <History size={18} />
                    History
                </button>
            </nav>

            <div className="mt-auto pb-4">
                <button
                    onClick={() => setIsConfirmOpen(true)}
                    className={clsx(btnClass(false), "text-red-500 hover:bg-red-50 hover:text-red-600")}
                >
                    <Trash2 size={18} />
                    Clear Data
                </button>
            </div>

            <ConfirmDialog
                isOpen={isConfirmOpen}
                title="Clear All Data?"
                description="This will permanently delete all your tasks and history. This action cannot be undone."
                onConfirm={handleClearData}
                onCancel={() => setIsConfirmOpen(false)}
                confirmText="Yes, delete everything"
                visualType="danger"
            />
        </div>
    );
};
