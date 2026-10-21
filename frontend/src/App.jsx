import { useEffect, useState } from 'react';

// Relative path: the frontend calls the same host, and /api is routed to the backend
const API = '/api';

export default function App() {
  const [info, setInfo] = useState(null);
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const loadInfo = async () => {
    try {
      const res = await fetch(`${API}/info`);
      setInfo(await res.json());
      setError('');
    } catch (e) {
      setError('Cannot reach backend: ' + e.message);
    }
  };

  const loadTodos = async () => {
    try {
      const res = await fetch(`${API}/todos`);
      setTodos(await res.json());
    } catch (e) {
      setError('Cannot reach backend: ' + e.message);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch(`${API}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    setTitle('');
    loadTodos();
  };

  useEffect(() => {
    loadInfo();
    loadTodos();
  }, []);

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 600, margin: '40px auto', padding: '0 16px' }}>
      <h1>K8s Practice App</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>Backend info</h2>
      <button onClick={loadInfo}>Refresh (see which pod answers)</button>
      {info && <pre style={{ background: '#f4f4f4', padding: 12 }}>{JSON.stringify(info, null, 2)}</pre>}

      <h2>Todos</h2>
      <form onSubmit={addTodo}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New todo" />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map((t) => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>
    </div>
  );
}
