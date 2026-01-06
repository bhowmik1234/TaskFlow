import React, { createContext, useContext, useEffect, useState } from "react";
import { CompletionMap, Task, TaskContextType } from "../types";
import { loadFromStorage, saveToStorage } from "../lib/storage";

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [completions, setCompletions] = useState<CompletionMap>({});
    const [isLoaded, setIsLoaded] = useState(false);

    // Load on mount
    useEffect(() => {
        const data = loadFromStorage();
        if (data) {
            setTasks(data.tasks);
            setCompletions(data.completions);
        } else {
            // Seed initial data for first time users? Or empty.
            // Let's add one example task
            const demoTask: Task = {
                id: crypto.randomUUID(),
                title: "My first task",
                createdAt: new Date().toISOString()
            };
            setTasks([demoTask]);
        }
        setIsLoaded(true);
    }, []);

    // Save on change
    useEffect(() => {
        if (isLoaded) {
            saveToStorage({ tasks, completions });
        }
    }, [tasks, completions, isLoaded]);

    const addTask = (title: string) => {
        const newTask: Task = {
            id: crypto.randomUUID(),
            title,
            createdAt: new Date().toISOString(),
        };
        setTasks((prev) => [...prev, newTask]);
    };

    const deleteTask = (taskId: string) => {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        setCompletions((prev) => {
            const next = { ...prev };
            delete next[taskId];
            return next;
        });
    };

    const toggleCompletion = (taskId: string, date: string) => {
        setCompletions((prev) => {
            const taskRecord = prev[taskId] || {};
            const newStatus = !taskRecord[date];
            return {
                ...prev,
                [taskId]: {
                    ...taskRecord,
                    [date]: newStatus,
                },
            };
        });
    };

    const renameTask = (taskId: string, newTitle: string) => {
        setTasks((prev) =>
            prev.map((t) => (t.id === taskId ? { ...t, title: newTitle } : t))
        );
    };

    const reorderTasks = (activeId: string, overId: string) => {
        setTasks((prev) => {
            const oldIndex = prev.findIndex(t => t.id === activeId);
            const newIndex = prev.findIndex(t => t.id === overId);

            if (oldIndex === -1 || newIndex === -1) return prev;

            const newPrev = [...prev];
            const [movedItem] = newPrev.splice(oldIndex, 1);
            newPrev.splice(newIndex, 0, movedItem);
            return newPrev;
        });
    };

    const clearData = () => {
        setTasks([]);
        setCompletions({});
    };

    return (
        <TaskContext.Provider value={{ tasks, completions, addTask, deleteTask, toggleCompletion, renameTask, reorderTasks, clearData }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error("useTasks must be used within a TaskProvider");
    }
    return context;
};
