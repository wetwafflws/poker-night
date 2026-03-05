import { chip } from '../../utils/formatting';

export function PotDisplay({ totalPot, sidePots, mainPot, players, t }) {
  return (
    <div style={{textAlign:"center",marginBottom:22}}>
      <div style={{display:"inline-flex",flexDirection:"column",alignItems:"center",
                   background:t.surface,border:`2px solid ${t.accent}50`,
                   borderRadius:22,padding:"14px 48px",boxShadow:`0 0 40px ${t.accent}18`}}>
        <div style={{color:t.textMuted,fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:3}}>TOTAL POT</div>
        <div style={{color:t.accent,fontSize:44,fontWeight:800,letterSpacing:-1.5}}>{chip(totalPot)}</div>
        {sidePots.length>0&&(
          <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap",justifyContent:"center"}}>
            {sidePots.map((sp,i)=>(
              <div key={i} style={{background:t.purpleSoft,border:`1px solid ${t.purple}50`,borderRadius:8,
                                   padding:"3px 10px",fontSize:12,color:t.purple,fontWeight:600}}>
                {i===0?"Main":"Side "+(i)} {chip(sp.amount)} — {sp.eligibleIds.map(id=>players.find(p=>p.id===id)?.name).join(", ")}
              </div>
            ))}
            {mainPot>0&&(
              <div style={{background:t.accentSoft,border:`1px solid ${t.accent}50`,borderRadius:8,
                           padding:"3px 10px",fontSize:12,color:t.accent,fontWeight:600}}>
                Current bets: {chip(mainPot)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
