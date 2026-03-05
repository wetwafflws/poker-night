import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { chip } from '../../utils/formatting';

export function ActionControls({ 
  player,
  currentBet, 
  minRaise, 
  minBet,
  betInput,
  onBetInputChange,
  onAction,
  t 
}) {
  return (
    <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
      <Button onClick={()=>onAction("fold")} bg={t.red} px={12} py={8} fz={14}>Fold</Button>
      {currentBet===player.bet&&<Button onClick={()=>onAction("check")} bg={t.accent} px={12} py={8} fz={14}>Check</Button>}
      {currentBet>player.bet&&(
        <Button onClick={()=>onAction("call")} bg={t.accent} px={12} py={8} fz={14}>
          Call {chip(Math.min(currentBet-player.bet,player.stack))}
          {player.stack<=currentBet-player.bet?" (all-in)":""}
        </Button>
      )}
      <Button onClick={()=>onAction("allin")} bg={t.purple} px={12} py={8} fz={14}>All In</Button>
      <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{position:"relative"}}>
          <Input type="number" value={betInput} onChange={e=>onBetInputChange(e.target.value)}
            placeholder={`Min: ${chip(currentBet>0?minRaise:minBet)}`}
            style={{width:120,padding:"8px 10px",fontSize:13}} t={t}/>
        </div>
        <Button onClick={()=>onAction(currentBet>0?"raise":"bet",betInput)} bg={t.yellow} px={12} py={8} fz={14}>
          {currentBet>0?"Raise":"Bet"}
        </Button>
      </div>
    </div>
  );
}
