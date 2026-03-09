import { useState, useCallback } from 'react';
import { useAction, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

interface ScheduleItem { time: string; action: string; reason: string; }
interface Protocol { origin: string; destination: string; severity: string; schedule: ScheduleItem[]; tips: string[]; }

function JetLagPage() {
  const [origin, setOrigin] = useState(''); const [dest, setDest] = useState(''); const [dep, setDep] = useState(''); const [arr, setArr] = useState('');
  const [loading, setLoading] = useState(false); const [result, setResult] = useState<Protocol | null>(null);
  const generate = useAction(api.ai.generateProtocol); const save = useMutation(api.functions.saveProtocol);

  const handleGenerate = useCallback(async () => {
    if (!origin.trim() || !dest.trim() || !dep || !arr) return; setLoading(true);
    try {
      const r = await generate({ origin: origin.trim(), destination: dest.trim(), departureTime: dep, arrivalTime: arr }); setResult(r); await save({ ...r, departureTime: dep, arrivalTime: arr });
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [origin, dest, dep, arr, generate, save]);

  return (
    <div className="mc"><div className="pg">
      <h1 className="title">Beat <span className="a">Jet Lag</span></h1>
      <p className="sub">Enter your flight details for a personalized recovery protocol based on sleep science.</p>
      <div className="row"><input className="inp" value={origin} onChange={e => setOrigin(e.target.value)} placeholder="Origin (e.g. New York)" /><input className="inp" value={dest} onChange={e => setDest(e.target.value)} placeholder="Destination (e.g. Tokyo)" /></div>
      <div className="row"><input className="inp" type="datetime-local" value={dep} onChange={e => setDep(e.target.value)} /><input className="inp" type="datetime-local" value={arr} onChange={e => setArr(e.target.value)} /></div>
      <button className="btn" disabled={!origin.trim() || !dest.trim() || !dep || !arr || loading} onClick={handleGenerate}>{loading ? '⏳ Generating...' : '💊 Get Protocol'}</button>
      {loading && <div className="ld"><span /><span /><span /></div>}
      {result && !loading && <>
        <div style={{ textAlign: 'center' }}><span className={`severity ${result.severity}`}>Severity: {result.severity}</span></div>
        <div className="timeline">{result.schedule.map((s, i) => (
          <div key={i} className="tl-item"><span className="tl-time">{s.time}</span><div className="tl-content"><div className="tl-action">{s.action}</div><div className="tl-reason">{s.reason}</div></div></div>
        ))}</div>
        {result.tips?.length > 0 && <div className="tips"><strong>💡 Tips:</strong><br />{result.tips.map((t, i) => <div key={i}>• {t}</div>)}</div>}
      </>}
    </div></div>
  );
}

function App() {
  return (<BrowserRouter><div className="app">
    <header className="hdr"><a href="/"><span style={{ fontSize: '1.5rem' }}>💊</span><div><h1>JetLagRx</h1></div></a></header>
    <Routes><Route path="/" element={<JetLagPage />} /></Routes>
    <footer className="ftr">© {new Date().getFullYear()} JetLagRx — An AVS Media App.</footer>
  </div></BrowserRouter>);
}
export default App;
