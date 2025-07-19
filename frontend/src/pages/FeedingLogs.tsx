import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../config'

export interface FeedingLog {
  id: number
  start_time: string
  end_time: string
  food_type?: string
  amount?: string
  notes?: string
}

const FeedingLogs = ({ token }: { token: string }) => {
  const [logs, setLogs] = useState<FeedingLog[]>([])
  const [newLog, setNewLog] = useState({ start: '', end: '', food: '', amount: '', notes: '' })

  const fetchLogs = async () => {
    const res = await fetch(`${API_BASE_URL}/feeding-logs`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) setLogs(await res.json())
  }

  const addLog = async () => {
    const res = await fetch(`${API_BASE_URL}/feeding-logs/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        start_time: newLog.start,
        end_time: newLog.end,
        food_type: newLog.food,
        amount: newLog.amount,
        notes: newLog.notes
      })
    })
    if (res.ok) {
      setNewLog({ start: '', end: '', food: '', amount: '', notes: '' })
      fetchLogs()
    }
  }

  const deleteLog = async (id: number) => {
    if (!confirm('Delete log?')) return
    await fetch(`${API_BASE_URL}/feeding-logs/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchLogs()
  }

  const editLog = async (log: FeedingLog) => {
    const start_time = prompt('Start time', log.start_time)
    if (!start_time) return
    const end_time = prompt('End time', log.end_time)
    if (!end_time) return
    const food_type = prompt('Food type', log.food_type || '')
    const amount = prompt('Amount', log.amount || '')
    const notes = prompt('Notes', log.notes || '')
    await fetch(`${API_BASE_URL}/feeding-logs/${log.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ start_time, end_time, food_type, amount, notes })
    })
    fetchLogs()
  }

  useEffect(() => { fetchLogs() }, [])

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Feeding Logs</h1>
      <div className="border p-2 rounded space-y-2">
        <h2 className="font-semibold">Add Log</h2>
        <input type="datetime-local" className="border p-2 w-full" value={newLog.start} onChange={e => setNewLog({ ...newLog, start: e.target.value })} />
        <input type="datetime-local" className="border p-2 w-full" value={newLog.end} onChange={e => setNewLog({ ...newLog, end: e.target.value })} />
        <input type="text" placeholder="Food type" className="border p-2 w-full" value={newLog.food} onChange={e => setNewLog({ ...newLog, food: e.target.value })} />
        <input type="text" placeholder="Amount" className="border p-2 w-full" value={newLog.amount} onChange={e => setNewLog({ ...newLog, amount: e.target.value })} />
        <input type="text" placeholder="Notes" className="border p-2 w-full" value={newLog.notes} onChange={e => setNewLog({ ...newLog, notes: e.target.value })} />
        <button onClick={addLog} className="bg-green-500 text-white px-4 py-2 rounded w-full">Add</button>
      </div>
      <ul className="space-y-2">
        {logs.map(log => (
          <li key={log.id} className="border p-2 rounded flex justify-between items-center">
            <span>{new Date(log.start_time).toLocaleString()} - {new Date(log.end_time).toLocaleString()} {log.food_type && `(${log.food_type})`}</span>
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

export default FeedingLogs
