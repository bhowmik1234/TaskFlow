import React from "react";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
    children: React.ReactNode;
    currentView: "tracker" | "analytics" | "history";
    onChangeView: (view: "tracker" | "analytics" | "history") => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, currentView, onChangeView }) => {
    return (
        <div className="flex h-screen w-full bg-white text-slate-900 font-sans overflow-hidden">
            <Sidebar currentView={currentView} onChangeView={onChangeView} />
            <main className="flex-1 flex flex-col h-full relative overflow-hidden">
                {/* Draggable region for main window part too? optional */}
                <div data-tauri-drag-region className="w-full h-10 flex-shrink-0" />
                <div className="flex-1 overflow-auto p-6 pt-0">
                    {children}
                </div>
            </main>
        </div>
    );
};
