export interface Todo {
    id: string;
    title: string;
    description?: string;
    created_at: number;
    completed: boolean;
}

export type FilterStatus = 'all' | 'completed' | 'incomplete';