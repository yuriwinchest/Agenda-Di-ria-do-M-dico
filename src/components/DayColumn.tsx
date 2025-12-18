import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '../lib/utils';

interface DayColumnProps {
    id: string; // "YYYY-MM-DD"
    children: React.ReactNode;
    className?: string;
    onClick?: (e?: any) => void;
}

export const DayColumn = ({ id, children, className, onClick }: DayColumnProps) => {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
        data: { dateStr: id }
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(className, isOver && "bg-blue-50/50 ring-2 ring-inset ring-blue-200 transition-colors")}
            onClick={onClick}
        >
            {children}
        </div>
    );
};
