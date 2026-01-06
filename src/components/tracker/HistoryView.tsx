import React from "react";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { useTasks } from "../../context/TaskContext";
import { Check } from "lucide-react";


export const HistoryView: React.FC = () => {
    const { tasks, completions } = useTasks();
    const today = new Date();
    // Show last 30 days of history?
    const historyDates = eachDayOfInterval({
        start: subDays(today, 29),
        end: subDays(today, 1), // Up to yesterday
    }).reverse(); // Show newest first

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Task History (Last 30 Days)</h2>

            <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 font-medium sticky left-0 bg-slate-50 z-10 w-64 border-r border-slate-200">Date</th>
                            {tasks.map(task => (
                                <th key={task.id} className="px-4 py-3 font-medium min-w-[100px] text-center border-r border-slate-100 last:border-0">
                                    <div className="truncate w-24 mx-auto" title={task.title}>{task.title}</div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {historyDates.map(date => {
                            const dateKey = format(date, "yyyy-MM-dd");
                            return (
                                <tr key={dateKey} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900 sticky left-0 bg-white border-r border-slate-100">
                                        {format(date, "MMM d, yyyy")} <span className="text-slate-400 font-normal ml-1">({format(date, "EEE")})</span>
                                    </td>
                                    {tasks.map(task => {
                                        const isCompleted = completions[task.id]?.[dateKey];
                                        return (
                                            <td key={`${task.id}-${dateKey}`} className="px-4 py-4 text-center border-r border-slate-100 last:border-0">
                                                {isCompleted ? (
                                                    <div className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded">
                                                        <Check size={14} />
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-300">-</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
