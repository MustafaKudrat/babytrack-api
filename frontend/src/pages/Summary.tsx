import { useState } from 'react'
import { API_BASE_URL } from '../config'

export interface SleepLog {
  id: number
  start_time: string
  end_time: string
  notes?: string
}

export interface FeedingLog {
  id: number
  start_time: string
  end_time: string
  food_type?: string
  amount?: string
  notes?: string
}

export interface DiaperLog {
  id: number
  time: string
  type: string
  notes?: string
}

const Summary = ({ token }: { token: string }) => {
  const [date, setDate] = useState('')
  const [summary, setSummary] = useState('')
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>([])
  const [feedingLogs, setFeedingLogs] = useState<FeedingLog[]>([])
  const [diaperLogs, setDiaperLogs] = useState<DiaperLog[]>([])
  const [loading, setLoading] = useState(false)

  const fetchSummary = async () => {
    if (!date) return
    setLoading(true)
    const start = new Date(`${date}T00:00:00`).toISOString()
    const end = new Date(`${date}T23:59:59`).toISOString()
    const params = new URLSearchParams({ start_time: start, end_time: end })
    const headers = { Authorization: `Bearer ${token}` }

    const [sRes, fRes, dRes, aiRes] = await Promise.all([
      fetch(`${API_BASE_URL}/sleep-logs?${params}`, { headers }),
      fetch(`${API_BASE_URL}/feeding-logs?${params}`, { headers }),
      fetch(`${API_BASE_URL}/diaper-logs?${params}`, { headers }),
      fetch(`${API_BASE_URL}/ai/summary?date=${date}`, { method: 'POST', headers })
    ])

    if (sRes.ok) setSleepLogs(await sRes.json())
    if (fRes.ok) setFeedingLogs(await fRes.json())
    if (dRes.ok) setDiaperLogs(await dRes.json())
    if (aiRes.ok) {
      const data = await aiRes.json()
      setSummary(data.summary)
    } else {
      setSummary('')
    }
    setLoading(false)
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Daily Summary</h1>
      <div className="flex gap-2 items-end">
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-2" />
        <button onClick={fetchSummary} className="bg-blue-500 text-white px-4 py-2 rounded">Get Summary</button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p className="whitespace-pre-wrap">{summary}</p>
          <div className="space-y-2">
            <h2 className="font-semibold mt-4">Sleep Logs</h2>
            <ul className="space-y-1 text-sm">
              {sleepLogs.map(l => (
                <li key={l.id}>
                  {new Date(l.start_time).toLocaleTimeString()} - {new Date(l.end_time).toLocaleTimeString()}
                </li>
              ))}
            </ul>

            <h2 className="font-semibold mt-4">Feeding Logs</h2>
            <ul className="space-y-1 text-sm">
              {feedingLogs.map(l => (
                <li key={l.id}>
                  {new Date(l.start_time).toLocaleTimeString()} - {l.food_type || ''} {l.amount && `(${l.amount})`}
                </li>
              ))}
            </ul>

            <h2 className="font-semibold mt-4">Diaper Logs</h2>
            <ul className="space-y-1 text-sm">
              {diaperLogs.map(l => (
                <li key={l.id}>
                  {new Date(l.time).toLocaleTimeString()} - {l.type}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

export default Summary
