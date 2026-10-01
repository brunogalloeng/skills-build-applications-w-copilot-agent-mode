import { Link } from 'react-router-dom'
import { api } from '../api.js'
import useApiData from '../useApiData.js'

const features = [
  { to: '/users', title: 'Profili', text: 'Studenti e insegnanti di educazione fisica.' },
  { to: '/activities', title: 'Attività', text: "Registra e monitora l'attività fisica." },
  { to: '/teams', title: 'Squadre', text: 'Crea squadre e lavora su obiettivi comuni.' },
  { to: '/leaderboard', title: 'Classifica', text: 'Confronta i risultati di studenti e squadre.' },
  { to: '/workouts', title: 'Allenamenti', text: 'Suggerimenti personalizzati per migliorare.' },
]

export default function Home() {
  const { data: top } = useApiData(() => api('/leaderboard'))

  return (
    <>
      <div className="p-4 mb-4 bg-white rounded-3 shadow-sm">
        <h1 className="display-6">Benvenuto in OctoFit Tracker</h1>
        <p className="lead mb-0">Traccia l'attività fisica degli studenti della Mergington High School.</p>
      </div>
      <div className="row g-3 mb-4">
        {features.map((f) => (
          <div className="col-md-4 col-lg" key={f.to}>
            <Link to={f.to} className="card h-100 text-decoration-none">
              <div className="card-body">
                <h5 className="card-title">{f.title}</h5>
                <p className="card-text text-muted">{f.text}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
      {top?.length > 0 && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Top 3</h5>
            <ol className="mb-0">
              {top.slice(0, 3).map((e) => (
                <li key={e._id}>
                  {e.user?.name} - <strong>{e.points}</strong> punti
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </>
  )
}
