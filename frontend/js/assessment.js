/* ============ 3. ASSESSMENT: builds the quiz, logs right/wrong per skill ============ */
const Assessment={
  TOPIC_LEN:4, // questions in a single-topic quiz
  start(goal){ // one random question per skill, easiest skills first
    const skills=[...goal.skills].sort((a,b)=>KG.S[a].depth-KG.S[b].depth);
    return{mode:"goal",goal,queue:skills.map(s=>this.make(s)),i:0,log:[],used:{}};
  },
  startTopic(id){
    const idx=this.shuffle([...QB[id].keys()]).slice(0,this.TOPIC_LEN);
    return{mode:"topic",topic:id,queue:idx.map(k=>this.make(id,k)),i:0,log:[],used:{}};
  },
  shuffle:a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a},
  make(skill,k,follow=false){
    k??=Math.floor(Math.random()*QB[skill].length);
    const[q,right,...wrong]=QB[skill][k];
    return{skill,k,follow,q,opts:this.shuffle([{t:right,ok:true},...wrong.map(t=>({t,ok:false}))])};
  },
  current:r=>r.queue[r.i],
  // idx = chosen option, or -1 for "haven't learned this yet". Returns true when finished.
  answer(r,idx){
    const q=r.queue[r.i],ok=idx>=0&&q.opts[idx].ok;
    r.log.push({skill:q.skill,ok});
    if(!ok&&r.mode==="goal"&&!q.follow){ // confirm a miss with a different question on the same skill
      const others=[...QB[q.skill].keys()].filter(k=>k!==q.k);
      r.queue.push(this.make(q.skill,others[Math.floor(Math.random()*others.length)],true));
    }
    return ++r.i>=r.queue.length;
  }
};
