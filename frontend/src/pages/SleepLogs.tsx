import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../config'

export interface SleepLog {
  id: number
  start_time: string
  end_time: string
  notes?: string
}

const SleepLogs = ({ token }: { token: string }) => {
  const [logs, setLogs] = useState<SleepLog[]>([])
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [newStart, setNewStart] = useState('')
  const [newEnd, setNewEnd] = useState('')
  const [newNotes, setNewNotes] = useState('')

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

  const addLog = async () => {
    const res = await fetch(`${API_BASE_URL}/sleep-logs/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ start_time: newStart, end_time: newEnd, notes: newNotes })
    })
    if (res.ok) {
      setNewStart('')
      setNewEnd('')
      setNewNotes('')
      fetchLogs()
    }
  }

  const deleteLog = async (id: number) => {
    if (!confirm('Delete log?')) return
    await fetch(`${API_BASE_URL}/sleep-logs/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchLogs()
  }

  const editLog = async (log: SleepLog) => {
    const start_time = prompt('Start time (YYYY-MM-DDTHH:MM)', log.start_time)
    if (!start_time) return
    const end_time = prompt('End time (YYYY-MM-DDTHH:MM)', log.end_time)
    if (!end_time) return
    const notes = prompt('Notes', log.notes || '')
    await fetch(`${API_BASE_URL}/sleep-logs/${log.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ start_time, end_time, notes })
    })
    fetchLogs()
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

      <div className="border p-2 rounded space-y-2">
        <h2 className="font-semibold">Add Log</h2>
        <input type="datetime-local" value={newStart} onChange={e => setNewStart(e.target.value)} className="border p-2 w-full" />
        <input type="datetime-local" value={newEnd} onChange={e => setNewEnd(e.target.value)} className="border p-2 w-full" />
        <input type="text" value={newNotes} onChange={e => setNewNotes(e.target.value)} placeholder="Notes" className="border p-2 w-full" />
        <button onClick={addLog} className="bg-green-500 text-white px-4 py-2 rounded w-full">Add</button>
      </div>

      <ul className="space-y-2">
        {logs.map(log => (
          <li key={log.id} className="border p-2 rounded flex justify-between items-center">
            <span>{new Date(log.start_time).toLocaleString()} - {new Date(log.end_time).toLocaleString()}</span>
            <div className="space-x-2">
              <button onClick={() => editLog(log)} className="text-blue-500">Edit</button>
              <button onClick={() => deleteLog(log.id)} className="text-red-500">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SleepLogs
