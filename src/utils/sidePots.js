// ─────────────────────────────────────────────────────────────
// SIDE-POT ENGINE
// Returns array of { amount, eligibleIds[] } sorted smallest→largest
// ─────────────────────────────────────────────────────────────
export function computeSidePots(players) {
  // Side pots only arise when someone is all-in
  if (!players.some(p => p.allIn && !p.folded)) return [];
  const contribs = players
    .filter(p => (p.handContrib||0) > 0)
    .map(p => ({ id: p.id, contrib: p.handContrib||0, folded: p.folded }))
    .sort((a,b) => a.contrib - b.contrib);
  if (!contribs.length) return [];
  const pots = [];
  let prevLevel = 0;
  for (let i = 0; i < contribs.length; i++) {
    const level = contribs[i].contrib;
    if (level <= prevLevel) continue;
    const slice = level - prevLevel;
    const eligible = contribs.filter(c => c.contrib >= level && !c.folded).map(c => c.id);
    const total = slice * contribs.filter(c => c.contrib >= level).length;
    if (total > 0) pots.push({ amount: total, eligibleIds: eligible });
    prevLevel = level;
  }
  // Merge pots with identical eligible sets
  const merged = [];
  for (const pot of pots) {
    const key = [...pot.eligibleIds].sort().join(',');
    const ex = merged.find(m => [...m.eligibleIds].sort().join(',') === key);
    if (ex) ex.amount += pot.amount; else merged.push({...pot});
  }
  return merged;
}

// Split pot evenly among tied winners; odd chip to first in seat order
export function splitPot(potAmount, tiedIds, allPlayers) {
  const per = Math.floor(potAmount / tiedIds.length);
  const rem = potAmount % tiedIds.length;
  return allPlayers.map(p => {
    if (!tiedIds.includes(p.id)) return p;
    const bonus = tiedIds.indexOf(p.id) === 0 ? rem : 0;
    return {...p, stack: p.stack + per + bonus};
  });
}
