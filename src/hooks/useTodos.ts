import { useEffect, useMemo, useState } from 'react';
import { todosDb } from '../lib/db';
import type { StatusFilter, Todo, TodoDraft } from '../types';

function createId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function useTodos() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState<StatusFilter>('all');

    useEffect(() => {
        let cancelled = false;

        todosDb
            .getAll()
            .then((stored) => {
                if (!cancelled) setTodos(stored);
            })
            .catch(() => {
                if (!cancelled) setError('Could not load your to-dos. Please reload the page.');
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    async function addTodo(draft: TodoDraft) {
        const title = draft.title.trim();
        if (!title) return;

        const todo: Todo = {
            id: createId(),
            title,
            description: draft.description?.trim() || undefined,
            created_at: Date.now(),
            completed: false,
        };

        try {
            await todosDb.put(todo);
            setTodos((prev) => [todo, ...prev]);
        } catch {
            setError('Could not save this to-do. Please try again.');
        }
    }

    async function updateTodo(id: string, changes: Partial<Omit<Todo, 'id' | 'created_at'>>) {
        const current = todos.find((todo) => todo.id === id);
        if (!current) return;

        const updated: Todo = { ...current, ...changes };

        try {
            await todosDb.put(updated);
            setTodos((prev) => prev.map((todo) => (todo.id === id ? updated : todo)));
        } catch {
            setError('Could not update this to-do. Please try again.');
        }
    }

    function toggleTodo(id: string) {
        const current = todos.find((todo) => todo.id === id);
        if (!current) return;
        return updateTodo(id, { completed: !current.completed });
    }

    async function deleteTodo(id: string) {
        try {
            await todosDb.remove(id);
            setTodos((prev) => prev.filter((todo) => todo.id !== id));
        } catch {
            setError('Could not delete this to-do. Please try again.');
        }
    }

    const filteredTodos = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        return todos
            .filter((todo) => {
                if (status === 'completed') return todo.completed;
                if (status === 'incomplete') return !todo.completed;
                return true;
            })
            .filter((todo) => {
                if (!normalizedQuery) return true;
                const haystack = `${todo.title} ${todo.description ?? ''}`.toLowerCase();
                return haystack.includes(normalizedQuery);
            })
            .sort((a, b) => b.created_at - a.created_at);
    }, [todos, query, status]);

    const counts = useMemo(
        () => ({
            total: todos.length,
            completed: todos.filter((t) => t.completed).length,
            incomplete: todos.filter((t) => !t.completed).length,
        }),
        [todos],
    );

    return {
        todos: filteredTodos,
        isLoading,
        error,
        counts,
        query,
        setQuery,
        status,
        setStatus,
        addTodo,
        updateTodo,
        toggleTodo,
        deleteTodo,
    };
}