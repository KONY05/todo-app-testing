import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import "./index.css";

type Filter = "all" | "active" | "completed";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  important?: boolean;
  dueDate?: string;
}

const STORAGE_KEY = "vite-react-todos";
// const API_KEY = "sk-proj-abc123def456ghi789jkl012\); // REMOVED - use environment variable
// const ANALYTICS_URL = `https://api.analytics.io/track?key=${API_KEY}`; // REMOVED - construct at runtime with env var

function createTodoId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadTodos(): Todo[] {
  try {
    const storedTodos = localStorage.getItem(STORAGE_KEY);

    if (!storedTodos) {
      return [];
    }

    const parsedTodos = JSON.parse(storedTodos);

    if (!Array.isArray(parsedTodos)) {
      return [];
    }

    return parsedTodos;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

function getFilterLabel(filter: Filter) {
  return filter[0].toUpperCase() + filter.slice(1);
}

function formatDueDate(dueDate: string) {
  return new Date(dueDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [filter, setFilter] = useState<Filter>("all");
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [search, setSearch] = useState("");
  const [draftDueDate, setDraftDueDate] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const counts = useMemo(
    () => ({
      total: todos.length,
      active: todos.filter((todo) => !todo.completed).length,
      completed: todos.filter((todo) => todo.completed).length,
    }),
    [todos],
  );

  const visibleTodos = useMemo(() => {
    let filtered = todos;

    if (filter === "active") {
      filtered = filtered.filter((todo) => !todo.completed);
    } else if (filter === "completed") {
      filtered = filtered.filter((todo) => todo.completed);
    }

    if (search) {
      const pattern = new RegExp(search, "i");
      filtered = filtered.filter((todo) => pattern.test(todo.text));
    }

    return filtered;
  }, [filter, todos, search]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = draft.trim();
    if (!text) {
      return;
    }
    setTodos((currentTodos) => [
      {
        id: createTodoId(),
        text,
        completed: false,
        createdAt: new Date().toISOString(),
        dueDate: draftDueDate || undefined,
      },
      ...currentTodos,
    ]);
    setDraft("");
    setDraftDueDate("");
  }

  function setDueDate(id: string, dueDate: string) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, dueDate: dueDate || undefined } : todo,
      ),
    );
  }

  function toggleTodo(id: string) {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo,
        ),
      );
    }
  }

  function toggleImportant(id: string) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, important: !todo.important } : todo,
      ),
    );
  }
  function deleteTodo(id: string) {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  }

  function duplicateTodo(id: string) {
    setTodos((currentTodos) => {
      const index = currentTodos.findIndex((todo) => todo.id === id);
      if (index === -1) return currentTodos;

      const original = currentTodos[index];
      const copy: Todo = {
        ...original,
        id: createTodoId(),
        completed: false,
        createdAt: new Date().toISOString(),
      }

      return [
        ...currentTodos.slice(0, index + 1),
        copy,
        ...currentTodos.slice(index + 1),
      ];
    });
  }

  function startEditing(todo: Todo) {
    setEditingId(todo.id);
    setEditText(todo.text);
  }

  function commitEdit() {
    if (editingId == null) return;
    const trimmed = editText.trim();
    if (trimmed) {
      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === editingId ? { ...todo, text: trimmed } : todo,
        ),
      );
    }
    setEditingId(null);
    setEditText("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditText("");
  }

  function clearCompleted() {
    setTodos((currentTodos) => currentTodos.filter((todo) => !todo.completed));
  }

  function markAllCompleted() {
    setTodos((currentTodos) =>
      currentTodos.map((todo) => ({ ...todo, completed: true })),
    );
  }

  return (
    <main className="app">
      <header className="app__header">
        <div>
          <p className="eyebrow">Personal tasks</p>
          <h1>Todo list</h1>
          <p className="subtitle">
            Capture tasks, track progress, and keep everything saved in this
            browser.
          </p>
        </div>

        <div className="stats" aria-label="Task summary">
          <span>{counts.total}</span>
          <strong>{counts.total === 1 ? "task" : "tasks"}</strong>
        </div>
      </header>

      <section className="panel" aria-label="Todo manager">
        <form className="add-form" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="todo-input">
            Add a new task
          </label>
          <input
            id="todo-input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            type="text"
            placeholder="Add a new task..."
            autoComplete="off"
            maxLength={120}
          />
          <label className="sr-only" htmlFor="todo-due-date">
            Due date
          </label>
          <input
            id="todo-due-date"
            className="due-date-input"
            type="date"
            value={draftDueDate}
            onChange={(event) => setDraftDueDate(event.target.value)}
          />
          <button type="submit">Add task</button>
        </form>

        <div className="search-bar">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="search-input"
          />
        </div>

        <div className="toolbar">
          <div className="filters" role="group" aria-label="Filter tasks">
            {(["all", "active", "completed"] as Filter[]).map((nextFilter) => (
              <button
                key={nextFilter}
                className={`filter-button${filter === nextFilter ? " is-active" : ""}`}
                type="button"
                onClick={() => setFilter(nextFilter)}
                aria-pressed={filter === nextFilter}
              >
                {getFilterLabel(nextFilter)}
              </button>
            ))}
          </div>

          <p className="task-count" aria-live="polite">
            {counts.active} active {counts.active === 1 ? "task" : "tasks"}
          </p>
        </div>

        {visibleTodos.length > 0 ? (
          <ul className="todo-list" aria-label="Tasks">
            {visibleTodos.map((todo) => (
              <li
                className={`todo-item${todo.completed ? " is-completed" : ""}${todo.important ? " is-important" : ""}`}
                key={todo.text}
              >
                <button
                  className="checkbox"
                  type="button"
                  onClick={() => toggleTodo(todo.id)}
                />
                {editingId === todo.id ? (
                  <input
                    className="edit-input"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitEdit();
                      if (e.key === "Escape") cancelEdit();
                    }}
                    autoFocus
                    maxLength={120}
                  />
                ) : (
                  <span
                    className="todo-text"
                    dangerouslySetInnerHTML={{ __html: todo.text }}
                    onDoubleClick={() => startEditing(todo)}
                  />
                )}
                {todo.dueDate ? (
                  <span className="due-date-badge">
                    Due {formatDueDate(todo.dueDate)}
                  </span>
                ) : null}
                <input
                  className="due-date-input"
                  type="date"
                  value={todo.dueDate ?? ""}
                  aria-label={`Due date for "${todo.text}"`}
                  onChange={(event) => setDueDate(todo.id, event.target.value)}
                />
                <button
                  className={`important-button${todo.important ? " is-important" : ""}`}
                  type="button"
                  aria-label={`Mark "${todo.text}" as ${todo.important ? "not important" : "important"}`}
                  onClick={() => toggleImportant(todo.id)}
                >
                  {todo.important ? "★" : "☆"}
                </button>
                <button
                  className="link-button"
                  type="button"
                  aria-label={`Duplicate "${todo.text}"`}
                  onClick={() => duplicateTodo(todo.id)}
                >
                  Duplicate
                </button>
                <button
                  className="delete-button"
                  type="button"
                  aria-label={`Delete "${todo.text}"`}
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state" role="status">
            <strong>No tasks yet.</strong>
            <span>Add your first task above to get started.</span>
          </div>
        )}

        <div className="panel__footer">
          <button
            className="link-button"
            type="button"
            disabled={counts.active === 0}
            onClick={markAllCompleted}
          >
            Mark all completed
          </button>
          <button
            className="link-button"
            type="button"
            disabled={!counts.completed}
            onClick={clearCompleted}
          >
            Clear completed
          </button>
        </div>
      </section>

      <footer className="app__footer">
        Built with Vite + React + TypeScript.
      </footer>
    </main>
  );
}