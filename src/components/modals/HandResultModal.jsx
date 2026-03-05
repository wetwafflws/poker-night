import { Modal } from '../ui/Modal';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { CardFace } from '../ui/CardFace';
import { chip } from '../../utils/formatting';
import { splitPot } from '../../utils/sidePots';

export function HandResultModal({ 
  ranked, 
  sidePots, 
  hadSidePots,
  players,
  communityCards,
  totalPotDisplay,
  potAwarded,
  onAwardPot,
  onSplitPot,
  onAwardSidePot,
  onSplitSidePot,
  onStartNextHand,
  onClose,
  t 
}) {
  return (
    <Modal title="Hand Results" onClose={onClose} t={t} wide>
      {/* ── SIDE POTS: award each one; mark awarded, never remove ── */}
      {hadSidePots&&(
        <div style={{marginBottom:16}}>
          <Label t={t}>Side Pots — Award Each Separately</Label>
          {sidePots.map((sp,pIdx)=>{
            const eligible=players
              .filter(p=>sp.eligibleIds.includes(p.id)&&!p.folded&&p.holeCards.length===2)
              .map(p=>({...p,hand:ranked.find(r=>r.id===p.id)?.hand}))
              .filter(p=>p.hand)
              .sort((a,b)=>b.hand.score-a.hand.score);
            const topScore=eligible[0]?.hand?.score;
            const tiedWinners=eligible.filter(p=>p.hand.score===topScore);
            const isAwarded=!!sp.awarded;
            return (
              <div key={pIdx} style={{background:isAwarded?t.greenSoft:t.surface2,
                border:`1px solid ${isAwarded?t.green+"50":t.border}`,borderRadius:12,padding:14,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <span style={{fontWeight:700,color:isAwarded?t.green:t.purple,fontSize:14}}>
                    {isAwarded?"✓ ":""}{pIdx===0?"Main Pot":"Side Pot "+pIdx}: {chip(sp.amount)}
                    {isAwarded&&<span style={{fontWeight:400,fontSize:12,color:t.textMuted}}> — awarded</span>}
                  </span>
                  <span style={{color:t.textMuted,fontSize:12}}>
                    {sp.eligibleIds.map(id=>players.find(p=>p.id===id)?.name).join(", ")}
                  </span>
                </div>
                {!isAwarded&&tiedWinners.length>1&&(
                  <div style={{background:t.yellowSoft,border:`1px solid ${t.yellow}50`,borderRadius:8,
                    padding:"6px 10px",fontSize:12,color:t.yellow,marginBottom:8}}>
                    🤝 Draw: {tiedWinners.map(p=>p.name).join(" & ")} — {tiedWinners[0].hand.name}
                  </div>
                )}
                {!isAwarded&&(
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {tiedWinners.length>1?(
                      <Button onClick={()=>onSplitSidePot(pIdx, tiedWinners)} 
                        bg={t.yellow} px={14} py={8} fz={13}>
                        🤝 Split {chip(sp.amount)} ({tiedWinners.map(p=>p.name).join(" & ")})
                      </Button>
                    ):(
                      sp.eligibleIds.map(id=>{
                        const pl=players.find(p=>p.id===id);
                        const isTop=eligible[0]?.id===id;
                        return (
                          <Button key={id} onClick={()=>onAwardSidePot(pIdx, id)}
                            bg={isTop?t.green:t.accent} px={12} py={7} fz={13}>
                            {isTop&&"🏆 "}{pl?.name}{isTop&&eligible[0]?.hand?.name?` (${eligible[0].hand.name})`:""}
                          </Button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Once all side pots awarded, show Next Hand */}
          {sidePots.every(sp=>sp.awarded)&&onStartNextHand&&(
            <Button onClick={onStartNextHand}
              bg={t.green} style={{width:"100%",padding:"13px",fontSize:15,fontWeight:700,borderRadius:12,marginTop:4}}>
              🃏 Start Next Hand
            </Button>
          )}
          
          {sidePots.every(sp=>sp.awarded)&&!onStartNextHand&&(
            <div style={{padding:"12px",background:t.surface2,borderRadius:10,textAlign:"center",color:t.textMuted,fontSize:14,marginTop:4}}>
              Only one player remaining. Add more players to continue.
            </div>
          )}
        </div>
      )}

      {/* ── MAIN POT: only shown when there were NO side pots this hand ── */}
      {!hadSidePots&&(()=>{
        const topScore=ranked[0]?.hand?.score;
        const tiedWinners=ranked.filter(p=>p.hand.score===topScore);
        const isDraw=tiedWinners.length>1;
        return (
          <>
            {ranked.length===0&&<p style={{color:t.textSub,fontSize:14}}>Add hole cards to auto-evaluate hands.</p>}

            {isDraw&&ranked.length>0&&(
              <div style={{background:t.yellowSoft,border:`1px solid ${t.yellow}50`,borderRadius:10,
                padding:"10px 14px",fontSize:14,color:t.yellow,fontWeight:600,marginBottom:14}}>
                🤝 Draw! {tiedWinners.map(p=>p.name).join(" & ")} tie with {tiedWinners[0].hand.name}
              </div>
            )}

            {ranked.map((p,i)=>{
              return (
                <div key={p.id} style={{display:"flex",gap:12,alignItems:"center",marginBottom:10,padding:14,
                  background:i===0?t.greenSoft:t.surface2,borderRadius:12,
                  border:`1px solid ${i===0?t.green+"50":t.border}`}}>
                  <span style={{fontSize:22,width:28}}>{i===0?(isDraw?"🤝":"🥇"):i===1?"🥈":"🥉"}</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,color:i===0?t.green:t.text,fontSize:16}}>{p.name}</div>
                    <div style={{fontSize:12,color:t.textMuted,marginTop:2}}>{p.hand.name}</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
                    <div style={{display:"flex",gap:4}}>
                      {p.holeCards.map((c,ci)=>(
                        <div key={ci} style={{outline:p.hand.bestCards?.some(bc=>bc.rank===c.rank&&bc.suit===c.suit)?`2px solid ${t.accent}`:"none",borderRadius:9}}>
                          <CardFace rank={c.rank} suit={c.suit} small/>
                        </div>
                      ))}
                    </div>
                    {p.hand.bestCards&&communityCards.length>0&&(
                      <div style={{display:"flex",gap:3,flexWrap:"wrap",justifyContent:"flex-end"}}>
                        {p.hand.bestCards.filter(c=>communityCards.some(cc=>cc.rank===c.rank&&cc.suit===c.suit)).map((c,ci)=>(
                          <div key={ci} style={{outline:`2px solid ${t.green}`,borderRadius:9}}>
                            <CardFace rank={c.rank} suit={c.suit} small/>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {i===0&&!isDraw&&(
                    <Button onClick={()=>!potAwarded&&onAwardPot(p.id)}
                      bg={potAwarded?t.disabledBg:t.green} color={potAwarded?t.disabledText:"#fff"}
                      disabled={potAwarded} px={12} py={7} fz={13}>
                      {potAwarded?"Awarded ✓":"Award "+chip(totalPotDisplay)}
                    </Button>
                  )}
                </div>
              );
            })}

            {isDraw&&ranked.length>0&&!potAwarded&&(
              <Button onClick={()=>onSplitPot(tiedWinners)}
                bg={t.yellow} style={{width:"100%",padding:"12px",fontSize:15,marginBottom:12}}>
                🤝 Split Pot — {tiedWinners.map(p=>`${p.name} gets ${chip(Math.floor(totalPotDisplay/tiedWinners.length))}`).join(", ")}
              </Button>
            )}

            <div style={{marginTop:14,borderTop:`1px solid ${t.border}`,paddingTop:14}}>
              <Label t={t}>Manually award pot to:</Label>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
                {players.filter(p=>!p.folded).map(p=>(
                  <Button key={p.id} onClick={()=>!potAwarded&&onAwardPot(p.id)}
                    bg={potAwarded?t.disabledBg:t.accent} color={potAwarded?t.disabledText:"#fff"}
                    disabled={potAwarded} px={14} py={8} fz={14}>{p.name}</Button>
                ))}
              </div>
            </div>

            {potAwarded&&onStartNextHand&&(
              <Button onClick={onStartNextHand}
                bg={t.green} style={{width:"100%",padding:"13px",fontSize:15,fontWeight:700,borderRadius:12}}>
                🃏 Start Next Hand
              </Button>
            )}
            
            {potAwarded&&!onStartNextHand&&(
              <div style={{padding:"12px",background:t.surface2,borderRadius:10,textAlign:"center",color:t.textMuted,fontSize:14}}>
                Only one player remaining. Add more players to continue.
              </div>
            )}
          </>
        );
      })()}
    </Modal>
  );
}
