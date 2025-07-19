import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../config'

export interface SleepLog {
  id: number
  start_time: string
  end_time: string
}

const SleepLogs = ({ token }: { token: string }) => {
  const [logs, setLogs] = useState<SleepLog[]>([])
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  const fetchLogs = async () => {
    const params = new URLSearchParams()
    if (start) params.append('start_time', start)
    if (end) params.append('end_time', end)
    const res = await fetch(`${API_BASE_URL}/sleep-logs?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      setLogs(await res.json())
    }
  }

  useEffect(() => { fetchLogs() }, [])

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Sleep Logs</h1>
      <div className="flex gap-2">
        <input type="datetime-local" value={start} onChange={e => setStart(e.target.value)} className="border p-2" />
        <input type="datetime-local" value={end} onChange={e => setEnd(e.target.value)} className="border p-2" />
        <button onClick={fetchLogs} className="bg-blue-500 text-white px-4 py-2 rounded">Filter</button>
      </div>
      <ul className="space-y-2">
        {logs.map(log => (
          <li key={log.id} className="border p-2 rounded">
            {new Date(log.start_time).toLocaleString()} - {new Date(log.end_time).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SleepLogs
