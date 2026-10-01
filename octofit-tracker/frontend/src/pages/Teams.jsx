import { useState } from 'react'
import { api } from '../api.js'
import useApiData from '../useApiData.js'

const emptyForm = { name: '', description: '', goal: '', coach: '' }

export default function Teams() {
  const { data: teams, error, reload } = useApiData(() => api('/teams'))
  const { data: users } = useApiData(() => api('/users'))
  const [form, setForm] = useState(emptyForm)
  const [selected, setSelected] = useState({})
  const [formError, setFormError] = useState('')

  const teachers = users?.filter((u) => u.role === 'teacher') ?? []
  const students = users?.filter((u) => u.role === 'student') ?? []
  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  async function run(action) {
    setFormError('')
    try {
      await action()
      reload()
    } catch (err) {
      setFormError(err.message)
    }
  }

  function handleCreate(e) {
    e.preventDefault()
    const body = { ...form }
    if (!body.coach) delete body.coach
    run(async () => {
      await api('/teams', { method: 'POST', body })
      setForm(emptyForm)
    })
  }

  const addMember = (teamId) =>
    selected[teamId] && run(() => api(`/teams/${teamId}/members`, { method: 'POST', body: { userId: selected[teamId] } }))
  const removeMember = (teamId, userId) => run(() => api(`/teams/${teamId}/members/${userId}`, { method: 'DELETE' }))
  const deleteTeam = (teamId) => window.confirm('Eliminare la squadra?') && run(() => api(`/teams/${teamId}`, { method: 'DELETE' }))

  return (
    <div className="row g-4">
      <div className="col-lg-8">
        <h2>Squadre</h2>
        {(error || formError) && <div className="alert alert-danger">{error || formError}</div>}
        {teams?.map((team) => (
          <div className="card mb-3" key={team._id}>
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h5 className="card-title">{team.name}</h5>
                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteTeam(team._id)}>Elimina</button>
              </div>
              {team.description && <p className="mb-1">{team.description}</p>}
              {team.goal && <p className="mb-1"><strong>Obiettivo:</strong> {team.goal}</p>}
              {team.coach && <p className="text-muted small">Coach: {team.coach.name}</p>}
              <ul className="list-group mb-2">
                {team.members.map((m) => (
                  <li className="list-group-item d-flex justify-content-between align-items-center" key={m._id}>
                    {m.name}
                    <button className="btn btn-sm btn-link text-danger" onClick={() => removeMember(team._id, m._id)}>Rimuovi</button>
                  </li>
                ))}
              </ul>
              <div className="input-group">
                <select
                  className="form-select"
                  value={selected[team._id] ?? ''}
                  onChange={(e) => setSelected({ ...selected, [team._id]: e.target.value })}
                >
                  <option value="">Aggiungi studente...</option>
                  {students
                    .filter((s) => !team.members.some((m) => m._id === s._id))
                    .map((s) => (
                      <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                </select>
                <button className="btn btn-outline-primary" onClick={() => addMember(team._id)}>Aggiungi</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="col-lg-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Nuova squadra</h5>
            <form onSubmit={handleCreate}>
              <input className="form-control mb-2" placeholder="Nome" value={form.name} onChange={update('name')} required />
              <input className="form-control mb-2" placeholder="Descrizione" value={form.description} onChange={update('description')} />
              <input className="form-control mb-2" placeholder="Obiettivo" value={form.goal} onChange={update('goal')} />
              <select className="form-select mb-3" value={form.coach} onChange={update('coach')}>
                <option value="">Coach (opzionale)</option>
                {teachers.map((t) => (
                  <option key={t._id} value={t._id}>{t.name}</option>
                ))}
              </select>
              <button className="btn btn-primary w-100" type="submit">Crea</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
