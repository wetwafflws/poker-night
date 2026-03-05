import { Modal } from '../ui/Modal';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { chip } from '../../utils/formatting';

export function SummaryModal({ players, initialStacks, buyInHistory, onClose, t }) {
  return (
    <Modal title="📊 End-of-Night Summary" onClose={onClose} t={t} wide>
      <div style={{marginBottom:20}}>
        <Label t={t}>Player Standings</Label>
        {players.map(p=>{
          const initStack = initialStacks[p.id] || 0;
          const netWin = p.stack - initStack;
          const netColor = netWin >= 0 ? t.green : t.red;
          return (
            <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
              padding:"10px 14px",background:t.surface2,borderRadius:10,marginBottom:8}}>
              <div>
                <div style={{fontWeight:700,fontSize:15,color:t.text}}>{p.name}</div>
                <div style={{fontSize:12,color:t.textMuted,marginTop:2}}>
                  Buy-in: {chip(initStack)} → Stack: {chip(p.stack)}
                  {p.debt>0&&<span style={{color:t.red}}> (Owes {chip(p.debt)})</span>}
                </div>
              </div>
              <div style={{fontSize:18,fontWeight:700,color:netColor}}>
                {netWin>=0?"+":""}{chip(netWin)}
              </div>
            </div>
          );
        })}
      </div>

      {buyInHistory.length>0&&(
        <div style={{marginTop:20,borderTop:`1px solid ${t.border}`,paddingTop:16}}>
          <Label t={t}>Buy-In History</Label>
          {buyInHistory.map((h,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:13,
              color:t.textSub,marginBottom:5,padding:"6px 0"}}>
              <span>{h.player}</span>
              <span>{h.time}</span>
              <span style={{color:t.red,fontWeight:600}}>+{chip(h.amount)}</span>
            </div>
          ))}
        </div>
      )}

      <Button onClick={onClose} bg={t.accent} style={{width:"100%",padding:"12px",marginTop:16}} fz={15}>
        Close
      </Button>
    </Modal>
  );
}
