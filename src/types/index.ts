export interface Task {
    id: string;
    title: string;
    createdAt: string; // ISO Date string
}

export interface CompletionMap {
    [taskId: string]: {
        [dateIso: string]: boolean;
    };
}

export interface AppData {
    tasks: Task[];
    completions: CompletionMap;
}

export interface TaskContextType {
    tasks: Task[];
    completions: CompletionMap;
    addTask: (title: string) => void;
    deleteTask: (taskId: string) => void;
    toggleCompletion: (taskId: string, date: string) => void;
    renameTask: (taskId: string, newTitle: string) => void;
    reorderTasks: (activeId: string, overId: string) => void;
    clearData: () => void;
}
