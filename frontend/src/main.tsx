import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import SleepLogs from './pages/SleepLogs'
import FeedingLogs from './pages/FeedingLogs'
import DiaperLogs from './pages/DiaperLogs'
import Summary from './pages/Summary'
import Nav from './components/Nav'
import './index.css'

const Root = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '')

  const handleAuth = (t: string) => {
    setToken(t)
    localStorage.setItem('token', t)
  }


  return (
    <BrowserRouter>
      {!token ? (
        <Routes>
          <Route path="/register" element={<Register onRegister={handleAuth} />} />
          <Route path="*" element={<Login onLogin={handleAuth} />} />
        </Routes>
      ) : (
        <div className="pb-16">
          <Routes>
            <Route path="/sleep" element={<SleepLogs token={token} />} />
            <Route path="/feeding" element={<FeedingLogs token={token} />} />
            <Route path="/diaper" element={<DiaperLogs token={token} />} />
            <Route path="/summary" element={<Summary token={token} />} />
            <Route path="*" element={<SleepLogs token={token} />} />
          </Routes>
          <Nav />
        </div>
      )}
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
)
