// Sidebar navigation component - responsive with mobile drawer support
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare2, X, Tag, Zap } from 'lucide-react';
import { useTasks } from '../../contexts/TasksContext';

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/tasks', icon: CheckSquare2, label: 'Mis Tareas' },
    { to: '/categories', icon: Tag, label: 'Categorías' },
];

export function Sidebar({ open, onClose }: SidebarProps) {
    const { profile, tasks } = useTasks();

    // Calculate XP progress towards next level
    const xpForNextLevel = 100;
    const xpProgress = profile ? ((profile.xp % xpForNextLevel) / xpForNextLevel) * 100 : 0;
    const completedTasks = tasks.filter(t => t.completed).length;

    const sidebarContent = (
        <div className="flex flex-col h-full bg-slate-900 border-r border-slate-700/50 w-64">
            {/* Logo */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <CheckSquare2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-white">TaskFlow</span>
                </div>
                <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white transition p-1">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`
                        }
                    >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* Gamification panel */}
            {profile && (
                <div className="p-4 border-t border-slate-700/50">
                    <div className="bg-slate-800/60 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                                <Zap className="w-4 h-4 text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-white font-semibold text-sm">Nivel {profile.level}</p>
                                <p className="text-slate-400 text-xs">{profile.xp} XP total</p>
                            </div>
                        </div>
                        {/* XP progress bar */}
                        <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                            <div
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${xpProgress}%` }}
                            />
                        </div>
                        <p className="text-slate-500 text-xs text-center">
                            {profile.xp % 100}/100 XP para nivel {profile.level + 1}
                        </p>
                        <div className="mt-3 flex justify-between text-center">
                            <div>
                                <p className="text-white font-bold text-lg">{completedTasks}</p>
                                <p className="text-slate-500 text-xs">Completadas</p>
                            </div>
                            <div>
                                <p className="text-white font-bold text-lg">{tasks.length - completedTasks}</p>
                                <p className="text-slate-500 text-xs">Pendientes</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <div className="hidden lg:flex flex-shrink-0">
                {sidebarContent}
            </div>

            {/* Mobile drawer overlay */}
            {open && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
                    <div className="relative z-10 flex-shrink-0">
                        {sidebarContent}
                    </div>
                </div>
            )}
        </>
    );
}
