/* ============ 6. UI ============ */
const LBL={mastered:"Got it!",developing:"Almost there",gap:"Needs practice",unknown:"Not checked yet"};
const COL={mastered:"var(--gr)",developing:"var(--am)",gap:"var(--co)",unknown:"var(--un)"};
const nm=id=>KG.S[id].name,$=id=>document.getElementById(id);
const UI={
  st:{screen:"home",sel:null},
  go(s){this.st.screen=s;this.render();window.scrollTo(0,0)},
  render(){$("app").innerHTML=`<div class="brand"><span class="logo"></span>SkillMap${this.st.screen!=="home"?`<button class="link" style="margin-left:auto" onclick="UI.go('home')">My skill map</button>`:""}</div>`+this[this.st.screen]()},
  pick(id){this.st.goal=GOALS.find(g=>g.id===id);this.st.run=Assessment.start(this.st.goal);this.st.sel=null;this.go("quiz")},
  startTopic(id){this.st.run=Assessment.startTopic(id);this.st.sel=null;this.go("quiz")},
  choose(i){this.st.sel=i;this.render()},
  next(skip){
    const r=this.st.run;
    if(Assessment.answer(r,skip?-1:this.st.sel)){
      if(r.mode==="topic"){
        const{est}=Mastery.compute(r.log,{skills:[r.topic]});
        const merged=Store.merge(est);
        this.st.topicRes={id:r.topic,status:Mastery.status(merged[r.topic])};
        this.go("topicResult");
      }else{
        this.go("analyzing");
        setTimeout(()=>{const m=Mastery.compute(r.log,this.st.goal);Store.merge(m.est);
          this.st.res={...m,path:Planner.build(m.est,this.st.goal)};this.go("results")},1400);
      }
    }else{this.st.sel=null;this.render()}
  },
  home(){
    const est=Store.load(),all=Object.keys(KG.S).sort((a,b)=>KG.S[a].depth-KG.S[b].depth);
    const tested=all.filter(id=>est[id]),mastered=all.filter(id=>Mastery.status(est[id])==="mastered");
    const pct=Math.round(mastered.length/all.length*100);
    return`<section class="hero" style="padding:14px 0 4px"><h1 style="font-size:clamp(26px,5vw,38px)">Your skill map</h1>
    <p class="mu">${tested.length?`${tested.length} of ${all.length} skills checked so far.`:"Answer a few quick questions and this map fills in. Pick a goal, or jump into any topic below."}</p></section>
    <div class="rep" style="margin-bottom:8px"><div class="ring" style="background:conic-gradient(var(--gr) ${pct}%,var(--tr) 0)"><div>${pct}%</div></div>
    <div><p style="margin:0 0 10px"><b>${pct}% of all skills mastered</b></p><button class="btn" onclick="UI.go('goals')">Take a readiness check</button></div></div>
    <h2>Knowledge tree</h2><p class="mu">Big units on the left, specific concepts on the right. Each score is the average of the ones to its right. Tap a concept to practice it.</p>
    ${this.map(est)}
    <h2>Topics to review or learn</h2>
    ${(()=>{const rec=Planner.recommend(est);return rec.length?`<div class="unit rec-row"><h3>Recommended for you</h3>
      <p class="mu" style="margin:2px 0 0;font-size:14px">${Object.keys(est).length?"Picked from your results so far.":"Take a check to personalize these. Until then, here are good first steps."}</p>
      <div class="grid" style="margin-top:10px">${rec.map(r=>this.topicCard(r.id,est,r.reason)).join("")}</div></div>`
      :`<div class="unit rec-row"><h3>Recommended for you</h3><p class="mu">You've mastered every topic. Pick any one below to review.</p></div>`})()}
    ${Tree.ROOT.children.map(u=>{const us=Tree.score(u,est);
      return`<div class="unit"><div class="row"><h3>${u.name}</h3><span class="pill" style="background:${grad(us.p)};${us.p==null?"":"color:#10283A"}">${us.p==null?"Not checked yet":Math.round(us.p*100)+"%"}</span></div>
      <div class="grid" style="margin-top:10px">${Tree.leaves(u).map(id=>this.topicCard(id,est)).join("")}</div></div>`}).join("")}`;
  },
  topicCard(id,est,reason){ // one topic card; with a reason it renders as a recommendation
    const s=Mastery.status(est[id]),p=est[id]?.p;
    const missing=KG.S[id].pre.filter(q=>Mastery.status(est[q])!=="mastered").map(nm);
    return`<div class="card${reason?" rec":""}"><div class="row"><h3>${nm(id)}</h3><span class="pill ${s}">${LBL[s]}</span></div>
      <div class="bar" style="margin-bottom:8px"><i style="width:${Math.round((p||0)*100)}%;background:${grad(p)}"></i></div>
      ${reason?`<p style="font-size:14px;margin:0 0 6px">${reason}</p><p class="mu" style="font-size:13px;margin:0 0 10px">About ${KG.S[id].min} min</p>`
        :missing.length&&s!=="mastered"?`<p class="mu" style="font-size:13px;margin:0 0 8px">Builds on: ${missing.join(", ")}</p>`:""}
      <button class="btn ${s==="mastered"?"alt":""}" style="width:100%" onclick="UI.startTopic('${id}')">${s==="mastered"?"Review":reason?"Start":"Learn"}</button></div>`;
  },
  topicResult(){
    const{id,status}=this.st.topicRes,est=Store.load();
    const need=[...KG.ancestors(id)].filter(p=>Mastery.status(est[p])!=="mastered").sort((a,b)=>KG.S[a].depth-KG.S[b].depth);
    const msg=status==="mastered"?"Nice work — you've got this one down.":status==="developing"?"You're close. A bit more practice will lock it in.":"This one needs more practice before it clicks.";
    return`<h1 style="font-size:30px">${nm(id)}</h1><span class="pill ${status}">${LBL[status]}</span>
    <p style="margin-top:14px"><b>${msg}</b></p>
    <h2>Concepts you need to understand</h2>
    ${need.length?`<div class="grid">${need.map(p=>`<div class="card"><div class="row"><h3>${nm(p)}</h3><span class="pill ${Mastery.status(est[p])}">${LBL[Mastery.status(est[p])]}</span></div><p class="mu" style="margin:0">${KG.S[p].learn}</p></div>`).join("")}</div>`
      :`<p class="mu">${status==="mastered"?"You already have every building block for this topic.":"No missing building blocks — this one just needs direct practice."}</p>`}
    <div style="margin-top:24px;display:flex;gap:12px;flex-wrap:wrap">
    <button class="btn" onclick="UI.startTopic('${id}')">Try again</button>
    <button class="btn alt" onclick="UI.go('home')">Back to skill map</button></div>`;
  },
  goals:()=>`<h2 style="margin-top:0">What's your goal?</h2><p class="mu">Pick one. The check takes about 5–10 minutes. No grades, no pressure.</p>
    <div class="grid">${GOALS.map(g=>`<button class="goal" onclick="UI.pick('${g.id}')"><b>${g.name}</b><small>${g.desc}</small></button>`).join("")}</div>`,
  quiz(){
    const r=this.st.run,q=Assessment.current(r),pct=Math.round(r.i/r.queue.length*100);
    return`<div class="bar bar-top"><i style="width:${pct}%"></i></div><p class="mu">${r.mode==="topic"?"Topic check":"Readiness check"} · Question ${r.i+1} of ${r.queue.length}</p>
    <span class="tag">${nm(q.skill)}</span>${q.follow?` <span class="mu">Here's another one on this skill</span>`:""}
    <div class="q">${q.q}</div>
    ${q.opts.map((o,i)=>`<button class="opt ${this.st.sel===i?"on":""}" onclick="UI.choose(${i})">${o.t}</button>`).join("")}
    <div style="display:flex;gap:12px;align-items:center;margin-top:14px"><button class="btn" ${this.st.sel===null?"disabled":""} onclick="UI.next()">Next</button>
    <button class="link" onclick="UI.next(true)">I haven't learned this yet</button></div>`;
  },
  analyzing:()=>`<div class="spin"></div><h2 style="text-align:center">Looking at your answers…</h2><p class="mu" style="text-align:center">Building your skill map</p>`,
  results(){
    const{est,readiness,path}=this.st.res,g=this.st.goal,pct=Math.round(readiness*100);
    const st=id=>Mastery.status(est[id]);
    const mastered=Object.keys(est).filter(id=>st(id)==="mastered").sort((a,b)=>KG.S[a].depth-KG.S[b].depth);
    const gaps=Object.keys(est).filter(id=>st(id)!=="mastered"&&est[id].tested);
    const msg=pct>=80?"You're ready! Just a little polishing left.":pct>=50?"Solid base. A few skills to tighten up.":"Great start. Now we know exactly where to begin.";
    return`<div class="rep"><div class="ring" style="background:conic-gradient(var(--gr) ${pct}%,var(--tr) 0)"><div>${pct}%</div></div>
      <div><h1 style="font-size:30px">Your readiness report</h1><p class="mu">Goal: ${g.name}</p><p><b>${msg}</b></p></div></div>
    <h2>What you already know</h2>${mastered.length?mastered.map(id=>`<span class="chip">✓ ${nm(id)}</span>`).join(""):`<p class="mu">Nothing yet, and that's okay. Your path below starts at the beginning.</p>`}
    <h2>Where to grow</h2>${gaps.length?`<div class="grid">${gaps.map(id=>`<div class="card"><div class="row"><h3>${nm(id)}</h3><span class="pill ${st(id)}">${LBL[st(id)]}</span></div>
      <div class="bar"><i style="width:${Math.round(est[id].p*100)}%;background:${COL[st(id)]}"></i></div></div>`).join("")}</div>`:`<p class="mu">No gaps found. Try the next grade's goal!</p>`}
    <h2>Your learning path</h2>${path.length?path.map((p,i)=>{const s=KG.S[p.id];
      return`<div class="step ${p.ready?"now":""}"><div class="num">${i+1}</div><div class="card" style="flex:1"><div class="row"><h3>${s.name}</h3>
      <span class="pill ${p.ready?"mastered":"unknown"}">${p.ready?"Ready":"Do after "+s.pre.filter(x=>st(x)!=="mastered").map(nm).join(", ")}</span></div>
      <p>${s.learn}</p><p class="mu" style="font-size:14px">About ${s.min} min${p.status==="unknown"?" · Building block we didn't check":""}${p.unlocks.length?" · Unlocks: "+p.unlocks.map(nm).join(", "):""}</p>
      ${p.ready?`<button class="btn" onclick="UI.startTopic('${p.id}')">Start here</button>`:""}</div></div>`}).join(""):`<p class="mu">You're all set. Nothing you need to fix first.</p>`}
    <h2>Your knowledge tree</h2><p class="mu">Big units on the left, specific concepts on the right. Tap a concept to practice it.</p>
    ${this.map(Store.load())}
    <div style="margin-top:28px;display:flex;gap:12px;flex-wrap:wrap"><button class="btn" onclick="UI.pick('${g.id}')">Retake check</button><button class="btn alt" onclick="UI.go('goals')">Pick another goal</button></div>`;
  },
  map(est){ // Horizontal tree: whole subject on the left, units, topics, then individual concepts on the right.
    const Wd=[124,226,236,220],X=[8,168,430,702],RH=32,NH=26,GAP=14;
    let y=30,nodes=[],edges=[];
    const place=(n,d)=>{ // returns center y
      const leaf=typeof n==="string",sc=Tree.score(n,est);let cy;
      if(leaf){cy=y+NH/2;y+=RH}
      else{
        const ys=n.children.map((c,i)=>{if(d===0&&i>0)y+=GAP;return place(c,d+1)});
        cy=(ys[0]+ys[ys.length-1])/2;
        ys.forEach(cyk=>{const x1=X[d]+Wd[d],x2=X[d+1],mx=(x1+x2)/2;
          edges.push(`<path d="M${x1} ${cy}C${mx} ${cy},${mx} ${cyk},${x2} ${cyk}" fill="none" stroke="var(--tr)" stroke-width="2"/>`)});
      }
      const name=leaf?nm(n):n.name,pct=sc.p==null?"–":Math.round(sc.p*100)+"%",fill=grad(sc.p),h=d===0?40:NH;
      const tip=`${name}: ${sc.p==null?"not checked yet":pct}${leaf?"":` (${sc.checked} of ${sc.total} concepts checked)`}`;
      const act=leaf?` class="leaf" role="button" tabindex="0" onclick="UI.startTopic('${n}')" onkeydown="if(event.key==='Enter')UI.startTopic('${n}')"`:"";
      nodes.push(`<g${act}><title>${tip}${leaf?" · click to practice":""}</title>
        <rect x="${X[d]}" y="${cy-h/2}" width="${Wd[d]}" height="${h}" rx="${h/2}" fill="${fill}" ${sc.p==null?'opacity=".45"':""}/>
        <text x="${X[d]+12}" y="${cy+4}" class="${d<2?"b":""}" ${sc.p==null?"":'style="fill:#10283A"'}>${name}</text>
        <text x="${X[d]+Wd[d]-10}" y="${cy+4}" text-anchor="end" class="b" ${sc.p==null?"":'style="fill:#10283A"'}>${pct}</text></g>`);
      return cy;
    };
    place(Tree.ROOT,0);
    const w=X[3]+Wd[3]+8,h=y+4;
    return`<div class="map"><svg viewBox="0 0 ${w} ${h}" width="${w}" role="img" aria-label="Knowledge tree">
      ${["Subject","Units","Topics","Concepts"].map((t,i)=>`<text x="${X[i]+4}" y="14" class="colh">${t}</text>`).join("")}${edges.join("")}${nodes.join("")}</svg></div>
    <div class="leg"><span>Needs practice</span><span class="gbar"></span><span>Got it</span><span><i style="background:var(--un);opacity:.45"></i>Not checked yet</span></div>`;
  }
};
UI.render();
