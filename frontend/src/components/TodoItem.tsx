import type { Todo } from '../types'

interface Props {
  todo: Todo
  onToggle: (todo: Todo) => void
  onDelete: (id: number) => void
}

export function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <li className={`todo-item ${todo.completed ? 'todo-item--done' : ''}`}>
      <label className="todo-item__label">
        <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo)} />
        <span>{todo.title}</span>
      </label>
      <button className="btn btn--ghost btn--danger" onClick={() => onDelete(todo.id)} aria-label="Delete">
        Delete
      </button>
    </li>
  )
}
