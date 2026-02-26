// Header component with theme toggle, user info, and hamburger menu for mobile
import { Moon, Sun, LogOut, Menu, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useTasks } from '../../contexts/TasksContext';

interface HeaderProps {
    onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const { user, signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { profile, tasks } = useTasks();

    const pendingCount = tasks.filter(t => !t.completed).length;
    const username = profile?.username || user?.email?.split('@')[0] || 'Usuario';

    return (
        <header className="h-16 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
            {/* Left: hamburger (mobile) + page title */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-slate-800"
                    aria-label="Abrir menú"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <span className="hidden sm:block text-slate-400 text-sm">
                    Bienvenido, <span className="text-white font-medium">{username}</span>
                </span>
            </div>

            {/* Right: pending badge, theme toggle, logout */}
            <div className="flex items-center gap-2">
                {/* Pending tasks notification */}
                {pendingCount > 0 && (
                    <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-medium px-3 py-1.5 rounded-full">
                        <Bell className="w-3.5 h-3.5" />
                        <span>{pendingCount} pendiente{pendingCount > 1 ? 's' : ''}</span>
                    </div>
                )}

                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
                    className="text-slate-400 hover:text-white transition p-2 rounded-xl hover:bg-slate-800"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* User avatar + logout */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                            {username.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <button
                        onClick={signOut}
                        title="Cerrar sesión"
                        className="text-slate-400 hover:text-red-400 transition p-2 rounded-xl hover:bg-slate-800"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </header>
    );
}
