import { useState } from 'react'
import { API_BASE_URL } from '../config'

const Summary = ({ token }: { token: string }) => {
  const [date, setDate] = useState('')
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchSummary = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (date) params.append('date', date)
    const res = await fetch(`${API_BASE_URL}/ai/summary?${params.toString()}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      const data = await res.json()
      setSummary(data.summary)
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
      {loading ? <p>Loading...</p> : <p className="whitespace-pre-wrap">{summary}</p>}
    </div>
  )
}

export default Summary
