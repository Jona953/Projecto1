// Dashboard page - stats, charts, badges, and overview
import { useMemo } from 'react';
import { CheckCircle2, Clock, Zap, Trophy, TrendingUp, AlertCircle } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { format, parseISO, subDays, isPast } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTasks } from '../contexts/TasksContext';

const BADGE_CONFIG = [
    { id: 'first', name: 'Primer Paso', icon: '🎯', desc: 'Completa tu primera tarea', xpReq: 10 },
    { id: 'five', name: 'En Racha', icon: '🔥', desc: 'Alcanza 50 XP', xpReq: 50 },
    { id: 'hundred', name: 'Centurión', icon: '⚡', desc: 'Alcanza 100 XP', xpReq: 100 },
    { id: 'master', name: 'Maestro', icon: '👑', desc: 'Alcanza 500 XP', xpReq: 500 },
];

const PIE_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm shadow-lg">
                <p className="text-slate-400">{label}</p>
                <p className="text-white font-semibold">{payload[0].value} tareas</p>
            </div>
        );
    }
    return null;
};

export function DashboardPage() {
    const { tasks, categories, profile } = useTasks();

    const completedTasks = tasks.filter(t => t.completed);
    const pendingTasks = tasks.filter(t => !t.completed);
    const overdueTasks = pendingTasks.filter(t => t.due_date && isPast(parseISO(t.due_date)));

    // Tasks created per day (last 7 days) for bar chart
    const activityData = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const day = subDays(new Date(), 6 - i);
            const dayStr = format(day, 'yyyy-MM-dd');
            const count = tasks.filter(t => t.created_at.startsWith(dayStr)).length;
            return { day: format(day, 'EEE', { locale: es }), count };
        });
    }, [tasks]);

    // Tasks by category for pie chart
    const categoryData = useMemo(() => {
        const grouped = categories.map(cat => ({
            name: cat.name,
            value: tasks.filter(t => t.category_id === cat.id).length,
            color: cat.color,
        })).filter(d => d.value > 0);
        const uncategorized = tasks.filter(t => !t.category_id).length;
        if (uncategorized > 0) grouped.push({ name: 'Sin categoría', value: uncategorized, color: '#64748b' });
        return grouped;
    }, [tasks, categories]);

    const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

    const stats = [
        { label: 'Total', value: tasks.length, icon: TrendingUp, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
        { label: 'Pendientes', value: pendingTasks.length, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
        { label: 'Completadas', value: completedTasks.length, icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
        { label: 'Vencidas', value: overdueTasks.length, icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-slate-400 text-sm mt-0.5">Resumen de tu productividad</p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className={`bg-slate-800/60 border ${bg} rounded-2xl p-5`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${bg.replace('border-', 'bg-').split(' ')[0]}`}>
                            <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                        <p className="text-3xl font-bold text-white">{value}</p>
                        <p className="text-slate-400 text-sm mt-0.5">{label}</p>
                    </div>
                ))}
            </div>

            {/* Completion rate + XP */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Completion rate */}
                <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Tasa de completado</h3>
                    <div className="flex items-center gap-4">
                        <div className="relative w-24 h-24 flex-shrink-0">
                            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" stroke="#1e293b" strokeWidth="12" fill="none" />
                                <circle
                                    cx="50" cy="50" r="40"
                                    stroke="#6366f1"
                                    strokeWidth="12"
                                    fill="none"
                                    strokeDasharray={`${2 * Math.PI * 40}`}
                                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - completionRate / 100)}`}
                                    strokeLinecap="round"
                                    className="transition-all duration-700"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xl font-bold text-white">{completionRate}%</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">{completedTasks.length} de {tasks.length} tareas completadas</p>
                            {completionRate >= 80 && <p className="text-green-400 text-sm mt-1">🎉 ¡Excelente progreso!</p>}
                            {completionRate >= 50 && completionRate < 80 && <p className="text-amber-400 text-sm mt-1">💪 ¡Sigue así!</p>}
                            {completionRate < 50 && tasks.length > 0 && <p className="text-slate-400 text-sm mt-1">Tienes tareas por completar</p>}
                        </div>
                    </div>
                </div>

                {/* XP / Level */}
                {profile && (
                    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
                        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Tu Progreso</h3>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-lg">Nivel {profile.level}</p>
                                <p className="text-slate-400 text-sm">{profile.xp} XP acumulados</p>
                            </div>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
                            <div
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-700"
                                style={{ width: `${(profile.xp % 100)}%` }}
                            />
                        </div>
                        <p className="text-slate-500 text-xs">{profile.xp % 100}/100 XP para nivel {profile.level + 1}</p>
                    </div>
                )}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Activity bar chart */}
                <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Actividad (7 días)</h3>
                    <ResponsiveContainer width="100%" height={160}>
                        <BarChart data={activityData} barCategoryGap="30%">
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis hide allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#6366f120' }} />
                            <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Category pie chart */}
                <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Por Categoría</h3>
                    {categoryData.length === 0 ? (
                        <div className="flex items-center justify-center h-40 text-slate-500 text-sm">
                            Sin datos aún
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={160}>
                            <PieChart>
                                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                                    {categoryData.map((entry, i) => (
                                        <Cell key={entry.name} fill={entry.color || PIE_COLORS[i % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend
                                    formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{value}</span>}
                                />
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Badges */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Logros</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {BADGE_CONFIG.map(badge => {
                        const earned = (profile?.xp || 0) >= badge.xpReq;
                        return (
                            <div
                                key={badge.id}
                                className={`rounded-xl p-4 text-center border ${earned
                                        ? 'bg-indigo-500/10 border-indigo-500/30'
                                        : 'bg-slate-700/30 border-slate-700/30 opacity-50'
                                    }`}
                            >
                                <div className="text-3xl mb-2">{badge.icon}</div>
                                <p className={`text-sm font-semibold ${earned ? 'text-white' : 'text-slate-500'}`}>{badge.name}</p>
                                <p className="text-slate-500 text-xs mt-0.5">{badge.desc}</p>
                                {earned && (
                                    <span className="inline-block mt-2 text-xs text-indigo-400 font-medium">✓ Ganado</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
