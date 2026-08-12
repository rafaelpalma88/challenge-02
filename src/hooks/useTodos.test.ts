import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { IDBFactory } from 'fake-indexeddb';
import { useTodos } from './useTodos';
import { todosDb } from '../lib/db';

beforeEach(() => {
    indexedDB = new IDBFactory();
    todosDb._resetConnection();
});

async function renderLoadedTodos() {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    return result;
}

describe('useTodos', () => {
    it('starts empty once loading finishes', async () => {
        const result = await renderLoadedTodos();
        expect(result.current.todos).toEqual([]);
        expect(result.current.counts).toEqual({ total: 0, completed: 0, incomplete: 0 });
    });

    it('creates a todo and exposes it immediately', async () => {
        const result = await renderLoadedTodos();

        await act(async () => {
            await result.current.addTodo({ title: 'Buy coffee beans', description: 'Dark roast' });
        });

        expect(result.current.todos).toHaveLength(1);
        expect(result.current.todos[0]).toMatchObject({
            title: 'Buy coffee beans',
            description: 'Dark roast',
            completed: false,
        });
        expect(result.current.counts).toEqual({ total: 1, completed: 0, incomplete: 1 });
    });

    it('ignores creation when the title is empty or whitespace', async () => {
        const result = await renderLoadedTodos();

        await act(async () => {
            await result.current.addTodo({ title: '   ' });
        });

        expect(result.current.todos).toHaveLength(0);
    });

    it('updates a todo title and description', async () => {
        const result = await renderLoadedTodos();

        await act(async () => {
            await result.current.addTodo({ title: 'Draft proposal' });
        });
        const id = result.current.todos[0].id;

        await act(async () => {
            await result.current.updateTodo(id, { title: 'Draft proposal v2' });
        });

        expect(result.current.todos[0].title).toBe('Draft proposal v2');
    });

    it('toggles completion status', async () => {
        const result = await renderLoadedTodos();

        await act(async () => {
            await result.current.addTodo({ title: 'Ship feature' });
        });
        const id = result.current.todos[0].id;

        await act(async () => {
            await result.current.toggleTodo(id);
        });

        expect(result.current.todos[0].completed).toBe(true);
        expect(result.current.counts).toEqual({ total: 1, completed: 1, incomplete: 0 });
    });

    it('deletes a todo', async () => {
        const result = await renderLoadedTodos();

        await act(async () => {
            await result.current.addTodo({ title: 'Fix bug' });
        });
        const id = result.current.todos[0].id;

        await act(async () => {
            await result.current.deleteTodo(id);
        });

        expect(result.current.todos).toHaveLength(0);
    });

    it('filters by status', async () => {
        const result = await renderLoadedTodos();

        await act(async () => {
            await result.current.addTodo({ title: 'Task A' });
            await result.current.addTodo({ title: 'Task B' });
        });
        const [first] = result.current.todos.slice().sort((a, b) => a.title.localeCompare(b.title));

        await act(async () => {
            await result.current.toggleTodo(first.id);
        });

        act(() => result.current.setStatus('completed'));
        expect(result.current.todos).toHaveLength(1);
        expect(result.current.todos[0].title).toBe('Task A');

        act(() => result.current.setStatus('incomplete'));
        expect(result.current.todos).toHaveLength(1);
        expect(result.current.todos[0].title).toBe('Task B');

        act(() => result.current.setStatus('all'));
        expect(result.current.todos).toHaveLength(2);
    });

    it('filters by title or description text match', async () => {
        const result = await renderLoadedTodos();

        await act(async () => {
            await result.current.addTodo({ title: 'Buy coffee beans' });
            await result.current.addTodo({ title: 'Book dentist', description: 'Ask about coffee stains' });
            await result.current.addTodo({ title: 'Read a book' });
        });

        act(() => result.current.setQuery('coffee'));
        expect(result.current.todos.map((t) => t.title).sort()).toEqual([
            'Book dentist',
            'Buy coffee beans',
        ]);

        act(() => result.current.setQuery('book'));
        expect(result.current.todos.map((t) => t.title).sort()).toEqual([
            'Book dentist',
            'Read a book',
        ]);
    });
});