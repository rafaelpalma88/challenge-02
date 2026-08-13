import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Todo } from '../types';

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, changes: { title: string; description?: string }) => void;
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
});

export function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [draftTitle, setDraftTitle] = useState(todo.title);
    const [draftDescription, setDraftDescription] = useState(todo.description ?? '');

    function startEditing() {
        setDraftTitle(todo.title);
        setDraftDescription(todo.description ?? '');
        setIsEditing(true);
    }

    function cancelEditing() {
        setIsEditing(false);
    }

    function saveEditing(event: FormEvent) {
        event.preventDefault();
        const title = draftTitle.trim();
        if (!title) return;

        onUpdate(todo.id, { title, description: draftDescription.trim() || undefined });
        setIsEditing(false);
    }

    if (isEditing) {
        return (
            <li className="todo-item todo-item--editing">
                <form className="todo-item__edit-form" onSubmit={saveEditing}>
                    <input
                        className="todo-item__edit-input"
                        type="text"
                        value={draftTitle}
                        onChange={(e) => setDraftTitle(e.target.value)}
                        aria-label="Edit title"
                        autoFocus
                    />
                    <input
                        className="todo-item__edit-input"
                        type="text"
                        value={draftDescription}
                        onChange={(e) => setDraftDescription(e.target.value)}
                        aria-label="Edit description"
                        placeholder="Description (optional)"
                    />
                    <div className="todo-item__edit-actions">
                        <button type="submit" className="todo-item__save-btn">
                            Save
                        </button>
                        <button type="button" className="todo-item__cancel-btn" onClick={cancelEditing}>
                            Cancel
                        </button>
                    </div>
                </form>
            </li>
        );
    }

    return (
        <li className={`todo-item${todo.completed ? ' todo-item--done' : ''}`}>
            <label className="todo-item__checkbox-wrap">
                <input
                    type="checkbox"
                    className="todo-item__checkbox"
                    checked={todo.completed}
                    onChange={() => onToggle(todo.id)}
                    aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
                />
                <span className="todo-item__checkbox-mark" aria-hidden="true" />
            </label>

            <div className="todo-item__body">
                <p className="todo-item__title">{todo.title}</p>
                {todo.description && <p className="todo-item__description">{todo.description}</p>}
            </div>

            <span className="todo-item__timestamp">{dateFormatter.format(todo.created_at)}</span>

            <div className="todo-item__actions">
                <button type="button" className="todo-item__icon-btn" onClick={startEditing} aria-label="Edit entry">
                    Edit
                </button>
                <button
                    type="button"
                    className="todo-item__icon-btn todo-item__icon-btn--danger"
                    onClick={() => onDelete(todo.id)}
                    aria-label="Delete entry"
                >
                    Delete
                </button>
            </div>

            {todo.completed && (
                <span className="todo-item__stamp" aria-hidden="true">
                    Done
                </span>
            )}
        </li>
    );
}