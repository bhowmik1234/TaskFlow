import React, { useState, useMemo } from "react";
import {
    eachDayOfInterval,
    format,
    subDays,
    parseISO,
    startOfDay,
    isValid
} from "date-fns";
import { useTasks } from "../../context/TaskContext";
import { AnalyticsCard } from "./AnalyticsCard";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    AreaChart,
    Area
} from 'recharts';
import clsx from "clsx";

type TimeRange = "1D" | "7D" | "30D" | "ALL";

export const AnalyticsDashboard: React.FC = () => {
    const { tasks, completions } = useTasks();
    const [range, setRange] = useState<TimeRange>("7D");

    // Calculate Date Range
    const { allDates } = useMemo(() => {
        const today = startOfDay(new Date());
        let start = subDays(today, 6); // Default 7D
        const end = today;

        if (range === "1D") {
            start = today;
        } else if (range === "7D") {
            start = subDays(today, 6);
        } else if (range === "30D") {
            start = subDays(today, 29);
        } else if (range === "ALL") {
            // Find earliest date in completions or default to 30d ago
            let minDate = subDays(today, 29);
            Object.values(completions).forEach(taskMap => {
                Object.keys(taskMap).forEach(dateStr => {
                    const d = parseISO(dateStr);
                    if (isValid(d) && d < minDate) minDate = d;
                });
            });
            start = minDate;
        }

        // Safety check to ensure start <= end
        if (start > end) start = end;

        const dates = eachDayOfInterval({ start, end });
        return { allDates: dates };
    }, [range, completions]);

    // Data Processing for Chart
    const chartData = useMemo(() => {
        return allDates.map(date => {
            const dateKey = format(date, "yyyy-MM-dd");
            let checks = 0;
            tasks.forEach(task => {
                if (completions[task.id]?.[dateKey]) {
                    checks++;
                }
            });
            return {
                date: format(date, range === "1D" ? "HH:mm" : (range === "30D" || range === "ALL") ? "MMM dd" : "EEE"),
                fullDate: format(date, "yyyy-MM-dd"), // for tooltip
                checks,
                total: tasks.length,
                percentage: tasks.length > 0 ? Math.round((checks / tasks.length) * 100) : 0
            };
        });
    }, [allDates, tasks, completions, range]);

    // Summary Stats
    const stats = useMemo(() => {
        let totalChecks = 0;
        // Possible checks: sum of active tasks for each day. 
        // For simplicity, we assume current tasks existed for the whole period. 
        // PROPER would be to track creation date, but MVP assumes constant current task list.
        let possibleChecks = tasks.length * allDates.length;

        allDates.forEach(date => {
            const dateKey = format(date, "yyyy-MM-dd");
            tasks.forEach(task => {
                if (completions[task.id]?.[dateKey]) totalChecks++;
            });
        });

        const rate = possibleChecks > 0 ? Math.round((totalChecks / possibleChecks) * 100) : 0;

        return {
            totalChecks,
            possibleChecks,
            rate
        };
    }, [allDates, tasks, completions]);

    return (
        <div className="max-w-6xl mx-auto py-8 px-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Analytics</h2>
                    <p className="text-slate-500 text-sm">Track your consistency over time</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
                    {(["1D", "7D", "30D", "ALL"] as TimeRange[]).map(r => (
                        <button key={r} onClick={() => setRange(r)} className={clsx(
                            "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                            range === r ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}>
                            {r === "ALL" ? "All Time" : r}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <AnalyticsCard
                    title="Consistency Rate"
                    value={`${stats.rate}%`}
                    subtitle="Completion rate for this period"
                />
                <AnalyticsCard
                    title="Checks Completed"
                    value={stats.totalChecks}
                    subtitle={`Out of ${stats.possibleChecks} possible`}
                />
                <AnalyticsCard
                    title="Active Habits"
                    value={tasks.length}
                    subtitle="Habits currently being tracked"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Activity Chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-80">
                    <h3 className="text-sm font-semibold text-slate-700 mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Activity Volume
                    </h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: range === "30D" || range === "ALL" ? 20 : 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="date"
                                stroke="#94a3b8"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                interval={range === "ALL" ? "preserveStartEnd" : 0}
                                minTickGap={10}
                                angle={range === "30D" || range === "ALL" ? -90 : 0}
                                textAnchor={range === "30D" || range === "ALL" ? "end" : "middle"}
                                height={range === "30D" || range === "ALL" ? 60 : 30}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '12px',
                                    border: 'none',
                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                    padding: '12px',
                                    zIndex: 100
                                }}
                                cursor={{ fill: '#f8fafc' }}
                            />
                            <Bar dataKey="checks" radius={[6, 6, 0, 0]} maxBarSize={60} animationDuration={1000}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={
                                        entry.checks >= entry.total && entry.total > 0 ? "#10b981" : "#6366f1"
                                    } />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Consistency Trend Chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-80">
                    <h3 className="text-sm font-semibold text-slate-700 mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Consistency Trend
                    </h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: range === "30D" || range === "ALL" ? 20 : 0 }}>
                            <defs>
                                <linearGradient id="colorConsistency" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="date"
                                stroke="#94a3b8"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                interval={range === "ALL" ? "preserveStartEnd" : 0}
                                minTickGap={10}
                                angle={range === "30D" || range === "ALL" ? -90 : 0}
                                textAnchor={range === "30D" || range === "ALL" ? "end" : "middle"}
                                height={range === "30D" || range === "ALL" ? 60 : 30}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                domain={[0, 100]}
                                unit="%"
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '12px',
                                    border: 'none',
                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                    padding: '12px',
                                    zIndex: 100
                                }}
                                formatter={(value: number | undefined) => [`${value}%`, 'Consistency']}
                            />
                            <Area
                                type="monotone"
                                dataKey="percentage"
                                stroke="#10b981"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorConsistency)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
