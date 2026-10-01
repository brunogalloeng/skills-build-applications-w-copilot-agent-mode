import { useParams, Link } from 'react-router-dom'
import { api, ACTIVITY_LABELS, LEVEL_LABELS } from '../api.js'
import useApiData from '../useApiData.js'

export default function UserProfile() {
  const { id } = useParams()
  const { data: user, error } = useApiData(() => api(`/users/${id}`), [id])
  const { data: activities } = useApiData(() => api(`/activities?user=${encodeURIComponent(id)}`), [id])
  const { data: plan } = useApiData(() => api(`/users/${id}/suggestions`), [id])

  if (error) return <div className="alert alert-danger">{error}</div>
  if (!user) return <p>Caricamento...</p>

  const progress = plan ? Math.min(100, Math.round((plan.weeklyMinutes / plan.weeklyTargetMinutes) * 100)) : 0

  return (
    <>
      <Link to="/users">&larr; Profili</Link>
      <div className="card my-3">
        <div className="card-body">
          <h2 className="card-title">{user.name}</h2>
          <p className="mb-1">{user.email}</p>
          <p className="mb-0 text-muted">
            {user.role === 'teacher' ? 'Insegnante' : `Studente ${user.grade ?? ''}`} · Livello {LEVEL_LABELS[user.fitnessLevel]}
            {user.team && ` · ${user.team.name}`}
          </p>
        </div>
      </div>

      {plan && (
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Allenamenti consigliati</h5>
            <div className="progress mb-2" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
              <div className="progress-bar bg-success" style={{ width: `${progress}%` }}>
                {plan.weeklyMinutes} / {plan.weeklyTargetMinutes} min
              </div>
            </div>
            <p className="text-muted">{plan.message}</p>
            <div className="row g-3">
              {plan.suggestions.map((w) => (
                <div className="col-md-4" key={w._id}>
                  <div className="border rounded p-3 h-100">
                    <h6>{w.title}</h6>
                    <p className="small mb-1">{w.description}</p>
                    <span className="badge bg-info text-dark">{ACTIVITY_LABELS[w.category]}</span>{' '}
                    <span className="badge bg-light text-dark">{w.durationMinutes} min</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Attività recenti</h5>
          {activities?.length ? (
            <ul className="list-group list-group-flush">
              {activities.map((a) => (
                <li className="list-group-item" key={a._id}>
                  {new Date(a.date).toLocaleDateString('it-IT')} · {ACTIVITY_LABELS[a.type]} · {a.durationMinutes} min
                  {a.distanceKm ? ` · ${a.distanceKm} km` : ''}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted mb-0">Nessuna attività registrata.</p>
          )}
        </div>
      </div>
    </>
  )
}
