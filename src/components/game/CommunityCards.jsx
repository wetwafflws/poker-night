import { PHASES } from '../../utils/constants';
import { CardFace } from '../ui/CardFace';
import { Card } from '../ui/Card';

export function CommunityCards({ communityCards, phase, onAddCard, onRemoveCard, t }) {
  return (
    <Card t={t} style={{marginBottom:22}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <span style={{fontSize:15,fontWeight:700,color:t.text}}>Community Cards</span>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
          {PHASES.slice(0,-1).map(ph=>(
            <span key={ph} style={{padding:"3px 11px",borderRadius:20,fontSize:12,fontWeight:600,
              background:phase===ph?t.accent:t.surface2,color:phase===ph?"#fff":t.textMuted}}>{ph}</span>
          ))}
        </div>
      </div>
      <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
        {communityCards.map((c,i)=>(
          <div key={i} style={{position:"relative"}}>
            <CardFace rank={c.rank} suit={c.suit}/>
            <button onClick={()=>onRemoveCard(i)}
              style={{position:"absolute",top:-7,right:-7,background:t.red,border:"none",borderRadius:"50%",
                      width:22,height:22,color:"#fff",fontSize:13,cursor:"pointer",lineHeight:"22px",textAlign:"center"}}>×</button>
          </div>
        ))}
        {communityCards.length<5&&(
          <div onClick={onAddCard}
            style={{width:68,height:94,border:`2px dashed ${t.border}`,borderRadius:9,display:"flex",
                    alignItems:"center",justifyContent:"center",cursor:"pointer",color:t.textMuted,
                    fontSize:30,background:t.surface2,transition:"border-color 0.15s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=t.accent}
            onMouseLeave={e=>e.currentTarget.style.borderColor=t.border}>+</div>
        )}
      </div>
    </Card>
  );
}
