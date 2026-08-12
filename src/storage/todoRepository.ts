import type { Todo } from "../types/todo";

export interface TodoRepository {
    getAll(): Promise<Todo[]>;
    create(todo: Todo): Promise<void>;
    update(id: string, updates: Partial<Todo>): Promise<void>;
    remove(id: string): Promise<void>;
}