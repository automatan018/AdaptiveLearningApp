/* ============ 5. PLANNER: gaps + missing prerequisites -> ordered learning path ============ */
const Planner={
  build(est,goal){
    const st=id=>Mastery.status(est[id]);
    const weak=Object.keys(est).filter(id=>["gap","developing"].includes(st(id)));
    const need=new Set(weak);
    weak.forEach(w=>KG.ancestors(w).forEach(a=>{if(st(a)!=="mastered")need.add(a)})); // missing prerequisites
    return[...need].map(id=>({id,status:st(id),ready:KG.S[id].pre.every(p=>st(p)==="mastered"),
        unlocks:KG.dependents(id).filter(d=>need.has(d)||goal.skills.includes(d))}))
      .sort((a,b)=>KG.S[a.id].depth-KG.S[b.id].depth||b.unlocks.length-a.unlocks.length);
  },
  // Best next topics overall: not yet mastered, prerequisites in place, weak skills before unchecked ones,
  // foundations before advanced, and skills that unlock more before those that unlock less.
  recommend(est,n=3){
    const st=id=>Mastery.status(est[id]);
    return Object.keys(KG.S).filter(id=>st(id)!=="mastered").map(id=>{
      const s=KG.S[id],missing=s.pre.filter(p=>st(p)!=="mastered"),status=st(id),ready=!missing.length;
      const reason=!ready?`Start here to build toward ${KG.dependents(id).map(nm).slice(0,2).join(" and ")||"the next unit"}.`
        :status==="developing"?"You're close on this one. A little practice will lock it in."
        :status==="gap"?"This tripped you up before, and you now have the building blocks for it."
        :s.pre.length?`You know ${s.pre.map(nm).join(" and ")}, so you're ready for this.`:"A strong place to start.";
      return{id,ready,status,reason,key:[ready?0:1,["gap","developing"].includes(status)?0:1,s.depth,-KG.dependents(id).length]};
    }).sort((a,b)=>{for(let i=0;i<a.key.length;i++)if(a.key[i]!==b.key[i])return a.key[i]-b.key[i];return 0}).slice(0,n);
  }
};
