import type { StatusFilter, Todo } from '../types';
import { TodoItem } from './TodoItem';

interface TodoListProps {
    todos: Todo[];
    hasAnyTodos: boolean;
    status: StatusFilter;
    query: string;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, changes: { title: string; description?: string }) => void;
}

function EmptyState({ hasAnyTodos, status, query }: Pick<TodoListProps, 'hasAnyTodos' | 'status' | 'query'>) {
    if (!hasAnyTodos) {
        return (
            <div className="empty-state">
                <p className="empty-state__title">Your ledger is empty.</p>
                <p className="empty-state__hint">Add your first entry above to get started.</p>
            </div>
        );
    }

    if (query.trim()) {
        return (
            <div className="empty-state">
                <p className="empty-state__title">No matches for “{query}”.</p>
                <p className="empty-state__hint">Try a different search term.</p>
            </div>
        );
    }

    const statusLabel = status === 'completed' ? 'done' : 'open';
    return (
        <div className="empty-state">
            <p className="empty-state__title">Nothing {statusLabel} right now.</p>
        </div>
    );
}

export function TodoList({
    todos,
    hasAnyTodos,
    status,
    query,
    onToggle,
    onDelete,
    onUpdate,
}: TodoListProps) {
    if (todos.length === 0) {
        return <EmptyState hasAnyTodos={hasAnyTodos} status={status} query={query} />;
    }

    return (
        <ul className="todo-list">
            {todos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                />
            ))}
        </ul>
    );
}