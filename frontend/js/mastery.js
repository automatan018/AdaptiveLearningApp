/* ============ 4. MASTERY: estimate per skill from the answer log ============ */
const Mastery={
  T:{mastered:.6,developing:.4},
  compute(log,goal){
    const ev={},est={};
    log.forEach(l=>(ev[l.skill]??=[]).push(l.ok));
    for(const k in ev)est[k]={p:(ev[k].filter(Boolean).length+1)/(ev[k].length+2),tested:true}; // smoothed accuracy
    // Knowing a skill implies its prerequisites are (probably) known
    Object.keys(ev).forEach(k=>{if(est[k].p>=this.T.mastered)KG.ancestors(k).forEach(a=>{est[a]??={p:.65,inferred:true}})});
    const readiness=goal.skills.reduce((s,k)=>s+(est[k]?.p??0),0)/goal.skills.length;
    return{est,readiness};
  },
  status(e){return!e?"unknown":e.p>=this.T.mastered?"mastered":e.p>=this.T.developing?"developing":"gap"}
};
