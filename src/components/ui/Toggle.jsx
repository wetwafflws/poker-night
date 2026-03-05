export function Toggle({ value, onChange }) {
  return (
    <div onClick={()=>onChange(!value)}
      style={{width:48,height:27,borderRadius:14,background:value?"#6366f1":"#94a3b8",
               cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}>
      <div style={{position:"absolute",top:3.5,left:value?24:3.5,width:20,height:20,
                   borderRadius:"50%",background:"#fff",transition:"left 0.18s",
                   boxShadow:"0 1px 5px rgba(0,0,0,0.3)"}}/>
    </div>
  );
}
