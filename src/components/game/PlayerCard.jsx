import { chip } from '../../utils/formatting';
import { CardFace } from '../ui/CardFace';
import { Pill } from '../ui/Pill';
import { Button } from '../ui/Button';
import { HandBadge } from '../ui/HandBadge';

export function PlayerCard({ 
  player, 
  isDealer, 
  isSB, 
  isBB, 
  isTurn, 
  handResult, 
  ranked,
  phase,
  onBuyIn, 
  onAddHoleCard, 
  onRemoveHoleCard,
  onRepayDebt,
  t 
}) {
  const isBankrupt = player.stack===0 && !player.allIn;
  const canBuyIn = isBankrupt;

  return (
    <div style={{
      background:t.surface,borderRadius:16,
      border:`2px solid ${player.folded?t.border:isTurn?t.accent:t.border}`,
      padding:18,opacity:player.folded?0.5:1,
      boxShadow:isTurn?`0 0 0 4px ${t.accent}25,0 6px 20px rgba(0,0,0,0.12)`:"0 2px 8px rgba(0,0,0,0.07)",
      transition:"all 0.2s"
    }}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
        <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:17,fontWeight:700,color:isTurn?t.accent:t.text}}>{player.name}</span>
          {isDealer&&<Pill bg="#d97706" color="#fff">D</Pill>}
          {isSB&&<Pill bg={t.accent} color="#fff">SB</Pill>}
          {isBB&&<Pill bg={t.red} color="#fff">BB</Pill>}
          {player.allIn&&<Pill bg={t.purple} color="#fff">ALL IN</Pill>}
          {player.folded&&<Pill bg={t.surface2} color={t.textMuted}>FOLDED</Pill>}
          {!player.active&&player.stack===0&&!player.allIn&&<Pill bg={t.redSoft} color={t.red}>OUT</Pill>}
        </div>
        <Button
          onClick={onBuyIn}
          bg={canBuyIn?t.green:t.disabledBg}
          color={canBuyIn?t.surface:t.disabledText}
          disabled={!canBuyIn}
          px={10} py={5} fz={12} radius={8}>+ Buy In</Button>
      </div>

      <div style={{display:"flex",gap:18,marginBottom:14}}>
        <div>
          <div style={{color:t.textMuted,fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:2}}>Stack</div>
          <div style={{color:t.green,fontSize:24,fontWeight:800,letterSpacing:-0.5}}>{chip(player.stack)}</div>
        </div>
        {player.bet>0&&<div>
          <div style={{color:t.textMuted,fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:2}}>Bet</div>
          <div style={{color:t.yellow,fontSize:22,fontWeight:700}}>{chip(player.bet)}</div>
        </div>}
        {player.debt>0&&<div>
          <div style={{color:t.textMuted,fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:2}}>Owes</div>
          <div style={{display:"flex",alignItems:"flex-end",gap:6}}>
            <div style={{color:t.red,fontSize:17,fontWeight:700}}>{chip(player.debt)}</div>
            {phase==="showdown"&&player.stack>0&&(
              <Button 
                onClick={onRepayDebt}
                bg={t.red}
                px={8}
                py={4}
                fz={11}
                radius={6}
                style={{fontWeight:600}}>
                Repay
              </Button>
            )}
          </div>
        </div>}
      </div>

      {/* Hole cards */}
      <div style={{display:"flex",gap:8,marginBottom:14,alignItems:"center",flexWrap:"wrap"}}>
        {player.holeCards.map((c,ci)=>(
          <div key={ci} style={{position:"relative"}}>
            <CardFace rank={c.rank} suit={c.suit} small/>
            <button onClick={()=>onRemoveHoleCard(ci)}
              style={{position:"absolute",top:-5,right:-5,background:t.red,border:"none",borderRadius:"50%",
                      width:18,height:18,color:"#fff",fontSize:11,cursor:"pointer",lineHeight:"18px",textAlign:"center"}}>×</button>
          </div>
        ))}
        {player.holeCards.length<2&&!player.folded&&phase==="showdown"&&player.active&&(
          <div onClick={onAddHoleCard}
            style={{width:46,height:64,border:`2px dashed ${t.border}`,borderRadius:9,display:"flex",
                    alignItems:"center",justifyContent:"center",cursor:"pointer",color:t.textMuted,
                    fontSize:24,background:t.surface2,transition:"border-color 0.15s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=t.accent}
            onMouseLeave={e=>e.currentTarget.style.borderColor=t.border}>+</div>
        )}
        {handResult&&phase==="showdown"&&(
          <HandBadge result={handResult} isWinner={ranked[0].id===player.id} t={t}/>
        )}
      </div>
    </div>
  );
}
