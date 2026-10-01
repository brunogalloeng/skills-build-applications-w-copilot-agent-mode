import { NavLink, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Users from './pages/Users.jsx'
import UserProfile from './pages/UserProfile.jsx'
import Activities from './pages/Activities.jsx'
import Teams from './pages/Teams.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import Workouts from './pages/Workouts.jsx'

const links = [
  { to: '/users', label: 'Profili' },
  { to: '/activities', label: 'Attività' },
  { to: '/teams', label: 'Squadre' },
  { to: '/leaderboard', label: 'Classifica' },
  { to: '/workouts', label: 'Allenamenti' },
]

function App() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
          <NavLink className="navbar-brand d-flex align-items-center gap-2" to="/">
            <img src="/octofitapp-small.png" alt="OctoFit logo" />
            OctoFit Tracker
          </NavLink>
          <ul className="navbar-nav flex-row gap-3">
            {links.map((link) => (
              <li className="nav-item" key={link.to}>
                <NavLink className="nav-link" to={link.to}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <main className="container pb-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserProfile />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </main>
    </>
  )
}

export default App
