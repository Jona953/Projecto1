// Categories management page - add, delete, and view categories with task counts
import { useState } from 'react';
import { Plus, Trash2, Tag, Loader2 } from 'lucide-react';
import { useTasks } from '../contexts/TasksContext';

const PRESET_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899'];
const DEFAULT_CATEGORIES = [
    { name: 'Trabajo', color: '#6366f1' },
    { name: 'Personal', color: '#10b981' },
    { name: 'Estudio', color: '#f59e0b' },
];

export function CategoriesPage() {
    const { categories, addCategory, deleteCategory, tasks } = useTasks();
    const [name, setName] = useState('');
    const [color, setColor] = useState('#6366f1');
    const [loading, setLoading] = useState(false);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        setLoading(true);
        await addCategory(name.trim(), color);
        setName('');
        setLoading(false);
    };

    const handleAddPreset = async (preset: { name: string; color: string }) => {
        const exists = categories.some(c => c.name.toLowerCase() === preset.name.toLowerCase());
        if (exists) return;
        setLoading(true);
        await addCategory(preset.name, preset.color);
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Categorías</h1>
                <p className="text-slate-400 text-sm mt-0.5">Organiza tus tareas por grupos</p>
            </div>

            {/* Quick presets */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
                <h2 className="text-sm font-semibold text-slate-300 mb-3">Categorías predeterminadas</h2>
                <div className="flex flex-wrap gap-2">
                    {DEFAULT_CATEGORIES.map(preset => {
                        const alreadyAdded = categories.some(c => c.name.toLowerCase() === preset.name.toLowerCase());
                        return (
                            <button
                                key={preset.name}
                                onClick={() => handleAddPreset(preset)}
                                disabled={alreadyAdded || loading}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                                style={{
                                    backgroundColor: `${preset.color}20`,
                                    borderColor: `${preset.color}40`,
                                    color: preset.color,
                                }}
                            >
                                <Tag className="w-3.5 h-3.5" />
                                {preset.name}
                                {alreadyAdded && ' ✓'}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Custom category form */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
                <h2 className="text-sm font-semibold text-slate-300 mb-4">Crear categoría personalizada</h2>
                <form onSubmit={handleAdd} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Nombre</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            placeholder="Ej: Fitness, Hogar..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Color</label>
                        <div className="flex flex-wrap gap-2">
                            {PRESET_COLORS.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    className="w-8 h-8 rounded-full transition-all hover:scale-110"
                                    style={{
                                        backgroundColor: c,
                                        outline: color === c ? `3px solid ${c}` : 'none',
                                        outlineOffset: '2px',
                                    }}
                                />
                            ))}
                            <input
                                type="color"
                                value={color}
                                onChange={e => setColor(e.target.value)}
                                className="w-8 h-8 rounded-full cursor-pointer bg-transparent border-0"
                                title="Color personalizado"
                            />
                        </div>
                    </div>

                    {/* Preview */}
                    {name && (
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400 text-sm">Vista previa:</span>
                            <span
                                className="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full border font-medium"
                                style={{ backgroundColor: `${color}20`, color, borderColor: `${color}40` }}
                            >
                                <Tag className="w-3.5 h-3.5" />
                                {name}
                            </span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!name.trim() || loading}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-medium px-4 py-2.5 rounded-xl transition text-sm"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Crear categoría
                    </button>
                </form>
            </div>

            {/* Categories list */}
            {categories.length > 0 && (
                <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
                    <h2 className="text-sm font-semibold text-slate-300 mb-4">Tus categorías ({categories.length})</h2>
                    <div className="space-y-2">
                        {categories.map(cat => {
                            const taskCount = tasks.filter(t => t.category_id === cat.id).length;
                            return (
                                <div
                                    key={cat.id}
                                    className="flex items-center justify-between p-3 rounded-xl bg-slate-700/30 border border-slate-700/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cat.color}25` }}>
                                            <Tag className="w-4 h-4" style={{ color: cat.color }} />
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-medium">{cat.name}</p>
                                            <p className="text-slate-500 text-xs">{taskCount} tarea{taskCount !== 1 ? 's' : ''}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteCategory(cat.id)}
                                        className="text-slate-500 hover:text-red-400 transition p-1.5 rounded-lg hover:bg-red-500/10"
                                        aria-label="Eliminar categoría"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {categories.length === 0 && (
                <div className="text-center py-10 text-slate-500">
                    <Tag className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>Aún no tienes categorías. ¡Crea una arriba!</p>
                </div>
            )}
        </div>
    );
}
