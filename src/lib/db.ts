import type { Todo } from '../types';

const DB_NAME = 'tally-db';
const DB_VERSION = 1;
const STORE_NAME = 'todos';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDatabase(): Promise<IDBDatabase> {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                store.createIndex('created_at', 'created_at', { unique: false });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });

    return dbPromise;
}

function withStore<T>(
    mode: IDBTransactionMode,
    run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
    return openDatabase().then(
        (db) =>
            new Promise<T>((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, mode);
                const store = tx.objectStore(STORE_NAME);
                const request = run(store);

                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            }),
    );
}

export const todosDb = {
    getAll(): Promise<Todo[]> {
        return withStore('readonly', (store) => store.getAll());
    },

    put(todo: Todo): Promise<Todo> {
        return withStore('readwrite', (store) => store.put(todo)).then(() => todo);
    },

    remove(id: string): Promise<void> {
        return withStore('readwrite', (store) => store.delete(id)).then(() => undefined);
    },

    /** Test-only escape hatch: forces the next call to re-open the connection. */
    _resetConnection(): void {
        dbPromise = null;
    },
};