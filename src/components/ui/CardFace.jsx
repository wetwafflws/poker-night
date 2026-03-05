import { SUIT_COLORS, SUIT_SYMBOLS } from '../../utils/constants';

export function CardFace({ rank, suit, small }) {
  const col = SUIT_COLORS[suit];
  const w=small?46:68, h=small?64:94;
  return (
    <div style={{width:w,height:h,borderRadius:9,background:"linear-gradient(160deg,#fff,#f1f5f9)",
                 border:"1.5px solid #cbd5e1",boxShadow:"0 3px 12px rgba(0,0,0,0.2)",
                 display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                 userSelect:"none",flexShrink:0}}>
      <span style={{fontSize:small?14:20,fontWeight:800,color:col,lineHeight:1,fontFamily:"system-ui,sans-serif"}}>{rank}</span>
      <span style={{fontSize:small?20:28,color:col,lineHeight:1}}>{SUIT_SYMBOLS[suit]}</span>
    </div>
  );
}
