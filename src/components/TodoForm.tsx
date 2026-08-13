import { useState } from 'react';
import type { FormEvent } from 'react';
import type { TodoDraft } from '../types';

interface TodoFormProps {
    onAdd: (draft: TodoDraft) => void;
}

export function TodoForm({ onAdd }: TodoFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [touched, setTouched] = useState(false);

    const isTitleEmpty = title.trim().length === 0;

    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setTouched(true);
        if (isTitleEmpty) return;

        onAdd({ title, description });
        setTitle('');
        setDescription('');
        setTouched(false);
    }

    return (
        <form className="todo-form" onSubmit={handleSubmit} noValidate>
            <div className="todo-form__row">
                <div className="todo-form__field todo-form__field--grow">
                    <label htmlFor="todo-title" className="todo-form__label">
                        Title
                    </label>
                    <input
                        id="todo-title"
                        className="todo-form__input"
                        type="text"
                        placeholder="What needs doing?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={() => setTouched(true)}
                        aria-invalid={touched && isTitleEmpty}
                        aria-describedby={touched && isTitleEmpty ? 'todo-title-error' : undefined}
                    />
                    {touched && isTitleEmpty && (
                        <p id="todo-title-error" className="todo-form__error" role="alert">
                            Give this entry a title before adding it.
                        </p>
                    )}
                </div>

                <button type="submit" className="todo-form__submit">
                    Add entry
                </button>
            </div>

            <div className="todo-form__field">
                <label htmlFor="todo-description" className="todo-form__label">
                    Description <span className="todo-form__optional">(optional)</span>
                </label>
                <input
                    id="todo-description"
                    className="todo-form__input"
                    type="text"
                    placeholder="Any extra detail worth noting"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
        </form>
    );
}