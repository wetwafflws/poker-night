import { Modal } from '../ui/Modal';
import { chip } from '../../utils/formatting';

export function GameTranscriptModal({ players, accumulatedPot, mainPot, sidePots, onClose, t }) {
  return (
    <Modal title="Game Transcript - Verbose Pot Tracking" onClose={onClose} t={t} wide>
      <div style={{marginBottom: 20}}>
        <div style={{background: t.surface2, border: `1px solid ${t.border}`, borderRadius: 8, padding: 14, marginBottom: 14}}>
          <div style={{fontWeight: 700, marginBottom: 8, fontSize: 14, color: t.accent}}>💰 Pot Summary</div>
          <div style={{display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, fontSize: 13}}>
            <div>
              <div style={{color: t.textMuted, marginBottom: 2}}>Total Pot:</div>
              <div style={{fontSize: 18, fontWeight: 700, color: t.green}}>{chip(mainPot + accumulatedPot)}</div>
            </div>
            <div>
              <div style={{color: t.textMuted, marginBottom: 2}}>Current Bets (Main Pot):</div>
              <div style={{fontSize: 18, fontWeight: 700, color: t.yellow}}>{chip(mainPot)}</div>
            </div>
            <div>
              <div style={{color: t.textMuted, marginBottom: 2}}>Accumulated (Previous Streets):</div>
              <div style={{fontSize: 18, fontWeight: 700, color: t.purple}}>{chip(accumulatedPot)}</div>
            </div>
            <div>
              <div style={{color: t.textMuted, marginBottom: 2}}>Side Pots:</div>
              <div style={{fontSize: 18, fontWeight: 700, color: t.orange}}>
                {sidePots.length === 0 ? "None" : sidePots.length}
              </div>
            </div>
          </div>
        </div>

        <div style={{background: t.surface2, border: `1px solid ${t.border}`, borderRadius: 8, padding: 14, marginBottom: 14}}>
          <div style={{fontWeight: 700, marginBottom: 8, fontSize: 14, color: t.accent}}>👥 Player States</div>
          <div style={{display: "grid", gap: 10}}>
            {players.map((p, idx) => {
              const totalContributed = p.handContrib || 0;
              const isInMainPot = (p.handContrib || 0) > 0;
              const inSidePots = sidePots.filter(sp => sp.eligibleIds.includes(p.id));
              
              return (
                <div key={p.id} style={{background: t.surface, border: `1px solid ${t.border}`, borderRadius: 6, padding: 10}}>
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6}}>
                    <div style={{fontWeight: 700, fontSize: 13}}>{p.name}</div>
                    <div style={{fontSize: 12, color: t.textMuted}}>
                      {p.folded && "FOLDED"} {p.allIn && "ALL IN"}
                    </div>
                  </div>
                  <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, fontSize: 12}}>
                    <div>
                      <div style={{color: t.textMuted, marginBottom: 2}}>Stack:</div>
                      <div style={{fontWeight: 600, color: p.stack > 0 ? t.green : t.red}}>{chip(p.stack)}</div>
                    </div>
                    <div>
                      <div style={{color: t.textMuted, marginBottom: 2}}>Current Bet:</div>
                      <div style={{fontWeight: 600, color: t.yellow}}>{chip(p.bet)}</div>
                    </div>
                    <div>
                      <div style={{color: t.textMuted, marginBottom: 2}}>Total Contributed:</div>
                      <div style={{fontWeight: 600, color: t.accent}}>{chip(totalContributed)}</div>
                    </div>
                  </div>
                  
                  {isInMainPot && (
                    <div style={{marginTop: 8, paddingTop: 8, borderTop: `1px solid ${t.border}`, fontSize: 11}}>
                      <div style={{color: t.textMuted, marginBottom: 4}}>📍 In Main Pot: {chip(totalContributed)}</div>
                      {inSidePots.length > 0 && (
                        <div style={{color: t.textMuted}}>
                          📍 Also in Side Pots:
                          {inSidePots.map((sp, spIdx) => {
                            const playerContribToSidePot = sp.amount / sp.eligibleIds.length;
                            return (
                              <div key={spIdx} style={{marginLeft: 12, fontSize: 10, marginTop: 2}}>
                                Side Pot {sidePots.indexOf(sp)}: {chip(playerContribToSidePot)} (eligible with {sp.eligibleIds.map(id => players.find(pl => pl.id === id)?.name).join(", ")})
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {sidePots.length > 0 && (
          <div style={{background: t.surface2, border: `1px solid ${t.border}`, borderRadius: 8, padding: 14}}>
            <div style={{fontWeight: 700, marginBottom: 8, fontSize: 14, color: t.accent}}>🎯 Side Pot Breakdown</div>
            <div style={{display: "grid", gap: 8}}>
              {sidePots.map((sp, idx) => (
                <div key={idx} style={{background: t.surface, border: `1px solid ${t.purple}50`, borderRadius: 6, padding: 10}}>
                  <div style={{fontWeight: 700, fontSize: 12, color: t.purple, marginBottom: 6}}>
                    {idx === 0 ? "Main Pot" : `Side Pot ${idx}`}: {chip(sp.amount)}
                  </div>
                  <div style={{fontSize: 11}}>
                    <div style={{color: t.textMuted, marginBottom: 4}}>Eligible Players:</div>
                    <div style={{display: "flex", flexWrap: "wrap", gap: 6}}>
                      {sp.eligibleIds.map(id => {
                        const pl = players.find(p => p.id === id);
                        return (
                          <div key={id} style={{background: t.accentSoft, padding: "2px 8px", borderRadius: 4, fontSize: 10, color: t.accent}}>
                            {pl?.name} ({chip(pl?.stack || 0)} left)
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
