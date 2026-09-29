/* ============ 1b. CURRICULUM TREE: broad units -> topics -> individual concepts (leaves are KG skill ids) ============ */
const Tree=(()=>{
  const ROOT={id:"math",name:"All math",children:[
    {id:"u_num",name:"Numbers & Operations",children:[
      {id:"t_whole",name:"Whole numbers & decimals",children:["mult_div","dec_ops","exp_expr"]},
      {id:"t_frac",name:"Fractions",children:["frac_basic","frac_ops"]},
      {id:"t_neg",name:"Negatives & rationals",children:["int_ops","rat_ops"]}]},
    {id:"u_ratio",name:"Ratios & Proportions",children:[
      {id:"t_rates",name:"Ratio reasoning",children:["ratio","prop"]},
      {id:"t_pct",name:"Percent problems",children:["percent"]}]},
    {id:"u_alg",name:"Expressions & Equations",children:[
      {id:"t_expr",name:"Working with variables",children:["eval_expr"]},
      {id:"t_eq",name:"Equations",children:["one_step_eq","two_step"]},
      {id:"t_lin",name:"Linear relationships",children:["slope"]}]},
    {id:"u_geo",name:"Geometry",children:[
      {id:"t_area",name:"Area & circles",children:["area_perim","circle"]},
      {id:"t_tri",name:"Triangles",children:["angles","pyth"]}]},
    {id:"u_stat",name:"Statistics & Probability",children:[
      {id:"t_data",name:"Data",children:["stats"]},
      {id:"t_chance",name:"Chance",children:["prob"]}]}]};
  // Score of a node = average of its children's scores (leaf = mastery estimate). Unchecked children are skipped.
  const score=(n,est)=>{
    if(typeof n==="string")return est[n]?{p:est[n].p,checked:1,total:1}:{p:null,checked:0,total:1};
    const kids=n.children.map(c=>score(c,est)),known=kids.filter(k=>k.p!=null);
    return{p:known.length?known.reduce((s,k)=>s+k.p,0)/known.length:null,
      checked:kids.reduce((s,k)=>s+k.checked,0),total:kids.reduce((s,k)=>s+k.total,0)};
  };
  const leaves=n=>typeof n==="string"?[n]:n.children.flatMap(leaves);
  return{ROOT,score,leaves};
})();

/* Continuous color scale: coral (weak) -> amber -> green (strong). Scores live roughly in 0.2–0.8, so stretch that range. */
const grad=p=>{
  if(p==null)return"var(--un)";
  const t=Math.max(0,Math.min(1,(p-.2)/.6))*2,i=Math.min(1,Math.floor(t)),f=t-i;
  const S=[[238,138,99],[242,180,77],[47,191,132]],a=S[i],b=S[i+1];
  return`rgb(${a.map((v,k)=>Math.round(v+(b[k]-v)*f)).join(",")})`;
};
