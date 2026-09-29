/* ============ 4b. STORE: remembers mastery across quizzes, per browser ============ */
const Store={
  K:"skillmap_mastery_v1",
  load(){try{return JSON.parse(localStorage.getItem(this.K)||"{}")}catch(e){return{}}},
  merge(est){const m={...this.load(),...est};try{localStorage.setItem(this.K,JSON.stringify(m))}catch(e){}return m}
};
