import { beforeEach, describe, expect, it } from 'vitest';
import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { todosDb } from './db';
import type { Todo } from '../types';

function makeTodo(overrides: Partial<Todo> = {}): Todo {
    return {
        id: crypto.randomUUID(),
        title: 'Buy coffee beans',
        description: undefined,
        created_at: Date.now(),
        completed: false,
        ...overrides,
    };
}

beforeEach(() => {
    indexedDB = new IDBFactory();
    todosDb._resetConnection();
});

describe('todosDb', () => {
    it('returns an empty list when nothing was stored yet', async () => {
        await expect(todosDb.getAll()).resolves.toEqual([]);
    });

    it('persists a todo and returns it from getAll', async () => {
        const todo = makeTodo({ title: 'Write README' });

        await todosDb.put(todo);
        const all = await todosDb.getAll();

        expect(all).toHaveLength(1);
        expect(all[0]).toEqual(todo);
    });

    it('overwrites an existing todo when put is called with the same id', async () => {
        const todo = makeTodo({ title: 'Draft proposal' });
        await todosDb.put(todo);

        const updated: Todo = { ...todo, title: 'Draft proposal (v2)', completed: true };
        await todosDb.put(updated);

        const all = await todosDb.getAll();
        expect(all).toHaveLength(1);
        expect(all[0].title).toBe('Draft proposal (v2)');
        expect(all[0].completed).toBe(true);
    });

    it('removes a todo by id', async () => {
        const first = makeTodo({ title: 'Ship feature' });
        const second = makeTodo({ title: 'Fix bug' });
        await todosDb.put(first);
        await todosDb.put(second);

        await todosDb.remove(first.id);
        const all = await todosDb.getAll();

        expect(all).toHaveLength(1);
        expect(all[0].id).toBe(second.id);
    });
});