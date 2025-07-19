import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import SleepLogs from './pages/SleepLogs'
import './index.css'

const Root = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '')

  const handleLogin = (t: string) => {
    setToken(t)
    localStorage.setItem('token', t)
  }

  return (
    <BrowserRouter>
      <Routes>
        {!token ? (
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        ) : (
          <Route path="*" element={<SleepLogs token={token} />} />
        )}
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
)
