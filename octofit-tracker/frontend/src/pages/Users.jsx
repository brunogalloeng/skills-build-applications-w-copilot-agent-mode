import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api, LEVEL_LABELS } from '../api.js'
import useApiData from '../useApiData.js'

const emptyForm = { name: '', email: '', role: 'student', grade: '', fitnessLevel: 'beginner' }

export default function Users() {
  const { data: users, error, reload } = useApiData(() => api('/users'))
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    try {
      await api('/users', { method: 'POST', body: form })
      setForm(emptyForm)
      reload()
    } catch (err) {
      setFormError(err.message)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Eliminare questo profilo e tutte le sue attività?')) return
    await api(`/users/${id}`, { method: 'DELETE' })
    reload()
  }

  return (
    <div className="row g-4">
      <div className="col-lg-8">
        <h2>Profili</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <table className="table table-hover bg-white">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Ruolo</th>
              <th>Classe</th>
              <th>Livello</th>
              <th>Squadra</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u._id}>
                <td>
                  <Link to={`/users/${u._id}`}>{u.name}</Link>
                  <div className="small text-muted">{u.email}</div>
                </td>
                <td>
                  <span className={`badge ${u.role === 'teacher' ? 'bg-primary' : 'bg-secondary'}`}>
                    {u.role === 'teacher' ? 'Insegnante' : 'Studente'}
                  </span>
                </td>
                <td>{u.grade ?? '-'}</td>
                <td>{LEVEL_LABELS[u.fitnessLevel]}</td>
                <td>{u.team?.name ?? '-'}</td>
                <td>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(u._id)}>
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
            <h5 className="card-title">Nuovo profilo</h5>
            {formError && <div className="alert alert-danger">{formError}</div>}
            <form onSubmit={handleSubmit}>
              <input className="form-control mb-2" placeholder="Nome" value={form.name} onChange={update('name')} required />
              <input className="form-control mb-2" type="email" placeholder="Email" value={form.email} onChange={update('email')} required />
              <select className="form-select mb-2" value={form.role} onChange={update('role')}>
                <option value="student">Studente</option>
                <option value="teacher">Insegnante</option>
              </select>
              <input className="form-control mb-2" placeholder="Classe (es. 9A)" value={form.grade} onChange={update('grade')} />
              <select className="form-select mb-3" value={form.fitnessLevel} onChange={update('fitnessLevel')}>
                {Object.entries(LEVEL_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
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
