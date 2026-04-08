import React, { useState, useEffect } from 'react';

const App = () => {
  const [view, setView] = useState('login'); 
  const [isFoundersTier, setIsFoundersTier] = useState(false);
  const [balance, setBalance] = useState(1240.50);
  const [totalEarned, setTotalEarned] = useState(0.42);
  const [isLiquidating, setIsLiquidating] = useState(false);
  const [logs, setLogs] = useState([]);
  const [showReserves, setShowReserves] = useState(false);
  
  const [vendor, setVendor] = useState('Starbucks');
  const [amount, setAmount] = useState(5.75);

  const yieldRate = isFoundersTier ? 0.000002 : 0.000001;

  useEffect(() => {
    if (view === 'dashboard') {
      const timer = setInterval(() => {
        setBalance(prev => prev + yieldRate);
        setTotalEarned(prev => prev + yieldRate);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [view, yieldRate]);

  const triggerAtomicSwap = () => {
    const mainAmount = parseFloat(amount);
    if (isNaN(mainAmount) || mainAmount <= 0) return alert("Enter a valid amount");
    
    setIsLiquidating(true);
    setTimeout(() => {
      // Dynamic Round-up Logic
      const nextWhole = Math.ceil(mainAmount);
      const roundUp = (nextWhole === mainAmount) ? 1.00 : (nextWhole - mainAmount);
      const total = mainAmount + parseFloat(roundUp);
      
      setBalance(prev => prev - total);
      setLogs([{ 
        id: Date.now(), 
        vendor: vendor, 
        amt: mainAmount.toFixed(2),
        roundUp: parseFloat(roundUp).toFixed(2),
        hash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`
      }, ...logs]);
      setIsLiquidating(false);
    }, 1200);
  };

  const theme = {
    background: isFoundersTier ? '#0a0a0a' : '#f4f7f9',
    card: isFoundersTier ? 'linear-gradient(145deg, #1e1e1e, #000)' : '#fff',
    text: isFoundersTier ? '#fff' : '#1a1a1a',
    accent: isFoundersTier ? '#d4af37' : '#0052FF'
  };

  if (view === 'login') {
    return (
      <div style={{ backgroundColor: '#0052FF', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#fff', fontFamily: 'sans-serif' }}>
        <h1 style={{fontSize: '40px', fontWeight: '800'}}>ATOMIC<span style={{opacity: 0.6}}>YIELD</span></h1>
        <button onClick={() => setView('dashboard')} style={{ padding: '15px 40px', borderRadius: '30px', border: 'none', backgroundColor: '#fff', color: '#0052FF', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}>
          Secure Login (MPC)
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: theme.background, minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif', color: theme.text }}>
      <div style={{ maxWidth: '400px', margin: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontWeight: 'bold' }}>
          <span>ATOMIC<span style={{color: theme.accent}}>YIELD</span></span>
          <div style={{display: 'flex', gap: '5px'}}>
            <button onClick={() => setShowReserves(!showReserves)} style={{fontSize: '10px', background: 'transparent', border: '1px solid #ccc', color: theme.text, borderRadius: '10px', padding: '2px 8px'}}>Reserves</button>
            <button onClick={() => setIsFoundersTier(!isFoundersTier)} style={{fontSize: '10px', background: 'transparent', border: `1px solid ${theme.accent}`, color: theme.accent, borderRadius: '10px', padding: '2px 8px'}}>{isFoundersTier ? 'PRO' : 'BASIC'}</button>
          </div>
        </header>

        {showReserves && (
          <div style={{ background: '#e8f0fe', padding: '10px', borderRadius: '10px', marginBottom: '15px', fontSize: '11px', color: '#0052FF', border: '1px solid #0052FF' }}>
            <strong>Institutional Partner:</strong> BlackRock BUIDL (T-Bills)<br/>
            <strong>Status:</strong> 100% Collateralized | <strong>Auditor:</strong> SOC2 Type II
          </div>
        )}

        <div style={{ background: theme.card, padding: '30px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontSize: '38px', margin: '0' }}>${balance.toFixed(6)}</h1>
          <p style={{ color: theme.accent, fontSize: '14px', fontWeight: '600' }}>Yielding 5.25% APY</p>
        </div>

        <div style={{ marginTop: '20px', background: theme.card, padding: '15px', borderRadius: '15px', border: `1px solid ${theme.accent}33` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>Lifetime Earnings</span>
            <span style={{ color: '#00C805', fontWeight: 'bold' }}>+${totalEarned.toFixed(4)}</span>
          </div>
          <p style={{ fontSize: '10px', marginTop: '8px', opacity: 0.5 }}>Simulated vs. 0.01% TradFi Checking</p>
        </div>

        <div style={{ marginTop: '25px', background: 'rgba(0,0,0,0.05)', padding: '20px', borderRadius: '15px' }}>
          <input type="text" value={vendor} onChange={(e) => setVendor(e.target.value)} style={{ width: '90%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '90%', padding: '10px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd' }} />
          <button onClick={triggerAtomicSwap} disabled={isLiquidating} style={{ width: '100%', padding: '15px', borderRadius: '10px', background: theme.accent, color: isFoundersTier ? '#000' : '#fff', border: 'none', fontWeight: 'bold' }}>
            {isLiquidating ? "Atomic Swap..." : `Pay ${vendor}`}
          </button>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h4 style={{fontSize: '11px', opacity: 0.5}}>L2 SETTLEMENT LOG</h4>
          {logs.map(log => (
            <div key={log.id} style={{ padding: '12px', background: theme.card, borderRadius: '10px', marginTop: '8px', fontSize: '13px', border: '1px solid #eee4' }}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <strong>{log.vendor}</strong>
                <span>-${log.amt}</span>
              </div>
              <div style={{ fontSize: '10px', color: theme.accent, marginTop: '4px' }}>{log.msg} | Round-up: +${log.roundUp}</div>
              <div style={{ fontSize: '9px', opacity: 0.4, fontFamily: 'monospace', marginTop: '4px' }}>Hash: {log.hash}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;