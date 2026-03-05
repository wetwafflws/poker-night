import { Button } from '../ui/Button';

export function PhasePromptModal({ pendingPhase, onConfirm, t }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:1000,
                 display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:t.surface,border:`2px solid ${t.accent}`,borderRadius:22,
                   padding:36,maxWidth:420,width:"100%",textAlign:"center",
                   boxShadow:`0 0 80px ${t.accent}30`}}>
        <div style={{fontSize:48,marginBottom:14}}>🃏</div>
        <div style={{fontSize:30,fontWeight:800,color:t.text,marginBottom:10}}>{pendingPhase?.toUpperCase()}</div>
        <div style={{color:t.textSub,fontSize:15,lineHeight:1.7,marginBottom:28}}>
          Betting round complete!<br/>
          {pendingPhase==="flop"&&"Deal 3 cards face up, then enter them."}
          {pendingPhase==="turn"&&"Deal 1 card face up (the turn)."}
          {pendingPhase==="river"&&"Deal 1 card face up (the river)."}
        </div>
        <Button onClick={onConfirm} bg={t.accent}
          style={{width:"100%",padding:"15px",fontSize:16,fontWeight:700,borderRadius:12}}>
          Enter {pendingPhase==="flop"?"3 Cards":"Card"} →
        </Button>
      </div>
    </div>
  );
}
