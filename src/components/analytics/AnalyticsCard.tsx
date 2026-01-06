import React from "react";
import clsx from "clsx";

interface CardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    className?: string;
}

export const AnalyticsCard: React.FC<CardProps> = ({ title, value, subtitle, className }) => {
    return (
        <div className={clsx("p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col", className)}>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{title}</span>
            <span className="text-2xl font-bold text-slate-800">{value}</span>
            {subtitle && <span className="text-xs text-slate-400 mt-1">{subtitle}</span>}
        </div>
    );
};
