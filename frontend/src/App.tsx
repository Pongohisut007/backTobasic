import { useEffect, useState } from 'react'
import { api } from './api/client'
import { ServerInfoCard } from './components/ServerInfoCard'
import { TodoForm } from './components/TodoForm'
import { TodoItem } from './components/TodoItem'
import type { Todo } from './types'
import './App.css'

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const run = async (action: () => Promise<void>) => {
    try {
      await action()
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    }
  }

  useEffect(() => {
    run(async () => setTodos(await api.getTodos())).finally(() => setLoading(false))
  }, [])

  const addTodo = (title: string) =>
    run(async () => {
      const todo = await api.createTodo(title)
      setTodos((prev) => [todo, ...prev])
    })

  const toggleTodo = (todo: Todo) =>
    run(async () => {
      const updated = await api.updateTodo(todo.id, { completed: !todo.completed })
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
    })

  const deleteTodo = (id: number) =>
    run(async () => {
      await api.deleteTodo(id)
      setTodos((prev) => prev.filter((t) => t.id !== id))
    })

  const remaining = todos.filter((t) => !t.completed).length

  return (
    <main className="container">
      <header className="page-header">
        <h1>Todos</h1>
        <p className="muted">React + NestJS + PostgreSQL</p>
      </header>

      <ServerInfoCard />

      <section className="card">
        <TodoForm onAdd={addTodo} />

        {error && <p className="alert">{error}</p>}

        {loading ? (
          <p className="muted empty">Loading…</p>
        ) : todos.length === 0 ? (
          <p className="muted empty">No todos yet</p>
        ) : (
          <>
            <ul className="todo-list">
              {todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
              ))}
            </ul>
            <p className="muted footer-count">{remaining} remaining</p>
          </>
        )}
      </section>
    </main>
  )
}

export default App
