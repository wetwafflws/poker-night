import { SUITS, RANKS, SUIT_COLORS, SUIT_SYMBOLS } from '../../utils/constants';
import { CardFace } from './CardFace';
import { Button } from './Button';

export function CardPicker({ onSelect, onClose, usedCards=[], maxCards=1, currentCount=0, t }) {
  const remaining = maxCards - currentCount;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:1000,
                 display:"flex",alignItems:"center",justifyContent:"center",padding:16}}
         onClick={onClose}>
      <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:18,padding:24,
                   maxWidth:560,width:"100%",maxHeight:"88vh",overflowY:"auto",
                   boxShadow:"0 32px 80px rgba(0,0,0,0.4)"}}
           onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div>
            <div style={{fontSize:18,fontWeight:700,color:t.text}}>Select Card</div>
            {maxCards>1&&<div style={{fontSize:13,color:t.textMuted,marginTop:2}}>Pick {remaining} more card{remaining!==1?"s":""}</div>}
          </div>
          <Button onClick={onClose} bg={t.surface2} color={t.text} border={`1px solid ${t.border}`} px={14} py={7} fz={14}>Done</Button>
        </div>
        {SUITS.map(suit=>(
          <div key={suit} style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap",alignItems:"center"}}>
            <span style={{width:24,fontSize:20,color:SUIT_COLORS[suit],textAlign:"center"}}>{SUIT_SYMBOLS[suit]}</span>
            {RANKS.map(rank=>{
              const id=rank+suit, used=usedCards.includes(id);
              return (
                <div key={id} style={{opacity:used?0.18:1,cursor:used?"not-allowed":"pointer",transition:"transform 0.1s"}}
                     onMouseEnter={e=>{if(!used)e.currentTarget.style.transform="scale(1.13)";}}
                     onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";}}
                     onClick={()=>!used&&onSelect(rank,suit)}>
                  <CardFace rank={rank} suit={suit} small/>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
