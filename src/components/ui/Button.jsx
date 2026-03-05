import { useState } from "react";

export function Button({ onClick, bg, color="#fff", border="none", children, disabled, px=16, py=9, fz=14, fw=600, radius=10, style={} }) {
  const [h,setH]=useState(false);
  return (
    <button onClick={!disabled?onClick:undefined} disabled={disabled}
      onMouseEnter={()=>!disabled&&setH(true)} onMouseLeave={()=>setH(false)}
      style={{background:h&&!disabled?bg+"dd":bg,border,borderRadius:radius,
              padding:`${py}px ${px}px`,color,cursor:disabled?"default":"pointer",
              fontSize:fz,fontWeight:fw,fontFamily:"system-ui,sans-serif",
              transition:"all 0.15s",lineHeight:1,opacity:disabled?0.38:1,...style}}>
      {children}
    </button>
  );
}
