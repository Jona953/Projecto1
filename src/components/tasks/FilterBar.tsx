// Filter bar for tasks page: search, filter by status, priority, category
import { Search, X } from 'lucide-react';
import type { Category } from '../../types';

export type FilterStatus = 'all' | 'pending' | 'completed';
export type FilterPriority = 'all' | 'low' | 'medium' | 'high';

interface FilterBarProps {
    search: string;
    onSearchChange: (v: string) => void;
    status: FilterStatus;
    onStatusChange: (v: FilterStatus) => void;
    priority: FilterPriority;
    onPriorityChange: (v: FilterPriority) => void;
    categoryId: string;
    onCategoryChange: (v: string) => void;
    categories: Category[];
}

export function FilterBar({
    search, onSearchChange,
    status, onStatusChange,
    priority, onPriorityChange,
    categoryId, onCategoryChange,
    categories,
}: FilterBarProps) {
    return (
        <div className="space-y-3">
            {/* Search input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    value={search}
                    onChange={e => onSearchChange(e.target.value)}
                    placeholder="Buscar tareas..."
                    className="w-full bg-slate-800/60 border border-slate-700/50 text-white placeholder-slate-500 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
                {search && (
                    <button
                        onClick={() => onSearchChange('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Filter chips */}
            <div className="flex flex-wrap gap-2">
                {/* Status filter */}
                {(['all', 'pending', 'completed'] as FilterStatus[]).map(s => (
                    <button
                        key={s}
                        onClick={() => onStatusChange(s)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${status === s
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                            }`}
                    >
                        {s === 'all' ? 'Todas' : s === 'pending' ? 'Pendientes' : 'Completadas'}
                    </button>
                ))}

                <div className="w-px bg-slate-700 mx-1" />

                {/* Priority filter */}
                {(['all', 'high', 'medium', 'low'] as FilterPriority[]).map(p => (
                    <button
                        key={p}
                        onClick={() => onPriorityChange(p)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${priority === p
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                            }`}
                    >
                        {p === 'all' ? 'Prioridad: Todas' : p === 'high' ? '🔴 Alta' : p === 'medium' ? '🟡 Media' : '🟢 Baja'}
                    </button>
                ))}

                {/* Category filter */}
                {categories.length > 0 && (
                    <>
                        <div className="w-px bg-slate-700 mx-1" />
                        <button
                            onClick={() => onCategoryChange('')}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${!categoryId
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                                }`}
                        >
                            Todas las categorías
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => onCategoryChange(cat.id)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${categoryId === cat.id
                                    ? 'text-white'
                                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border-slate-700'
                                    }`}
                                style={categoryId === cat.id ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}
