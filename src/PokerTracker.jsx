import { useState, useEffect, useRef } from "react";
import { DARK, LIGHT } from './styles/themes';
import { PHASES } from './utils/constants';
import { chip } from './utils/formatting';
import { computeSidePots, splitPot } from './utils/sidePots';
import { evaluateHand } from './utils/handEvaluator';

// Components
import { SetupScreen } from './components/setup/SetupScreen';
import { PotDisplay } from './components/game/PotDisplay';
import { CommunityCards } from './components/game/CommunityCards';
import { PlayerCard } from './components/game/PlayerCard';
import { ActionControls } from './components/game/ActionControls';
import { ActionLog } from './components/game/ActionLog';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { CardPicker } from './components/ui/CardPicker';
import { BlindsModal } from './components/modals/BlindsModal';
import { BuyInModal } from './components/modals/BuyInModal';
import { AddPlayerModal } from './components/modals/AddPlayerModal';
import { PhasePromptModal } from './components/modals/PhasePromptModal';
import { HandResultModal } from './components/modals/HandResultModal';
import { SummaryModal } from './components/modals/SummaryModal';
import { GameWinnerModal } from './components/modals/GameWinnerModal';

export default function PokerTracker() {
  const [dark, setDark] = useState(false);
  const t = dark ? DARK : LIGHT;

  // Setup config
  const [screen, setScreen] = useState("setup");
  const [playerNames, setPlayerNames] = useState(["Alice","Bob","Charlie","Diana"]);
  const [newName, setNewName] = useState("");
  const [buyIn, setBuyIn] = useState(100);
  const [smallBlind, setSmallBlind] = useState(5);
  const [bigBlind, setBigBlind] = useState(10);
  const [blindTimer, setBlindTimer] = useState(0);
  const [blindMultiplier, setBlindMultiplier] = useState(2);

  // Game state
  const [players, setPlayers] = useState([]);
  const [dealerIdx, setDealerIdx] = useState(0);
  const [sidePots, setSidePots] = useState([]);
  const [accumulatedPot, setAccumulatedPot] = useState(0);
  const [phase, setPhase] = useState("preflop");
  const [currentSB, setCurrentSB] = useState(5);
  const [currentBB, setCurrentBB] = useState(10);
  const [lastRaiseSize, setLastRaiseSize] = useState(10);
  const [communityCards, setCommunityCards] = useState([]);
  const [activePicker, setActivePicker] = useState(null);
  const [usedCards, setUsedCards] = useState([]);
  const [activePlayer, setActivePlayer] = useState(0);
  const [currentBet, setCurrentBet] = useState(0);
  const [betInput, setBetInput] = useState("");
  const [actionLog, setActionLog] = useState([]);
  const [timerLeft, setTimerLeft] = useState(0);
  const timerRef = useRef(null);

  // Modal flags
  const [showHandResult, setShowHandResult] = useState(false);
  const [showBlindsModal, setShowBlindsModal] = useState(false);
  const [showCommunityPrompt, setShowCommunityPrompt] = useState(false);
  const [pendingPhase, setPendingPhase] = useState(null);
  const [showBuyIn, setShowBuyIn] = useState(null);
  const [buyInAmount, setBuyInAmount] = useState("");
  const [buyInHistory, setBuyInHistory] = useState([]);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerBuyInAmt, setNewPlayerBuyInAmt] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [gameWinner, setGameWinner] = useState(null);
  const [potAwarded, setPotAwarded] = useState(false);
  const [hadSidePots, setHadSidePots] = useState(false);

  const [initialStacks, setInitialStacks] = useState({});

  // Undo/Redo state
  const [stateHistory, setStateHistory] = useState([]);
  const [canUndo, setCanUndo] = useState(false);

  useEffect(()=>{ document.body.style.background=t.bg; document.body.style.margin="0"; },[dark]);

  useEffect(()=>{
    if(screen!=="game"||blindTimer===0) return;
    setTimerLeft(blindTimer*60);
    timerRef.current=setInterval(()=>{
      setTimerLeft(prev=>{
        if(prev<=1){ setCurrentSB(s=>Math.round(s*blindMultiplier)); setCurrentBB(b=>Math.round(b*blindMultiplier)); return blindTimer*60; }
        return prev-1;
      });
    },1000);
    return ()=>clearInterval(timerRef.current);
  },[screen,blindTimer,blindMultiplier]);

  const addLog=(msg,ph)=>setActionLog(prev=>[`${(ph||phase).toUpperCase()}: ${msg}`,...prev.slice(0,49)]);

  // Save current state to history before making changes
  function saveState() {
    const snapshot = {
      players: JSON.parse(JSON.stringify(players)),
      phase,
      currentBet,
      activePlayer,
      communityCards: JSON.parse(JSON.stringify(communityCards)),
      sidePots: JSON.parse(JSON.stringify(sidePots)),
      accumulatedPot,
      actionLog: [...actionLog],
      dealerIdx,
      usedCards: [...usedCards],
      lastRaiseSize,
      currentSB,
      currentBB,
      potAwarded,
      hadSidePots
    };
    setStateHistory(prev => [...prev.slice(-19), snapshot]); // Keep last 20 states
    setCanUndo(true);
  }

  // Restore previous state
  function undoAction() {
    if (stateHistory.length === 0) return;
    
    const previousState = stateHistory[stateHistory.length - 1];
    setPlayers(previousState.players);
    setPhase(previousState.phase);
    setCurrentBet(previousState.currentBet);
    setActivePlayer(previousState.activePlayer);
    setCommunityCards(previousState.communityCards);
    setSidePots(previousState.sidePots);
    setAccumulatedPot(previousState.accumulatedPot);
    setActionLog(previousState.actionLog);
    setDealerIdx(previousState.dealerIdx);
    setUsedCards(previousState.usedCards);
    setLastRaiseSize(previousState.lastRaiseSize);
    setCurrentSB(previousState.currentSB);
    setCurrentBB(previousState.currentBB);
    setPotAwarded(previousState.potAwarded);
    setHadSidePots(previousState.hadSidePots);
    
    setStateHistory(prev => prev.slice(0, -1));
    setCanUndo(stateHistory.length > 1);
    
    addLog("↩️ Action undone", previousState.phase);
  }

  function recomputeSidePots(ps) {
    const pots = computeSidePots(ps);
    setSidePots(pots);
    if (pots.length > 0) setHadSidePots(true);
    return pots;
  }

  function startGame() {
    const ps=playerNames.map((name,i)=>({
      id:i, name, stack:buyIn, folded:false, allIn:false,
      holeCards:[], bet:0, handContrib:0, acted:false, debt:0, active:true
    }));
    const initS = {};
    ps.forEach(p => { initS[p.id] = buyIn; });
    setInitialStacks(initS);
    setPlayers(ps); setCurrentSB(smallBlind); setCurrentBB(bigBlind);
    setSidePots([]); setAccumulatedPot(0); setPotAwarded(false); setHadSidePots(false); setGameWinner(null); setPhase("preflop"); setCommunityCards([]); setUsedCards([]);
    setActionLog([]); setActivePlayer(ps.length===2?dealerIdx:(dealerIdx+3)%ps.length);
    setCurrentBet(bigBlind); setLastRaiseSize(bigBlind); setScreen("game");
    postBlindsTo(ps,dealerIdx,smallBlind,bigBlind);
  }

  function postBlindsTo(ps,dIdx,sb,bb) {
    const activePsIdx=ps.map((_,i)=>i).filter(i=>ps[i].stack>0||ps[i].allIn);
    const dActivePos=activePsIdx.indexOf(dIdx)>=0?activePsIdx.indexOf(dIdx):0;
    const headsUp=activePsIdx.length===2;
    const siActive=headsUp?dActivePos:(dActivePos+1)%activePsIdx.length;
    const biActive=headsUp?(dActivePos+1)%activePsIdx.length:(dActivePos+2)%activePsIdx.length;
    const si=activePsIdx[siActive], bi=activePsIdx[biActive];
    const sbAmt=Math.min(sb,ps[si].stack), bbAmt=Math.min(bb,ps[bi].stack);
    const up=ps.map((p,i)=>{
      if(i===si) return {...p,stack:p.stack-sbAmt,bet:sbAmt,handContrib:(p.handContrib||0)+sbAmt};
      if(i===bi) return {...p,stack:p.stack-bbAmt,bet:bbAmt,handContrib:(p.handContrib||0)+bbAmt};
      return p;
    });
    setPlayers(up); recomputeSidePots(up); setCurrentBet(bb); setLastRaiseSize(bb);
    setActionLog(prev=>[`PREFLOP: ${ps[si].name} posts SB ${chip(sb)}, ${ps[bi].name} posts BB ${chip(bb)}`,...prev]);
  }

  function nextActive(fromIdx,ps){
    let idx=(fromIdx+1)%ps.length, tries=0;
    while((ps[idx].folded||ps[idx].allIn||(ps[idx].stack===0&&!ps[idx].allIn))&&tries<ps.length){
      idx=(idx+1)%ps.length; tries++;
    }
    return idx;
  }

  function doAction(action, amount) {
    saveState(); // Save state before action
    
    const p=players[activePlayer];
    let up=[...players], nb=currentBet, newLastRaise=lastRaiseSize;

    if(action==="fold"){
      up[activePlayer]={...p,folded:true};
      addLog(`${p.name} folds`);
    } else if(action==="check"){
      up[activePlayer]={...p,acted:true};
      addLog(`${p.name} checks`);
    } else if(action==="call"){
      const toCall=Math.min(currentBet-p.bet, p.stack);
      const isAllIn = toCall >= p.stack;
      up[activePlayer]={...p,stack:p.stack-toCall,bet:p.bet+toCall,
                         handContrib:(p.handContrib||0)+toCall,
                         allIn:isAllIn,acted:true};
      addLog(`${p.name} calls ${chip(toCall)}${isAllIn?" (all-in)":""}`);
    } else if(action==="bet"||action==="raise"){
      const amt=parseInt(amount)||0;
      const minAmt = action==="bet" ? currentBB : currentBet + lastRaiseSize;
      const actual=Math.min(Math.max(amt,minAmt),p.stack+p.bet);
      const diff=actual-p.bet;
      const raiseSize=actual-currentBet;
      up=up.map((pl,i)=>i===activePlayer
        ? {...pl,stack:pl.stack-diff,bet:actual,handContrib:(pl.handContrib||0)+diff,allIn:pl.stack===diff,acted:true}
        : {...pl,acted:false});
      nb=actual; newLastRaise=Math.max(raiseSize,currentBB);
      addLog(`${p.name} ${action}s to ${chip(actual)}`);
    } else if(action==="allin"){
      const a=p.stack;
      const newBet=p.bet+a;
      up=up.map((pl,i)=>i===activePlayer
        ? {...pl,stack:0,bet:newBet,handContrib:(pl.handContrib||0)+a,allIn:true,acted:true}
        : {...pl,acted:false});
      if(newBet>nb){ newLastRaise=Math.max(newBet-nb,currentBB); nb=newBet; }
      addLog(`${p.name} goes ALL IN — ${chip(newBet)}`);
    }

    setCurrentBet(nb); setLastRaiseSize(newLastRaise); setPlayers(up); setBetInput("");
    recomputeSidePots(up);

    const remaining=up.filter(pl=>!pl.folded);
    if(remaining.length===1){
      const totalChips=up.reduce((s,pl)=>s+pl.bet,0)+sidePots.reduce((s,sp)=>s+sp.amount,0);
      doAwardAll(up,remaining[0].id,totalChips,dealerIdx);
      return;
    }

    const activePls=up.filter(pl=>!pl.folded&&!pl.allIn&&pl.stack>0);
    const anyActed=activePls.some(pl=>pl.acted);
    const roundOver=anyActed&&(activePls.length===0||activePls.every(pl=>pl.acted&&pl.bet===nb));

    if(roundOver){ triggerNextPhase(up); return; }
    setActivePlayer(nextActive(activePlayer,up));
  }

  function triggerNextPhase(up) {
    const ni=PHASES.indexOf(phase)+1;
    if(ni>=PHASES.length) return;
    const np=PHASES[ni];
    const streetBets=up.reduce((s,p)=>s+p.bet,0);
    setAccumulatedPot(prev=>prev+streetBets);
    if(np==="showdown"){
      setPhase("showdown");
      setPlayers(prev=>prev.map(pl=>({...pl,bet:0,acted:false})));
      setCurrentBet(0); addLog("Showdown — enter hole cards to evaluate","showdown");
    } else { setPendingPhase(np); setShowCommunityPrompt(true); }
  }

  function confirmAdvancePhase(np){
    saveState(); // Save state before advancing phase
    
    setShowCommunityPrompt(false); setPhase(np);
    const streetBets=players.reduce((s,p)=>s+p.bet,0);
    setAccumulatedPot(prev=>prev+streetBets);
    setPlayers(prev=>prev.map(pl=>({...pl,bet:0,acted:false})));
    setCurrentBet(0); setLastRaiseSize(currentBB);
    const si=(dealerIdx+1)%players.length;
    setActivePlayer(nextActive(si-1,players));
    addLog("--- new street ---",np);
    setActivePicker("community");
  }

  function advancePhase(){
    saveState(); // Save state before advancing phase
    
    const ni=PHASES.indexOf(phase)+1; if(ni>=PHASES.length) return;
    const np=PHASES[ni];
    const streetBets=players.reduce((s,p)=>s+p.bet,0);
    setAccumulatedPot(prev=>prev+streetBets);
    if(np==="showdown"){
      setPhase("showdown"); setPlayers(prev=>prev.map(p=>({...p,bet:0,acted:false}))); setCurrentBet(0);
    } else { setPendingPhase(np); setShowCommunityPrompt(true); }
  }

  function doAwardAll(ps, winnerId, totalChips, dIdx) {
    const up=ps.map(p=>p.id===winnerId?{...p,stack:p.stack+totalChips,bet:0}:{...p,bet:0});
    setPlayers(up); setSidePots([]); setAccumulatedPot(0); setPotAwarded(true); setShowHandResult(false); setPhase("showdown");
    addLog(`🏆 ${ps.find(p=>p.id===winnerId)?.name} wins ${chip(totalChips)} (everyone else folded)!`,"showdown");
    const nd=dIdx!==undefined?dIdx:dealerIdx;
    setTimeout(()=>startNewHand(up,nd),1400);
  }

  function doAwardPot(ps, winnerId, potAmt, dIdx, skipNewHand=false) {
    const up=ps.map(p=>p.id===winnerId?{...p,stack:p.stack+potAmt}:p);
    setPlayers(up); setAccumulatedPot(0); setPotAwarded(true); setShowHandResult(false); setPhase("showdown");
    const winner=ps.find(p=>p.id===winnerId);
    const hands=ps.filter(p=>!p.folded&&p.holeCards.length===2).map(p=>{
      const h=evaluateHand([...p.holeCards,...communityCards]);
      return `${p.name}: ${h.name} (${p.holeCards.map(c=>c.rank+c.suit).join(" ")})`;
    });
    if(hands.length>0) addLog(`📋 Hands — ${hands.join(" | ")}`,"showdown");
    addLog(`🏆 ${winner?.name} wins ${chip(potAmt)}!`,"showdown");
    if(!skipNewHand){
      const nd=dIdx!==undefined?dIdx:dealerIdx;
      setTimeout(()=>startNewHand(up,nd),1400);
    }
    return up;
  }

  function startNewHand(curPlayers,curDealerIdx){
    setStateHistory([]); // Clear undo history when starting new hand
    setCanUndo(false);
    
    const nd=(curDealerIdx+1)%curPlayers.length;
    setDealerIdx(nd);
    const ps=curPlayers.map(p=>({...p,folded:false,allIn:false,holeCards:[],bet:0,handContrib:0,acted:false,active:p.stack>0}));
    const activePlayers=ps.filter(p=>p.stack>0);
    if(activePlayers.length===1){
      setGameWinner(activePlayers[0]);
      setPlayers(ps); return;
    }
    setPlayers(ps); setSidePots([]); setAccumulatedPot(0); setPotAwarded(false); setHadSidePots(false); setPhase("preflop"); setCommunityCards([]); setUsedCards([]);
    setCurrentBet(currentBB); setLastRaiseSize(currentBB); setActivePlayer(ps.length===2?nd:(nd+3)%ps.length);
    postBlindsTo(ps,nd,currentSB,currentBB);
  }

  function addCommunityCard(rank,suit){
    saveState(); // Save state before adding card
    
    const id=rank+suit; setUsedCards(prev=>[...prev,id]);
    setCommunityCards(prev=>{
      const next=[...prev,{rank,suit}];
      const target=(phase==="flop"||pendingPhase==="flop")?3:next.length;
      if(next.length>=target) setTimeout(()=>setActivePicker(null),0);
      return next;
    });
  }

  function addHoleCard(playerId,rank,suit){
    saveState(); // Save state before adding card
    
    setPlayers(prev=>prev.map(p=>p.id===playerId?{...p,holeCards:[...p.holeCards,{rank,suit}]}:p));
    setUsedCards(prev=>[...prev,rank+suit]); setActivePicker(null);
  }

  function removeCard(type,idx,playerId){
    saveState(); // Save state before removing card
    
    if(type==="community"){
      const c=communityCards[idx];
      setCommunityCards(prev=>prev.filter((_,i)=>i!==idx));
      setUsedCards(prev=>prev.filter(x=>x!==c.rank+c.suit));
    } else {
      const c=players.find(p=>p.id===playerId).holeCards[idx];
      setPlayers(prev=>prev.map(p=>p.id===playerId?{...p,holeCards:p.holeCards.filter((_,i)=>i!==idx)}:p));
      setUsedCards(prev=>prev.filter(x=>x!==c.rank+c.suit));
    }
  }

  function doBuyIn(playerId){
    const amt=parseInt(buyInAmount)||buyIn;
    setPlayers(prev=>prev.map(p=>p.id===playerId?{...p,stack:p.stack+amt,debt:(p.debt||0)+amt}:p));
    setInitialStacks(prev=>({...prev,[playerId]:(prev[playerId]||0)+amt}));
    setBuyInHistory(h=>[...h,{player:players.find(p=>p.id===playerId)?.name,amount:amt,time:new Date().toLocaleTimeString()}]);
    setShowBuyIn(null); setBuyInAmount("");
  }

  function doRepayDebt(playerId){
    setPlayers(prev=>prev.map(p=>{
      if(p.id!==playerId) return p;
      const repay=Math.min(p.debt||0, p.stack);
      if(repay<=0) return p;
      return {...p, stack:p.stack-repay, debt:(p.debt||0)-repay};
    }));
    setShowBuyIn(null);
  }

  function addNewPlayer(){
    const name=newPlayerName.trim(); if(!name) return;
    const amt=parseInt(newPlayerBuyInAmt)||buyIn;
    const newId=Math.max(0,...players.map(p=>p.id))+1;
    setPlayers(prev=>[...prev,{id:newId,name,stack:amt,folded:true,allIn:false,holeCards:[],bet:0,handContrib:0,acted:false,debt:0,active:false}]);
    setInitialStacks(prev=>({...prev,[newId]:amt}));
    setBuyInHistory(h=>[...h,{player:name,amount:amt,time:new Date().toLocaleTimeString()}]);
    setShowAddPlayer(false); setNewPlayerName(""); setNewPlayerBuyInAmt("");
  }

  function evaluateWinner(){
    return players.filter(p=>!p.folded&&p.holeCards.length===2)
      .map(p=>({...p,hand:evaluateHand([...p.holeCards,...communityCards])}))
      .sort((a,b)=>b.hand.score-a.hand.score);
  }

  const ranked = evaluateWinner();
  const si=(dealerIdx+1)%Math.max(players.length,1);
  const bi=(dealerIdx+2)%Math.max(players.length,1);
  const td=timerLeft>0?`${Math.floor(timerLeft/60)}:${String(timerLeft%60).padStart(2,"0")}`:null;

  const mainPot = players.reduce((s,p)=>s+p.bet,0);
  const totalPotDisplay = mainPot + accumulatedPot + sidePots.reduce((s,sp)=>s+sp.amount,0);

  const activeP = players[activePlayer];
  const minRaise = activeP ? currentBet + lastRaiseSize : currentBB;
  const minBet = currentBB;

  // ─────────────────────────────────────────────────────────────
  // SETUP SCREEN
  // ─────────────────────────────────────────────────────────────
  if(screen==="setup") return (
    <SetupScreen
      playerNames={playerNames}
      newName={newName}
      buyIn={buyIn}
      smallBlind={smallBlind}
      bigBlind={bigBlind}
      blindTimer={blindTimer}
      blindMultiplier={blindMultiplier}
      onPlayerNamesChange={setPlayerNames}
      onNewNameChange={setNewName}
      onAddPlayer={()=>{if(newName.trim()){setPlayerNames(p=>[...p,newName.trim()]);setNewName("");}}}
      onBuyInChange={setBuyIn}
      onSmallBlindChange={setSmallBlind}
      onBigBlindChange={setBigBlind}
      onBlindTimerChange={setBlindTimer}
      onBlindMultiplierChange={setBlindMultiplier}
      onStartGame={startGame}
      onToggleDark={()=>setDark(d=>!d)}
      dark={dark}
      t={t}
    />
  );

  // ─────────────────────────────────────────────────────────────
  // GAME SCREEN
  // ─────────────────────────────────────────────────────────────
  return (
    <div style={{minHeight:"100vh",background:t.bg,fontFamily:"system-ui,-apple-system,sans-serif",
                 color:t.text,padding:18,maxWidth:1140,margin:"0 auto"}}>

      {/* Top bar */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22,flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:24,fontWeight:800,color:t.text}}>♠ Poker Night</span>
          <span style={{background:t.accentSoft,color:t.accent,borderRadius:8,padding:"4px 12px",fontSize:13,fontWeight:700}}>
            {phase.toUpperCase()}
          </span>
          {canUndo && (
            <button 
              onClick={undoAction} 
              title="Undo last action"
              style={{
                background: t.yellowSoft,
                border: `1px solid ${t.yellow}50`,
                borderRadius: 8,
                padding: "6px 13px",
                cursor: "pointer",
                color: t.yellow,
                fontSize: 14,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 6
              }}>
              ↩️ Undo
            </button>
          )}
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          {td&&<div style={{background:t.yellowSoft,border:`1px solid ${t.yellow}50`,borderRadius:8,padding:"6px 13px",color:t.yellow,fontSize:14,fontWeight:600}}>⏱ {td}</div>}
          <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:8,padding:"6px 13px",color:t.textSub,fontSize:14}}>
            SB {chip(currentSB)} / BB {chip(currentBB)}
          </div>
          <button onClick={()=>setShowBlindsModal(true)} style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:8,padding:"8px 13px",cursor:"pointer",color:t.text,fontSize:15}}>⚙</button>
          <button onClick={()=>setShowSummary(true)} style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:8,padding:"8px 13px",cursor:"pointer",color:t.text,fontSize:13,fontWeight:600}}>📊 Summary</button>
          <button onClick={()=>setDark(d=>!d)} style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:8,padding:"8px 13px",cursor:"pointer",fontSize:17}}>{dark?"☀️":"🌙"}</button>
          <button onClick={()=>setScreen("setup")} style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:8,padding:"8px 13px",cursor:"pointer",color:t.textSub,fontSize:14}}>↩</button>
        </div>
      </div>

      {/* Pot display */}
      <PotDisplay totalPot={totalPotDisplay} sidePots={sidePots} mainPot={mainPot} players={players} t={t}/>

      {/* Community Cards */}
      <CommunityCards 
        communityCards={communityCards}
        phase={phase}
        onAddCard={()=>setActivePicker("community")}
        onRemoveCard={(idx)=>removeCard("community",idx)}
        t={t}
      />

      {/* Players Grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:14,marginBottom:22}}>
        {players.map((p,i)=>{
          const isDealer=i===dealerIdx, isSB=i===si, isBB=i===bi;
          const isTurn=i===activePlayer&&phase!=="showdown"&&(p.stack>0||p.allIn)&&!p.folded;
          const handResult=ranked.find(r=>r.id===p.id);

          return (
            <div key={p.id}>
              <PlayerCard 
                player={p}
                isDealer={isDealer}
                isSB={isSB}
                isBB={isBB}
                isTurn={isTurn}
                handResult={handResult}
                ranked={ranked}
                phase={phase}
                onBuyIn={()=>{setShowBuyIn(p.id);setBuyInAmount("");}}
                onAddHoleCard={()=>setActivePicker({type:"hole",playerId:p.id})}
                onRemoveHoleCard={(ci)=>removeCard("hole",ci,p.id)}
                t={t}
              />
              {/* Actions inline below player card */}
              {isTurn&&!p.folded&&(
                <div style={{marginTop:10}}>
                  <ActionControls 
                    player={p}
                    currentBet={currentBet}
                    minRaise={minRaise}
                    minBet={minBet}
                    betInput={betInput}
                    onBetInputChange={setBetInput}
                    onAction={doAction}
                    t={t}
                  />
                </div>
              )}
            </div>
          );
        })}

        <div onClick={()=>setShowAddPlayer(true)}
            style={{border:`2px dashed ${t.border}`,borderRadius:16,display:"flex",alignItems:"center",
                    justifyContent:"center",cursor:"pointer",color:t.textMuted,fontSize:15,fontWeight:600,
                    minHeight:130,gap:8,transition:"border-color 0.15s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=t.accent}
            onMouseLeave={e=>e.currentTarget.style.borderColor=t.border}>
            + Add Player
        </div>
      </div>

      {/* Controls */}
      <Card t={t} style={{marginBottom:20,display:"flex",gap:10,flexWrap:"wrap",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {phase!=="showdown"&&<Button onClick={advancePhase} bg={t.accent} px={16} py={9} fz={14}>
            Next: {PHASES[PHASES.indexOf(phase)+1]?.toUpperCase()||"END"} →
          </Button>}
          <Button onClick={()=>startNewHand(players,dealerIdx)} bg={t.surface2} color={t.text}
            border={`1px solid ${t.border}`} px={16} py={9} fz={14}>🃏 New Hand</Button>
          {phase==="showdown"&&<Button onClick={()=>setShowHandResult(true)} bg={t.yellow} px={16} py={9} fz={14}>🏆 Show Winner</Button>}
        </div>
        <span style={{color:t.textMuted,fontSize:13}}>{players.filter(p=>!p.folded&&p.active).length} active players</span>
      </Card>

      {/* Action Log */}
      <ActionLog actionLog={actionLog} t={t}/>

      {/* ── MODALS ── */}
      {showCommunityPrompt&&pendingPhase&&(
        <PhasePromptModal 
          pendingPhase={pendingPhase}
          onConfirm={()=>confirmAdvancePhase(pendingPhase)}
          t={t}
        />
      )}

      {activePicker==="community"&&(
        <CardPicker usedCards={usedCards} onSelect={addCommunityCard} onClose={()=>setActivePicker(null)}
          maxCards={phase==="flop"||pendingPhase==="flop"?3:1}
          currentCount={communityCards.length} t={t}/>
      )}
      {activePicker&&activePicker.type==="hole"&&(
        <CardPicker usedCards={usedCards} onSelect={(r,s)=>addHoleCard(activePicker.playerId,r,s)}
          onClose={()=>setActivePicker(null)} maxCards={1} currentCount={0} t={t}/>
      )}

      {showBlindsModal&&(
        <BlindsModal 
          currentSB={currentSB}
          currentBB={currentBB}
          blindTimer={blindTimer}
          blindMultiplier={blindMultiplier}
          onUpdate={(updates)=>{
            if(updates.currentSB!==undefined) setCurrentSB(updates.currentSB);
            if(updates.currentBB!==undefined) setCurrentBB(updates.currentBB);
            if(updates.blindTimer!==undefined) setBlindTimer(updates.blindTimer);
            if(updates.blindMultiplier!==undefined) setBlindMultiplier(updates.blindMultiplier);
          }}
          onClose={()=>setShowBlindsModal(false)}
          t={t}
        />
      )}

      {showBuyIn!==null&&(
        <BuyInModal 
          player={players.find(p=>p.id===showBuyIn)}
          buyIn={buyIn}
          buyInAmount={buyInAmount}
          onAmountChange={setBuyInAmount}
          onConfirm={()=>doBuyIn(showBuyIn)}
          onRepayDebt={()=>doRepayDebt(showBuyIn)}
          buyInHistory={buyInHistory}
          onClose={()=>setShowBuyIn(null)}
          t={t}
        />
      )}

      {showAddPlayer&&(
        <AddPlayerModal 
          newPlayerName={newPlayerName}
          newPlayerBuyInAmt={newPlayerBuyInAmt}
          buyIn={buyIn}
          onNameChange={setNewPlayerName}
          onAmountChange={setNewPlayerBuyInAmt}
          onConfirm={addNewPlayer}
          onClose={()=>setShowAddPlayer(false)}
          t={t}
        />
      )}

      {showHandResult&&(
        <HandResultModal 
          ranked={ranked}
          sidePots={sidePots}
          hadSidePots={hadSidePots}
          players={players}
          communityCards={communityCards}
          totalPotDisplay={totalPotDisplay}
          potAwarded={potAwarded}
          onAwardPot={(id)=>doAwardPot(players,id,totalPotDisplay,dealerIdx,true)}
          onSplitPot={(tiedWinners)=>{
            const up=splitPot(totalPotDisplay,tiedWinners.map(p=>p.id),players);
            setPlayers(up); setAccumulatedPot(0); setPotAwarded(true); setSidePots([]);
            addLog(`🤝 Split ${chip(totalPotDisplay)} between ${tiedWinners.map(p=>p.name).join(" & ")} (${tiedWinners[0].hand.name})`,"showdown");
          }}
          onAwardSidePot={(pIdx, id)=>{
            const sp=sidePots[pIdx];
            const pl=players.find(p=>p.id===id);
            const up=players.map(p=>p.id===id?{...p,stack:p.stack+sp.amount}:p);
            const newSP=sidePots.map((s,k)=>k===pIdx?{...s,awarded:true}:s);
            setPlayers(up); setSidePots(newSP);
            addLog(`🏆 ${pl?.name} wins ${chip(sp.amount)} (${pIdx===0?"Main Pot":"Side Pot "+pIdx})`,"showdown");
          }}
          onSplitSidePot={(pIdx, tiedWinners)=>{
            const sp=sidePots[pIdx];
            const up=splitPot(sp.amount,tiedWinners.map(p=>p.id),players);
            const newSP=sidePots.map((s,k)=>k===pIdx?{...s,awarded:true}:s);
            setPlayers(up); setSidePots(newSP);
            addLog(`🤝 Split ${chip(sp.amount)} between ${tiedWinners.map(p=>p.name).join(" & ")} (${tiedWinners[0].hand.name})`,"showdown");
          }}
          onStartNextHand={()=>{setShowHandResult(false);startNewHand(players,dealerIdx);}}
          onClose={()=>setShowHandResult(false)}
          t={t}
        />
      )}

      {showSummary&&(
        <SummaryModal 
          players={players}
          initialStacks={initialStacks}
          buyInHistory={buyInHistory}
          onClose={()=>setShowSummary(false)}
          t={t}
        />
      )}

      {gameWinner&&(
        <GameWinnerModal 
          winner={gameWinner}
          onClose={()=>{setGameWinner(null);setShowSummary(true);}}
          t={t}
        />
      )}
    </div>
  );
}
