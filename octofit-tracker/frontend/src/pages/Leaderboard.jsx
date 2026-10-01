import { useState } from 'react'
import { api } from '../api.js'
import useApiData from '../useApiData.js'

export default function Leaderboard() {
  const [view, setView] = useState('students')
  const { data: students, error } = useApiData(() => api('/leaderboard'))
  const { data: teams } = useApiData(() => api('/leaderboard/teams'))

  return (
    <>
      <h2>Classifica</h2>
      <p className="text-muted">Punti = minuti di attività + calorie / 10</p>
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${view === 'students' ? 'active' : ''}`} onClick={() => setView('students')}>Studenti</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${view === 'teams' ? 'active' : ''}`} onClick={() => setView('teams')}>Squadre</button>
        </li>
      </ul>
      {error && <div className="alert alert-danger">{error}</div>}
      {view === 'students' ? (
        <table className="table table-striped bg-white">
          <thead>
            <tr><th>#</th><th>Studente</th><th>Squadra</th><th>Attività</th><th>Minuti</th><th>Punti</th></tr>
          </thead>
          <tbody>
            {students?.map((e) => (
              <tr key={e._id}>
                <td>{e.rank}</td>
                <td>{e.user?.name}</td>
                <td>{e.team?.name ?? '-'}</td>
                <td>{e.totalActivities}</td>
                <td>{e.totalMinutes}</td>
                <td><strong>{e.points}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table className="table table-striped bg-white">
          <thead>
            <tr><th>#</th><th>Squadra</th><th>Membri</th><th>Minuti</th><th>Punti</th></tr>
          </thead>
          <tbody>
            {teams?.map((e) => (
              <tr key={e.team._id}>
                <td>{e.rank}</td>
                <td>{e.team.name}</td>
                <td>{e.members}</td>
                <td>{e.totalMinutes}</td>
                <td><strong>{e.points}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
