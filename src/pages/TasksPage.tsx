// Tasks page - main task management view with filtering and modals
import { useState, useMemo } from 'react';
import { Plus, ListTodo, CheckCheck } from 'lucide-react';
import { useTasks } from '../contexts/TasksContext';
import type { Task } from '../types';
import { TaskCard } from '../components/tasks/TaskCard';
import { AddTaskModal } from '../components/tasks/AddTaskModal';
import { EditTaskModal } from '../components/tasks/EditTaskModal';
import { FilterBar, type FilterStatus, type FilterPriority } from '../components/tasks/FilterBar';

export function TasksPage() {
    const { tasks, categories, loading } = useTasks();
    const [showAdd, setShowAdd] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<FilterStatus>('all');
    const [priority, setPriority] = useState<FilterPriority>('all');
    const [categoryId, setCategoryId] = useState('');

    // Apply all filters
    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const matchSearch = !search ||
                task.title.toLowerCase().includes(search.toLowerCase()) ||
                task.description?.toLowerCase().includes(search.toLowerCase());
            const matchStatus =
                status === 'all' ||
                (status === 'pending' && !task.completed) ||
                (status === 'completed' && task.completed);
            const matchPriority = priority === 'all' || task.priority === priority;
            const matchCategory = !categoryId || task.category_id === categoryId;
            return matchSearch && matchStatus && matchPriority && matchCategory;
        });
    }, [tasks, search, status, priority, categoryId]);

    const pendingTasks = filteredTasks.filter(t => !t.completed);
    const completedTasks = filteredTasks.filter(t => t.completed);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Page header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Mis Tareas</h1>
                    <p className="text-slate-400 text-sm mt-0.5">{tasks.length} tarea{tasks.length !== 1 ? 's' : ''} en total</p>
                </div>
                <button
                    onClick={() => setShowAdd(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-xl transition shadow-lg shadow-indigo-500/25 text-sm"
                    id="add-task-btn"
                >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Nueva Tarea</span>
                    <span className="sm:hidden">Nueva</span>
                </button>
            </div>

            {/* Filter bar */}
            <div className="mb-6">
                <FilterBar
                    search={search} onSearchChange={setSearch}
                    status={status} onStatusChange={setStatus}
                    priority={priority} onPriorityChange={setPriority}
                    categoryId={categoryId} onCategoryChange={setCategoryId}
                    categories={categories}
                />
            </div>

            {/* Empty state */}
            {filteredTasks.length === 0 && (
                <div className="text-center py-16">
                    <ListTodo className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 font-medium">
                        {tasks.length === 0 ? '¡Empieza creando tu primera tarea!' : 'No se encontraron tareas con estos filtros.'}
                    </p>
                    {tasks.length === 0 && (
                        <button
                            onClick={() => setShowAdd(true)}
                            className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition"
                        >
                            + Crear primera tarea
                        </button>
                    )}
                </div>
            )}

            {/* Pending tasks */}
            {pendingTasks.length > 0 && (
                <section className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <ListTodo className="w-4 h-4 text-amber-400" />
                        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                            Pendientes ({pendingTasks.length})
                        </h2>
                    </div>
                    <div className="space-y-2.5">
                        {pendingTasks.map(task => (
                            <TaskCard key={task.id} task={task} onEdit={setEditingTask} />
                        ))}
                    </div>
                </section>
            )}

            {/* Completed tasks */}
            {completedTasks.length > 0 && (
                <section>
                    <div className="flex items-center gap-2 mb-3">
                        <CheckCheck className="w-4 h-4 text-green-400" />
                        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                            Completadas ({completedTasks.length})
                        </h2>
                    </div>
                    <div className="space-y-2.5">
                        {completedTasks.map(task => (
                            <TaskCard key={task.id} task={task} onEdit={setEditingTask} />
                        ))}
                    </div>
                </section>
            )}

            {/* Modals */}
            {showAdd && <AddTaskModal onClose={() => setShowAdd(false)} />}
            {editingTask && <EditTaskModal task={editingTask} onClose={() => setEditingTask(null)} />}
        </div>
    );
}
