import { Button } from '../ui/Button';

export function GameWinnerModal({ winner, onClose, t }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,
                 display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:t.surface,border:`3px solid ${t.accent}`,borderRadius:24,
                   padding:48,maxWidth:480,width:"100%",textAlign:"center",
                   boxShadow:`0 0 120px ${t.accent}40`}}>
        <div style={{fontSize:72,marginBottom:20}}>🏆</div>
        <div style={{fontSize:36,fontWeight:800,color:t.accent,marginBottom:12}}>
          Game Winner!
        </div>
        <div style={{fontSize:24,fontWeight:700,color:t.text,marginBottom:32}}>
          {winner.name}
        </div>
        <Button onClick={onClose} bg={t.accent}
          style={{width:"100%",padding:"16px",fontSize:17,fontWeight:700,borderRadius:14}}>
          Review Summary
        </Button>
      </div>
    </div>
  );
}
