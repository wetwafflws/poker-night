export const chip = v => (!v&&v!==0)?"$0":v>=1000?`$${(v/1000).toFixed(v%1000?1:0)}k`:`$${v}`;
