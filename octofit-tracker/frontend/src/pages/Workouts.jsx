import { useState } from 'react'
import { api, ACTIVITY_LABELS, LEVEL_LABELS } from '../api.js'
import useApiData from '../useApiData.js'

export default function Workouts() {
  const [difficulty, setDifficulty] = useState('')
  const query = difficulty ? `?difficulty=${encodeURIComponent(difficulty)}` : ''
  const { data: workouts, error } = useApiData(() => api(`/workouts${query}`), [query])

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Allenamenti</h2>
        <select className="form-select w-auto" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="">Tutti i livelli</option>
          {Object.entries(LEVEL_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
      <p className="text-muted">Apri un profilo studente per vedere i suggerimenti personalizzati.</p>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-3">
        {workouts?.map((w) => (
          <div className="col-md-6 col-lg-4" key={w._id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{w.title}</h5>
                <p className="card-text">{w.description}</p>
              </div>
              <div className="card-footer bg-white">
                <span className="badge bg-info text-dark me-1">{ACTIVITY_LABELS[w.category]}</span>
                <span className="badge bg-warning text-dark me-1">{LEVEL_LABELS[w.difficulty]}</span>
                <span className="badge bg-light text-dark">{w.durationMinutes} min</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
