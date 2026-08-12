export interface Todo {
    id: string;
    title: string;
    description?: string;
    created_at: number;
    completed: boolean;
}

export type StatusFilter = 'all' | 'completed' | 'incomplete';

export interface TodoDraft {
    title: string;
    description?: string;
}