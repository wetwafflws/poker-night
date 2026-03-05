import { RANKS } from './constants';

// ─────────────────────────────────────────────────────────────
// HAND EVALUATOR
// ─────────────────────────────────────────────────────────────
function rankValue(r){ return RANKS.indexOf(r); }

export function evaluateHand(cards){
  if(cards.length<2) return {score:0,name:"?"};
  const combos=cards.length<=5?[cards]:getCombinations(cards,5);
  let best=null;
  for(const c of combos){ const s=score5(c); if(!best||s.score>best.score) best=s; }
  return best;
}

function getCombinations(arr,k){
  if(k===0) return [[]]; if(arr.length===k) return [arr];
  const[f,...r]=arr; return [...getCombinations(r,k-1).map(c=>[f,...c]),...getCombinations(r,k)];
}

function sortBestCards(cards, name) {
  // Sort cards so pairs/trips/quads group together, then kickers descend
  // For straights/flushes keep rank order high→low
  const rv = c => rankValue(c.rank);
  if(name==="Straight"||name==="Straight Flush"||name==="Royal Flush"||name==="Flush") {
    // High→low by rank value; handle A-2-3-4-5 (wheel) by putting A last
    const sorted = [...cards].sort((a,b)=>rv(b)-rv(a));
    if(sorted[0].rank==="A"&&sorted[1].rank==="5") return [...sorted.slice(1),sorted[0]];
    return sorted;
  }
  // Group by count descending, then by rank value descending within same count
  const counts = {};
  cards.forEach(c=>counts[c.rank]=(counts[c.rank]||0)+1);
  return [...cards].sort((a,b)=>{
    const dc=counts[b.rank]-counts[a.rank];
    if(dc!==0) return dc;
    return rv(b)-rv(a);
  });
}

function score5(cards){
  const ranks=cards.map(c=>rankValue(c.rank)).sort((a,b)=>b-a);
  const suits=cards.map(c=>c.suit);
  const flush=suits.every(s=>s===suits[0]);
  const straight=(ranks[0]-ranks[4]===4&&new Set(ranks).size===5)||ranks.join()==="12,3,2,1,0";
  const counts={}; ranks.forEach(r=>counts[r]=(counts[r]||0)+1);
  const grouped=Object.values(counts).sort((a,b)=>b-a);
  const top=Object.entries(counts).sort((a,b)=>b[1]-a[1]||b[0]-a[0]).map(e=>+e[0]);
  const base=ranks[0]*1e6+ranks[1]*1e4+ranks[2]*1e2+ranks[3];
  const mk=(name)=>({name,bestCards:sortBestCards(cards,name)});
  if(flush&&straight) return {score:8e9+base,...mk(ranks[0]===12&&ranks[1]===11?"Royal Flush":"Straight Flush")};
  if(grouped[0]===4) return {score:7e9+top[0]*1e4+top[1],...mk("Four of a Kind")};
  if(grouped[0]===3&&grouped[1]===2) return {score:6e9+top[0]*1e2+top[1],...mk("Full House")};
  if(flush) return {score:5e9+base,...mk("Flush")};
  if(straight) return {score:4e9+base,...mk("Straight")};
  if(grouped[0]===3) return {score:3e9+top[0]*1e4+top[1]*1e2+top[2],...mk("Three of a Kind")};
  if(grouped[0]===2&&grouped[1]===2) return {score:2e9+Math.max(top[0],top[1])*1e6+Math.min(top[0],top[1])*1e4+top[2],...mk("Two Pair")};
  if(grouped[0]===2) return {score:1e9+top[0]*1e6+top[1]*1e4+top[2]*1e2+top[3],...mk("One Pair")};
  return {score:base,...mk("High Card")};
}
