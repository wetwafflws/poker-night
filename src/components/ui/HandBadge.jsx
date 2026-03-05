import { useState, useRef } from "react";
import { CardFace } from './CardFace';

export function HandBadge({ result, isWinner, t }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const [tipPos, setTipPos] = useState({top:0,left:0});

  function handleMouseEnter(e) {
    setHovered(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setTipPos({ top: rect.top - 10, left: rect.left + rect.width/2 });
  }

  if (!result?.hand?.bestCards) return (
    <div style={{padding:"3px 10px",background:isWinner?t.greenSoft:t.surface2,borderRadius:8,
                 fontSize:12,fontWeight:600,color:isWinner?t.green:t.textSub,
                 border:`1px solid ${isWinner?t.green+"50":t.border}`}}>
      {isWinner&&"🏆 "}{result.hand.name}
    </div>
  );

  return (
    <>
      <div ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={()=>setHovered(false)}
        style={{padding:"4px 10px",background:isWinner?t.greenSoft:t.surface2,borderRadius:8,
                fontSize:12,fontWeight:600,color:isWinner?t.green:t.textSub,
                border:`1px solid ${isWinner?t.green+"50":t.border}`,
                cursor:"default",userSelect:"none",position:"relative"}}>
        {isWinner&&"🏆 "}{result.hand.name}
      </div>
      {hovered&&(
        <div style={{position:"fixed",top:tipPos.top,left:tipPos.left,
                     transform:"translate(-50%,-100%)",zIndex:2000,
                     background:"#fff",border:"1.5px solid #cbd5e1",borderRadius:12,
                     padding:"10px 12px",boxShadow:"0 8px 32px rgba(0,0,0,0.22)",
                     pointerEvents:"none"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#64748b",letterSpacing:1,
                       textTransform:"uppercase",marginBottom:8,textAlign:"center"}}>
            {result.hand.name}
          </div>
          <div style={{display:"flex",gap:5}}>
            {result.hand.bestCards.map((c,i)=><CardFace key={i} rank={c.rank} suit={c.suit} small/>)}
          </div>
        </div>
      )}
    </>
  );
}
