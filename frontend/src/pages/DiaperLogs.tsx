import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../config'

export interface DiaperLog {
  id: number
  time: string
  type: string
  notes?: string
}

const DiaperLogs = ({ token }: { token: string }) => {
  const [logs, setLogs] = useState<DiaperLog[]>([])
  const [newLog, setNewLog] = useState({ time: '', type: 'wet', notes: '' })

  const fetchLogs = async () => {
    const res = await fetch(`${API_BASE_URL}/diaper-logs`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) setLogs(await res.json())
  }

  const addLog = async () => {
    const res = await fetch(`${API_BASE_URL}/diaper-logs/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        time: newLog.time,
        type: newLog.type,
        notes: newLog.notes
      })
    })
    if (res.ok) {
      setNewLog({ time: '', type: 'wet', notes: '' })
      fetchLogs()
    }
  }

  const deleteLog = async (id: number) => {
    if (!confirm('Delete log?')) return
    await fetch(`${API_BASE_URL}/diaper-logs/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchLogs()
  }

  const editLog = async (log: DiaperLog) => {
    const time = prompt('Time', log.time)
    if (!time) return
    const type = prompt('Type (wet, dirty, mixed)', log.type)
    if (!type) return
    const notes = prompt('Notes', log.notes || '')
    await fetch(`${API_BASE_URL}/diaper-logs/${log.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ time, type, notes })
    })
    fetchLogs()
  }

  useEffect(() => { fetchLogs() }, [])

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Diaper Logs</h1>
      <div className="border p-2 rounded space-y-2">
        <h2 className="font-semibold">Add Log</h2>
        <input type="datetime-local" className="border p-2 w-full" value={newLog.time} onChange={e => setNewLog({ ...newLog, time: e.target.value })} />
        <select className="border p-2 w-full" value={newLog.type} onChange={e => setNewLog({ ...newLog, type: e.target.value })}>
          <option value="wet">wet</option>
          <option value="dirty">dirty</option>
          <option value="mixed">mixed</option>
        </select>
        <input type="text" placeholder="Notes" className="border p-2 w-full" value={newLog.notes} onChange={e => setNewLog({ ...newLog, notes: e.target.value })} />
        <button onClick={addLog} className="bg-green-500 text-white px-4 py-2 rounded w-full">Add</button>
      </div>
      <ul className="space-y-2">
        {logs.map(log => (
          <li key={log.id} className="border p-2 rounded flex justify-between items-center">
            <span>{new Date(log.time).toLocaleString()} - {log.type}</span>
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

export default DiaperLogs
