import { SUITS, RANKS, SUIT_COLORS, SUIT_SYMBOLS } from '../../utils/constants';
import { CardFace } from './CardFace';
import { Button } from './Button';
import { useState } from 'react';

export function CardPicker({ onSelect, onClose, usedCards=[], maxCards=1, currentCount=0, t, communityCards=[] }) {
  const [selectedRank, setSelectedRank] = useState(null);
  const [selectedSuit, setSelectedSuit] = useState(null);
  
  const remaining = maxCards - currentCount;
  
  // Build set of used [rank, suit] pairs from community cards
  const usedCombos = new Set(communityCards.map(c => c.rank + c.suit));
  
  // If rank is selected, find which suits are disabled (because they'd form a used combo)
  const disabledSuitsForRank = selectedRank 
    ? new Set(SUITS.filter(suit => usedCombos.has(selectedRank + suit)))
    : new Set();
  
  // If suit is selected, find which ranks are disabled (because they'd form a used combo)
  const disabledRanksForSuit = selectedSuit
    ? new Set(RANKS.filter(rank => usedCombos.has(rank + selectedSuit)))
    : new Set();
  
  const handleRankClick = (rank) => {
    if(selectedSuit) {
      // If suit is already selected, immediately select the card
      onSelect(rank, selectedSuit);
      setSelectedRank(null);
      setSelectedSuit(null);
    } else {
      setSelectedRank(rank);
    }
  };
  
  const handleSuitClick = (suit) => {
    if(selectedRank) {
      // If rank is already selected, immediately select the card
      onSelect(selectedRank, suit);
      setSelectedRank(null);
      setSelectedSuit(null);
    } else {
      setSelectedSuit(suit);
    }
  };
  
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:1000,
                 display:"flex",alignItems:"center",justifyContent:"center",padding:16}}
         onClick={onClose}>
      <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:18,padding:24,
                   maxWidth:560,width:"100%",
                   boxShadow:"0 32px 80px rgba(0,0,0,0.4)"}}
           onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div>
            <div style={{fontSize:18,fontWeight:700,color:t.text}}>Select Card</div>
            {maxCards>1&&<div style={{fontSize:13,color:t.textMuted,marginTop:2}}>Pick {remaining} more card{remaining!==1?"s":""}</div>}
          </div>
          <Button onClick={onClose} bg={t.surface2} color={t.text} border={`1px solid ${t.border}`} px={14} py={7} fz={14}>Done</Button>
        </div>
        
        <div style={{marginBottom:24}}>
          <div style={{fontSize:13,fontWeight:700,color:t.textMuted,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>Rank</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {RANKS.map(rank=>{
              const isDisabled = disabledRanksForSuit.has(rank);
              return (
                <Button key={rank}
                  onClick={!isDisabled ? ()=>handleRankClick(rank) : undefined}
                  bg={selectedRank===rank?t.accent:(isDisabled?t.disabledBg:t.surface2)}
                  color={selectedRank===rank?"#fff":(isDisabled?t.disabledText:t.text)}
                  border={`1px solid ${selectedRank===rank?t.accent:isDisabled?t.border:t.border}`}
                  px={12} py={8} fz={13}
                  disabled={isDisabled}
                  style={{fontWeight:selectedRank===rank?700:500,opacity:isDisabled?0.5:1,cursor:isDisabled?"not-allowed":"pointer"}}>
                  {rank}
                </Button>
              );
            })}
          </div>
        </div>
        
        <div style={{marginBottom:24}}>
          <div style={{fontSize:13,fontWeight:700,color:t.textMuted,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>Suit</div>
          <div style={{display:"flex",gap:12}}>
            {SUITS.map(suit=>{
              const isDisabled = disabledSuitsForRank.has(suit);
              return (
                <Button key={suit}
                  onClick={!isDisabled ? ()=>handleSuitClick(suit) : undefined}
                  bg={selectedSuit===suit?t.accent:(isDisabled?t.disabledBg:t.surface2)}
                  color={selectedSuit===suit?"#fff":(isDisabled?t.disabledText:t.text)}
                  border={`1px solid ${selectedSuit===suit?t.accent:isDisabled?t.border:t.border}`}
                  px={16} py={12} fz={16}
                  disabled={isDisabled}
                  style={{fontWeight:selectedSuit===suit?700:500,opacity:isDisabled?0.5:1,cursor:isDisabled?"not-allowed":"pointer"}}>
                  <span style={{color:SUIT_COLORS[suit]}}>{SUIT_SYMBOLS[suit]}</span>
                </Button>
              );
            })}
          </div>
        </div>
        
        {selectedRank && selectedSuit && (
          <div style={{display:"flex",gap:10,alignItems:"center",justifyContent:"center",padding:16,background:t.surface2,borderRadius:12}}>
            <div style={{fontSize:14,color:t.textMuted}}>Preview:</div>
            <CardFace rank={selectedRank} suit={selectedSuit}/>
          </div>
        )}
      </div>
    </div>
  );
}
