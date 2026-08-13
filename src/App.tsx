import { useTodos } from './hooks/useTodos';
import { TodoForm } from './components/TodoForm';
import './App.css';
import { SearchFilterBar } from './components/SearchFilterBar';
import { TodoList } from './components/TodoList';

function App() {
  const {
    todos,
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
  } = useTodos();

  return (
    <div className="page">
      <header className="page__header">
        <p className="page__eyebrow">Tally</p>
        <h1 className="page__title">Today's ledger</h1>
        <p className="page__subtitle">Log it, track it, cross it off.</p>
      </header>

      <main className="page__main">
        {error && (
          <p className="page__error" role="alert">
            {error}
          </p>
        )}

        <TodoForm onAdd={addTodo} />

        <SearchFilterBar
          query={query}
          onQueryChange={setQuery}
          status={status}
          onStatusChange={setStatus}
        />

        {isLoading ? (
          <p className="page__loading">Loading your entries…</p>
        ) : (
          <TodoList
            todos={todos}
            hasAnyTodos={counts.total > 0}
            status={status}
            query={query}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
          />
        )}
      </main>

      <footer className="page__footer">
        <span>{counts.total} total</span>
        <span aria-hidden="true">·</span>
        <span>{counts.incomplete} open</span>
        <span aria-hidden="true">·</span>
        <span>{counts.completed} done</span>
      </footer>
    </div>
  );
}

export default App;