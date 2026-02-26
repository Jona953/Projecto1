// TaskCard component - displays a single task with actions
import { useState } from 'react';
import { format, isPast, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Pencil, Trash2, Calendar, Flag, Tag } from 'lucide-react';
import { useTasks } from '../../contexts/TasksContext';
import type { Task } from '../../types';

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
}

// Priority badge styles
const priorityConfig = {
    high: { label: 'Alta', classes: 'bg-red-500/20 text-red-400 border-red-500/30' },
    medium: { label: 'Media', classes: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    low: { label: 'Baja', classes: 'bg-green-500/20 text-green-400 border-green-500/30' },
};

export function TaskCard({ task, onEdit }: TaskCardProps) {
    const { toggleComplete, deleteTask } = useTasks();
    const [deleting, setDeleting] = useState(false);
    const [toggling, setToggling] = useState(false);

    // Check if task due date has passed
    const isOverdue = task.due_date && !task.completed && isPast(parseISO(task.due_date));

    const handleToggle = async () => {
        setToggling(true);
        await toggleComplete(task);
        setToggling(false);
    };

    const handleDelete = async () => {
        if (!confirm('¿Eliminar esta tarea?')) return;
        setDeleting(true);
        await deleteTask(task.id);
    };

    const priorityInfo = priorityConfig[task.priority] || priorityConfig.medium;

    return (
        <div
            className={`group bg-slate-800/60 border rounded-xl p-4 transition-all duration-200 hover:bg-slate-800/80 hover:border-slate-600/80 ${task.completed
                ? 'border-slate-700/30 opacity-70'
                : isOverdue
                    ? 'border-red-500/40'
                    : 'border-slate-700/50'
                } ${deleting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
        >
            <div className="flex items-start gap-3">
                {/* Checkbox */}
                <button
                    onClick={handleToggle}
                    disabled={toggling}
                    className="flex-shrink-0 mt-0.5"
                    aria-label="Marcar tarea"
                >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${task.completed
                        ? 'bg-indigo-600 border-indigo-600'
                        : 'border-slate-500 hover:border-indigo-500'
                        }`}>
                        {task.completed && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>
                </button>

                {/* Task content */}
                <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm leading-snug ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                        {task.title}
                    </p>
                    {task.description && (
                        <p className="text-slate-400 text-sm mt-1 line-clamp-2">{task.description}</p>
                    )}

                    {/* Metadata row */}
                    <div className="flex flex-wrap items-center gap-2 mt-2.5">
                        {/* Priority */}
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${priorityInfo.classes}`}>
                            <Flag className="w-3 h-3" />
                            {priorityInfo.label}
                        </span>

                        {/* Category */}
                        {task.categories && (
                            <span
                                className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border"
                                style={{
                                    backgroundColor: `${task.categories.color}20`,
                                    color: task.categories.color,
                                    borderColor: `${task.categories.color}40`,
                                }}
                            >
                                <Tag className="w-3 h-3" />
                                {task.categories.name}
                            </span>
                        )}

                        {/* Due date */}
                        {task.due_date && (
                            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${isOverdue
                                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                : 'bg-slate-700/50 text-slate-400 border-slate-600/40'
                                }`}>
                                <Calendar className="w-3 h-3" />
                                {format(parseISO(task.due_date), 'd MMM', { locale: es })}
                                {isOverdue && ' (vencida)'}
                            </span>
                        )}
                    </div>
                </div>

                {/* Action buttons - visible on hover */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                        onClick={() => onEdit(task)}
                        className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition"
                        aria-label="Editar tarea"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                        aria-label="Eliminar tarea"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
