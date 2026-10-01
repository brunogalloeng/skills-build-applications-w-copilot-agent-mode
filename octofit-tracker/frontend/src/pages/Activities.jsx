import { useState } from 'react'
import { api, ACTIVITY_LABELS } from '../api.js'
import useApiData from '../useApiData.js'

const today = () => new Date().toISOString().slice(0, 10)
const emptyForm = { user: '', type: 'running', durationMinutes: '', distanceKm: '', calories: '', date: today() }

export default function Activities() {
  const { data: activities, error, reload } = useApiData(() => api('/activities'))
  const { data: users } = useApiData(() => api('/users?role=student'))
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    const body = { user: form.user, type: form.type, date: form.date, durationMinutes: Number(form.durationMinutes) }
    if (form.distanceKm) body.distanceKm = Number(form.distanceKm)
    if (form.calories) body.calories = Number(form.calories)
    try {
      await api('/activities', { method: 'POST', body })
      setForm({ ...emptyForm, user: form.user })
      reload()
    } catch (err) {
      setFormError(err.message)
    }
  }

  async function handleDelete(id) {
    await api(`/activities/${id}`, { method: 'DELETE' })
    reload()
  }

  return (
    <div className="row g-4">
      <div className="col-lg-8">
        <h2>Attività</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <table className="table table-hover bg-white">
          <thead>
            <tr>
              <th>Data</th>
              <th>Studente</th>
              <th>Tipo</th>
              <th>Durata</th>
              <th>Distanza</th>
              <th>Calorie</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {activities?.map((a) => (
              <tr key={a._id}>
                <td>{new Date(a.date).toLocaleDateString('it-IT')}</td>
                <td>{a.user?.name}</td>
                <td>{ACTIVITY_LABELS[a.type]}</td>
                <td>{a.durationMinutes} min</td>
                <td>{a.distanceKm ? `${a.distanceKm} km` : '-'}</td>
                <td>{a.calories ?? '-'}</td>
                <td>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(a._id)}>
                    Elimina
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="col-lg-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Registra attività</h5>
            {formError && <div className="alert alert-danger">{formError}</div>}
            <form onSubmit={handleSubmit}>
              <select className="form-select mb-2" value={form.user} onChange={update('user')} required>
                <option value="">Seleziona studente...</option>
                {users?.map((u) => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
              <select className="form-select mb-2" value={form.type} onChange={update('type')}>
                {Object.entries(ACTIVITY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <input className="form-control mb-2" type="number" min="1" max="600" placeholder="Durata (minuti)" value={form.durationMinutes} onChange={update('durationMinutes')} required />
              <input className="form-control mb-2" type="number" min="0" step="0.1" placeholder="Distanza (km)" value={form.distanceKm} onChange={update('distanceKm')} />
              <input className="form-control mb-2" type="number" min="0" placeholder="Calorie" value={form.calories} onChange={update('calories')} />
              <input className="form-control mb-3" type="date" value={form.date} onChange={update('date')} required />
              <button className="btn btn-primary w-100" type="submit">Salva</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
