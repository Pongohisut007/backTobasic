import { useState, type FormEvent } from 'react'

interface Props {
  onAdd: (title: string) => Promise<void>
}

export function TodoForm({ onAdd }: Props) {
  const [title, setTitle] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setSubmitting(true)
    try {
      await onAdd(title.trim())
      setTitle('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        className="input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        maxLength={200}
      />
      <button className="btn btn--primary" type="submit" disabled={submitting || !title.trim()}>
        Add
      </button>
    </form>
  )
}
