import React from "react";
import { format, isToday } from "date-fns";
import clsx from "clsx";

interface DayHeaderProps {
    date: Date;
}

export const DayHeader: React.FC<DayHeaderProps> = ({ date }) => {
    return (
        <div className={clsx(
            "flex flex-col items-center justify-center min-w-[60px] h-12 border-b border-slate-200",
            isToday(date) ? "text-blue-600 font-semibold" : "text-slate-500"
        )}>
            <span className="text-xs uppercase">{format(date, "EEE")}</span>
            <span className="text-sm">{format(date, "d")}</span>
        </div>
    );
};
