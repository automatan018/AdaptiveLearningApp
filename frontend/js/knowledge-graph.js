/* ============ 1. KNOWLEDGE GRAPH: skills + prerequisites ============ */
const KG=(()=>{
  const S={};
  // id, short name, grade, prerequisites, what to learn, minutes
  [["mult_div","Multiply & divide",5,[],"Multi-digit multiplication and long division.",25],
   ["frac_basic","Equivalent fractions",5,["mult_div"],"Match and simplify fractions using common factors.",20],
   ["dec_ops","Decimal math",6,["mult_div"],"Line up place values to add, subtract, multiply decimals.",25],
   ["exp_expr","Order of operations",6,["mult_div"],"Exponents first, then multiply/divide, then add/subtract.",20],
   ["int_ops","Negative numbers",7,["mult_div"],"Use a number line and sign rules to add, subtract, multiply.",30],
   ["frac_ops","Fraction operations",6,["frac_basic"],"Common denominators for adding; multiply across; flip to divide.",30],
   ["ratio","Ratios & rates",6,["mult_div","frac_basic"],"Compare quantities and find unit rates like miles per hour.",25],
   ["eval_expr","Variable expressions",6,["exp_expr"],"Swap a letter for a number, then follow the order of operations.",20],
   ["stats","Mean & median",6,["dec_ops"],"Find the average and the middle value of a data set.",20],
   ["area_perim","Area & perimeter",6,["mult_div","dec_ops"],"Use formulas for rectangles and triangles.",25],
   ["percent","Percents",6,["dec_ops","ratio"],"Turn a percent into a decimal, then multiply.",25],
   ["prop","Proportions",7,["ratio"],"Set two equal ratios and solve for the missing value.",25],
   ["rat_ops","Rational numbers",7,["int_ops","frac_ops","dec_ops"],"Combine sign rules with fraction and decimal skills.",30],
   ["one_step_eq","Simple equations",7,["eval_expr","int_ops"],"Undo the operation on both sides to isolate x.",25],
   ["circle","Circles",7,["area_perim","dec_ops"],"Circumference = 2πr, area = πr².",25],
   ["two_step","Multi-step equations",8,["one_step_eq"],"Undo add/subtract first, then multiply/divide; distribute.",30],
   ["angles","Angles & triangles",7,["one_step_eq"],"Triangles add to 180°, straight lines to 180°.",20],
   ["prob","Probability",7,["frac_basic","percent"],"Favorable outcomes ÷ total outcomes.",25],
   ["slope","Slope & lines",8,["prop","int_ops"],"Rise over run, and y = mx + b.",30],
   ["pyth","Pythagorean theorem",8,["exp_expr","area_perim"],"a² + b² = c² for right triangles.",25]
  ].forEach(([id,name,grade,pre,learn,min])=>S[id]={id,name,grade,pre,learn,min});
  const depth=id=>S[id].depth??=S[id].pre.length?1+Math.max(...S[id].pre.map(depth)):0;
  Object.keys(S).forEach(depth);
  const ancestors=(id,seen=new Set())=>{S[id].pre.forEach(p=>{if(!seen.has(p)){seen.add(p);ancestors(p,seen)}});return seen};
  const dependents=id=>Object.values(S).filter(s=>s.pre.includes(id)).map(s=>s.id);
  return{S,depth,ancestors,dependents};
})();
