import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client'
import type { ServerInfo } from '../types'

export function ServerInfoCard() {
  const [info, setInfo] = useState<ServerInfo | null>(null)
  const [error, setError] = useState(false)

  const load = useCallback(async () => {
    try {
      setInfo(await api.getInfo())
      setError(false)
    } catch {
      setError(true)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <section className="card server-info">
      <div className="server-info__header">
        <span className={`status-dot ${error ? 'status-dot--down' : 'status-dot--up'}`} />
        <h2>Backend</h2>
        <button className="btn btn--ghost" onClick={load}>
          Refresh
        </button>
      </div>
      {error ? (
        <p className="muted">Cannot reach the API</p>
      ) : (
        info && (
          <dl className="server-info__grid">
            <dt>Pod</dt>
            <dd>{info.hostname}</dd>
            <dt>Version</dt>
            <dd>{info.version}</dd>
            <dt>Environment</dt>
            <dd>{info.environment}</dd>
          </dl>
        )
      )}
    </section>
  )
}
