import { AppData } from "../types";

const STORAGE_KEY = "task-manager-data-v1";

export const saveToStorage = (data: AppData) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error("Failed to save data", e);
    }
};

export const loadFromStorage = (): AppData | null => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (e) {
        console.error("Failed to load data", e);
        return null;
    }
};
