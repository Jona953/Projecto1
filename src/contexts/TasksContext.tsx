// TasksContext: manages tasks, categories, realtime subscriptions, and gamification
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { Task, Category, Profile } from '../types';

interface TasksContextType {
    tasks: Task[];
    categories: Category[];
    profile: Profile | null;
    loading: boolean;
    addTask: (task: Omit<Task, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
    updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    toggleComplete: (task: Task) => Promise<void>;
    addCategory: (name: string, color: string) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

// XP constants for gamification
const XP_PER_TASK = 10;
const XP_PER_LEVEL = 100;

export function TasksProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch all data for the current user
    const fetchData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        const [tasksRes, categoriesRes, profileRes] = await Promise.all([
            supabase
                .from('tasks')
                .select('*, categories(*)')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false }),
            supabase.from('categories').select('*').eq('user_id', user.id),
            supabase.from('profiles').select('*').eq('id', user.id).single(),
        ]);

        if (tasksRes.data) setTasks(tasksRes.data as Task[]);
        if (categoriesRes.data) setCategories(categoriesRes.data);
        if (profileRes.data) setProfile(profileRes.data);
        setLoading(false);
    }, [user]);

    useEffect(() => {
        if (!user) {
            setTasks([]);
            setCategories([]);
            setProfile(null);
            setLoading(false);
            return;
        }

        fetchData();

        // Realtime subscription to tasks table - updates UI automatically across devices
        const channel = supabase
            .channel('tasks-realtime')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'tasks', filter: `user_id=eq.${user.id}` },
                (payload) => {
                    setTasks(prev => [payload.new as Task, ...prev]);
                }
            )
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'tasks', filter: `user_id=eq.${user.id}` },
                (payload) => {
                    setTasks(prev => prev.map(t => t.id === payload.new.id ? { ...t, ...payload.new as Task } : t));
                }
            )
            .on(
                'postgres_changes',
                { event: 'DELETE', schema: 'public', table: 'tasks' },
                (payload) => {
                    setTasks(prev => prev.filter(t => t.id !== payload.old.id));
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [user, fetchData]);

    // Add a new task
    const addTask = async (task: Omit<Task, 'id' | 'user_id' | 'created_at'>) => {
        if (!user) return;
        await supabase.from('tasks').insert({ ...task, user_id: user.id });
    };

    // Update an existing task
    const updateTask = async (id: string, updates: Partial<Task>) => {
        await supabase.from('tasks').update(updates).eq('id', id);
    };

    // Delete a task
    const deleteTask = async (id: string) => {
        await supabase.from('tasks').delete().eq('id', id);
    };

    // Toggle complete and award XP if completing
    const toggleComplete = async (task: Task) => {
        const newCompleted = !task.completed;
        await supabase.from('tasks').update({ completed: newCompleted }).eq('id', task.id);

        // Award XP when marking as complete
        if (newCompleted && profile) {
            const newXp = profile.xp + XP_PER_TASK;
            const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
            const { data } = await supabase
                .from('profiles')
                .update({ xp: newXp, level: newLevel })
                .eq('id', user!.id)
                .select()
                .single();
            if (data) setProfile(data);
        } else if (!newCompleted && profile && profile.xp >= XP_PER_TASK) {
            // Deduct XP when un-completing
            const newXp = profile.xp - XP_PER_TASK;
            const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
            const { data } = await supabase
                .from('profiles')
                .update({ xp: newXp, level: newLevel })
                .eq('id', user!.id)
                .select()
                .single();
            if (data) setProfile(data);
        }
    };

    // Add a new category
    const addCategory = async (name: string, color: string) => {
        if (!user) return;
        await supabase.from('categories').insert({ name, color, user_id: user.id });
        const { data } = await supabase.from('categories').select('*').eq('user_id', user.id);
        if (data) setCategories(data);
    };

    // Delete a category
    const deleteCategory = async (id: string) => {
        await supabase.from('categories').delete().eq('id', id);
        setCategories(prev => prev.filter(c => c.id !== id));
    };

    return (
        <TasksContext.Provider value={{
            tasks, categories, profile, loading,
            addTask, updateTask, deleteTask, toggleComplete,
            addCategory, deleteCategory,
        }}>
            {children}
        </TasksContext.Provider>
    );
}

export function useTasks() {
    const context = useContext(TasksContext);
    if (!context) throw new Error('useTasks must be used within TasksProvider');
    return context;
}
