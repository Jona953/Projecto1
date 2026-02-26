// Types for the task manager application

export type Priority = 'low' | 'medium' | 'high';

export interface Profile {
    id: string;
    username: string | null;
    xp: number;
    level: number;
    created_at: string;
}

export interface Category {
    id: string;
    user_id: string;
    name: string;
    color: string;
    created_at: string;
}

export interface Task {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    completed: boolean;
    priority: Priority;
    category_id: string | null;
    due_date: string | null;
    created_at: string;
    // Joined field from categories
    categories?: Category | null;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    earned: boolean;
}
