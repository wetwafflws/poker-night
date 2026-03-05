export function Modal({ title, children, onClose, t, wide=false }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:999,
                 display:"flex",alignItems:"center",justifyContent:"center",padding:16}}
         onClick={onClose}>
      <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:18,
                   padding:26,maxWidth:wide?640:460,width:"100%",maxHeight:"85vh",overflowY:"auto",
                   boxShadow:"0 28px 72px rgba(0,0,0,0.35)"}}
           onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <span style={{fontSize:18,fontWeight:700,color:t.text}}>{title}</span>
          <button onClick={onClose} style={{background:t.surface2,border:`1px solid ${t.border}`,borderRadius:8,
                  width:32,height:32,color:t.textSub,cursor:"pointer",fontSize:20,lineHeight:"32px",textAlign:"center"}}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
