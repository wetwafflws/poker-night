import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Label } from '../ui/Label';
import { chip } from '../../utils/formatting';

export function BuyInModal({ player, buyIn, buyInAmount, onAmountChange, onConfirm, onRepayDebt, buyInHistory, onClose, t }) {
  return (
    <Modal title={`Buy In — ${player.name}`} onClose={onClose} t={t}>
      <Input type="number" value={buyInAmount} onChange={e=>onAmountChange(e.target.value)}
        placeholder={`Amount (default $${buyIn})`} style={{width:"100%",marginBottom:14}} t={t}/>
      <Button onClick={onConfirm} bg={t.green} style={{width:"100%",padding:"12px"}} fz={15}>Confirm Buy In</Button>
      {player.debt>0 && player.stack>0 && (
        <div style={{marginTop:10,padding:"10px 14px",background:t.redSoft,border:`1px solid ${t.red}40`,borderRadius:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{color:t.red,fontWeight:700,fontSize:14}}>Owes dealer: {chip(player.debt)}</div>
              <div style={{color:t.textMuted,fontSize:12,marginTop:2}}>Stack: {chip(player.stack)} · Can repay up to {chip(Math.min(player.debt,player.stack))}</div>
            </div>
            <Button onClick={onRepayDebt}
              bg={t.red} color="#fff" px={12} py={7} fz={13}>
              Repay {chip(Math.min(player.debt,player.stack))}
            </Button>
          </div>
        </div>
      )}
      {buyInHistory.filter(h=>h.player===player.name).length>0&&(
        <div style={{marginTop:14,borderTop:`1px solid ${t.border}`,paddingTop:12}}>
          <Label t={t}>Previous Buy-ins</Label>
          {buyInHistory.filter(h=>h.player===player.name).map((h,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",color:t.textSub,fontSize:13,marginBottom:5}}>
              <span>{h.time}</span><span style={{color:t.red,fontWeight:600}}>+{chip(h.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
