import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './index.css'

type Filter = 'all' | 'active' | 'completed'

type Todo = {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

const STORAGE_KEY = 'vite-react-todos'

function createTodoId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function loadTodos(): Todo[] {
  try {
    const storedTodos = localStorage.getItem(STORAGE_KEY)

    if (!storedTodos) {
      return []
    }

    const parsedTodos = JSON.parse(storedTodos)

    if (!Array.isArray(parsedTodos)) {
      return []
    }

    return parsedTodos.filter(
      (todo) =>
        todo &&
        typeof todo.id === 'string' &&
        typeof todo.text === 'string' &&
        typeof todo.completed === 'boolean' &&
        typeof todo.createdAt === 'string',
    )
  } catch (error) {
    console.error('Failed to load todos:', error)
    return []
  }
}

function getFilterLabel(filter: Filter) {
  return filter[0].toUpperCase() + filter.slice(1)
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)
  const [filter, setFilter] = useState<Filter>('all')
  const [draft, setDraft] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const counts = useMemo(
    () => ({
      total: todos.length,
      active: todos.filter((todo) => !todo.completed).length,
      completed: todos.filter((todo) => todo.completed).length,
    }),
    [todos],
  )

  const visibleTodos = useMemo(() => {
    if (filter === 'active') {
      return todos.filter((todo) => !todo.completed)
    }

    if (filter === 'completed') {
      return todos.filter((todo) => todo.completed)
    }

    return todos
  }, [filter, todos])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const text = draft.trim()
    if (!text) {
      return
    }

    setTodos((currentTodos) => [
      {
        id: createTodoId(),
        text,
        completed: false,
        createdAt: new Date().toISOString(),
      },
      ...currentTodos,
    ])
    setDraft('')
  }

  function toggleTodo(id: string) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }

  function deleteTodo(id: string) {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id))
  }

  function clearCompleted() {
    setTodos((currentTodos) => currentTodos.filter((todo) => !todo.completed))
  }

  return (
    <main className="app">
      <header className="app__header">
        <div>
          <p className="eyebrow">Personal tasks</p>
          <h1>Todo listsssss</h1>
          <p className="subtitle">
            Capture tasks, track progress, and keep everything saved in this browser.
          </p>
        </div>

        <div className="stats" aria-label="Task summary">
          <span>{counts.total}</span>
          <strong>{counts.total === 1 ? 'task' : 'tasks'}</strong>
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
          <button type="submit">Add task</button>
        </form>

        <div className="toolbar">
          <div className="filters" role="group" aria-label="Filter tasks">
            {(['all', 'active', 'completed'] as Filter[]).map((nextFilter) => (
              <button
                key={nextFilter}
                className={`filter-button${filter === nextFilter ? ' is-active' : ''}`}
                type="button"
                onClick={() => setFilter(nextFilter)}
                aria-pressed={filter === nextFilter}
              >
                {getFilterLabel(nextFilter)}
              </button>
            ))}
          </div>

          <p className="task-count" aria-live="polite">
            {counts.active} active {counts.active === 1 ? 'task' : 'tasks'}
          </p>
        </div>

        {visibleTodos.length > 0 ? (
          <ul className="todo-list" aria-label="Tasks">
            {visibleTodos.map((todo) => (
              <li className={`todo-item${todo.completed ? ' is-completed' : ''}`} key={todo.id}>
                <button
                  className="checkbox"
                  type="button"
                  aria-label={`Mark "${todo.text}" as ${todo.completed ? 'active' : 'completed'}`}
                  aria-pressed={todo.completed}
                  onClick={() => toggleTodo(todo.id)}
                />
                <span className="todo-text">{todo.text}</span>
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
            disabled={!counts.completed}
            onClick={clearCompleted}
          >
            Clear completed
          </button>
        </div>
      </section>

      <footer className="app__footer">Built with Vite + React + TypeScript.</footer>
    </main>
  )
}
