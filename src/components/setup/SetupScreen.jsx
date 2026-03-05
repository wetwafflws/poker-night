import { Card } from '../ui/Card';
import { Label } from '../ui/Label';
import { FormRow } from '../ui/FormRow';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useState } from 'react';

export function SetupScreen({ 
  playerNames, 
  playerAmounts,
  newName, 
  buyIn, 
  smallBlind, 
  bigBlind, 
  blindTimer, 
  blindMultiplier,
  onPlayerNamesChange,
  onPlayerAmountsChange,
  onNewNameChange,
  onAddPlayer,
  onBuyInChange,
  onSmallBlindChange,
  onBigBlindChange,
  onBlindTimerChange,
  onBlindMultiplierChange,
  onStartGame,
  onToggleDark,
  dark,
  t 
}) {
  const movePlayerUp = (idx) => {
    if(idx === 0) return;
    const newNames = [...playerNames];
    [newNames[idx-1], newNames[idx]] = [newNames[idx], newNames[idx-1]];
    onPlayerNamesChange(newNames);
  };

  const movePlayerDown = (idx) => {
    if(idx === playerNames.length - 1) return;
    const newNames = [...playerNames];
    [newNames[idx], newNames[idx+1]] = [newNames[idx+1], newNames[idx]];
    onPlayerNamesChange(newNames);
  };

  const updatePlayerName = (idx, value) => {
    const newNames = [...playerNames];
    newNames[idx] = value;
    onPlayerNamesChange(newNames);
  };

  const removePlayer = (idx) => {
    if(playerNames.length <= 2) return;
    onPlayerNamesChange(playerNames.filter((_, i) => i !== idx));
  };

  const [importText, setImportText] = useState("");

  const handleImportGame = () => {
    const lines = importText.trim().split('\n').filter(l => l.trim().length > 0);
    if(lines.length < 2) {
      alert("Need at least 2 players. Format: Name:Amount on each line");
      return;
    }
    
    try {
      const amounts = {};
      const imported = lines.map((line, idx) => {
        const parts = line.split(':');
        if(parts.length < 1) throw new Error("Invalid format");
        const name = parts[0].trim();
        const amount = parts[1] ? parseInt(parts[1].trim()) : null;
        if(amount !== null && !isNaN(amount)) {
          amounts[idx] = amount;
        }
        return name;
      }).filter(n => n.length > 0);
      
      if(imported.length >= 2) {
        onPlayerNamesChange(imported);
        onPlayerAmountsChange(amounts);
        setImportText("");
        alert(`Imported ${imported.length} players!`);
      } else {
        alert("Need at least 2 players");
      }
    } catch(e) {
      alert("Invalid format. Use: Name:Amount on each line");
    }
  };

  return (
    <div style={{minHeight:"100vh",background:t.bg,fontFamily:"system-ui,-apple-system,sans-serif",
                 display:"flex",flexDirection:"column",alignItems:"center",padding:"40px 20px"}}>
      <div style={{maxWidth:520,width:"100%"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:36}}>
          <div>
            <h1 style={{margin:0,fontSize:34,fontWeight:800,color:t.text,letterSpacing:-1}}>♠ Poker Night</h1>
            <p style={{margin:"5px 0 0",color:t.textMuted,fontSize:15}}>Configure your game</p>
          </div>
          <button onClick={onToggleDark}
            style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:10,
                   width:42,height:42,cursor:"pointer",fontSize:20,display:"flex",
                   alignItems:"center",justifyContent:"center"}}>
            {dark?"☀️":"🌙"}
          </button>
        </div>

        <Card t={t} style={{marginBottom:14,background:t.accentSoft,border:`1px solid ${t.accent}40`}}>
          <div style={{fontSize:13,lineHeight:1.6,color:t.text}}>
            <div style={{fontWeight:700,marginBottom:8,color:t.accent}}>📋 How to use:</div>
            <ul style={{margin:0,paddingLeft:18}}>
              <li>Add players and configure stakes before starting</li>
              <li>Track hands with community cards and hole cards</li>
              <li>Log actions (fold, check, call, bet, raise, all-in)</li>
              <li>View hand rankings and pot distribution automatically</li>
              <li>Undo moves if you make a mistake</li>
              <li>Track buy-in history and player balance</li>
            </ul>
          </div>
        </Card>

        <Card t={t} style={{marginBottom:14}}>
          <Label t={t}>Import Game State</Label>
          <div style={{color:t.textMuted,fontSize:12,marginBottom:8}}>
            Paste a saved game state to import players
          </div>
          <textarea 
            value={importText}
            onChange={e=>setImportText(e.target.value)}
            placeholder="Paste saved game state here..."
            style={{
              width:"100%",
              boxSizing:"border-box",
              minHeight:60,
              padding:10,
              background:t.surface2,
              border:`1px solid ${t.border}`,
              borderRadius:8,
              color:t.text,
              fontFamily:"monospace",
              fontSize:12,
              marginBottom:8,
              fontWeight:500,
              resize:"vertical"
            }}
          />
          <Button 
            onClick={handleImportGame}
            bg={t.accent}
            px={16}
            py={10}
            fz={13}
            style={{width:"100%"}}>
            📥 Import Players
          </Button>
        </Card>

        <Card t={t} style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <Label t={t}>Players</Label>
            {Object.keys(playerAmounts).length > 0 && (
              <Button 
                onClick={() => onPlayerAmountsChange({})}
                bg={t.surface2}
                px={10}
                py={6}
                fz={11}
                style={{border:`1px solid ${t.border}`}}>
                Reset Amounts
              </Button>
            )}
          </div>
          {playerNames.map((n,i)=>{
            const seatLabel = playerNames.length===2
              ? (i===0?"D/SB":i===1?"BB":"")
              : (i===0?"D":i===1?"SB":i===2?"BB":"");
            const seatColor = i===0?"#d97706":i===1?t.accent:i===2?t.red:t.textMuted;
            const amount = playerAmounts[i] || buyIn;
            return (
              <div key={i} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
                <div style={{display:"flex",flexDirection:"column",gap:2}}>
                  <button onClick={()=>movePlayerUp(i)}
                    style={{background:i===0?t.disabledBg:t.surface2,border:`1px solid ${t.border}`,borderRadius:4,
                            width:20,height:18,cursor:i===0?"default":"pointer",color:t.textMuted,fontSize:10,lineHeight:1,
                            display:"flex",alignItems:"center",justifyContent:"center",opacity:i===0?0.3:1}}>▲</button>
                  <button onClick={()=>movePlayerDown(i)}
                    style={{background:i===playerNames.length-1?t.disabledBg:t.surface2,border:`1px solid ${t.border}`,borderRadius:4,
                            width:20,height:18,cursor:i===playerNames.length-1?"default":"pointer",color:t.textMuted,fontSize:10,lineHeight:1,
                            display:"flex",alignItems:"center",justifyContent:"center",opacity:i===playerNames.length-1?0.3:1}}>▼</button>
                </div>
                <span style={{color:seatColor,fontSize:11,fontWeight:700,width:32,textAlign:"center",
                              background:seatColor+"18",borderRadius:5,padding:"2px 4px"}}>{seatLabel||String(i+1)}</span>
                <Input value={n} onChange={e=>updatePlayerName(i, e.target.value)} style={{flex:1}} t={t}/>
                <Input 
                  type="number" 
                  value={amount} 
                  onChange={e=>{
                    const newAmounts = {...playerAmounts};
                    newAmounts[i] = +e.target.value;
                    onPlayerAmountsChange(newAmounts);
                  }}
                  style={{width:80}} 
                  t={t}
                />
                {playerNames.length>2&&(
                  <button onClick={()=>removePlayer(i)}
                    style={{background:t.redSoft,border:`1px solid ${t.red}40`,borderRadius:8,
                            padding:"8px 12px",color:t.red,cursor:"pointer",fontSize:16,fontWeight:700,lineHeight:1}}>×</button>
                )}
              </div>
            );
          })}
          <div style={{display:"flex",gap:8,marginTop:10}}>
            <Input value={newName} onChange={e=>onNewNameChange(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter"&&newName.trim()){onAddPlayer();}}}
              placeholder="Add player…" style={{flex:1}} t={t}/>
            <Button onClick={onAddPlayer}
              bg={t.accent} px={16} py={10} fz={14}>+ Add</Button>
          </div>
        </Card>

        <Card t={t} style={{marginBottom:14}}>
          <Label t={t}>Stakes</Label>
          <FormRow label="Buy-in per player" t={t}>
            <Input type="number" value={buyIn} onChange={e=>onBuyInChange(+e.target.value)} style={{width:110}} t={t}/>
          </FormRow>
          <FormRow label="Small Blind" t={t}>
            <Input type="number" value={smallBlind} onChange={e=>onSmallBlindChange(+e.target.value)} style={{width:110}} t={t}/>
          </FormRow>
          <FormRow label="Big Blind" t={t}>
            <Input type="number" value={bigBlind} onChange={e=>onBigBlindChange(+e.target.value)} style={{width:110}} t={t}/>
          </FormRow>
        </Card>

        <Card t={t} style={{marginBottom:14}}>
          <Label t={t}>Blind Timer</Label>
          <FormRow label="Increase every (min, 0 = manual)" t={t}>
            <Input type="number" value={blindTimer} onChange={e=>onBlindTimerChange(+e.target.value)} style={{width:90}} t={t}/>
          </FormRow>
          <FormRow label="Multiply blinds by" t={t}>
            <Input type="number" step="0.5" value={blindMultiplier} onChange={e=>onBlindMultiplierChange(+e.target.value)} style={{width:90}} t={t}/>
          </FormRow>
        </Card>

        <Button onClick={onStartGame} bg={t.accent} style={{width:"100%",padding:"15px",fontSize:17,fontWeight:700,borderRadius:12}}>
          Start Game →
        </Button>
      </div>
    </div>
  );
}
