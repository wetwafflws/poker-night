import { Button } from '../ui/Button';

export function ConfirmBackModal({ onConfirm, onCancel, t }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,
                 display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:16,
                   padding:32,maxWidth:400,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:16}}>⚠️</div>
        <div style={{fontSize:20,fontWeight:700,color:t.text,marginBottom:8}}>
          Go Back to Setup?
        </div>
        <div style={{color:t.textMuted,fontSize:14,marginBottom:24}}>
          You'll lose your current game. Are you sure?
        </div>
        <div style={{display:"flex",gap:10}}>
          <Button onClick={onCancel} bg={t.surface} color={t.text} style={{flex:1,padding:"12px",fontSize:15,border:`1px solid ${t.border}`}}>
            Cancel
          </Button>
          <Button onClick={onConfirm} bg={t.red} style={{flex:1,padding:"12px",fontSize:15,fontWeight:700}}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
