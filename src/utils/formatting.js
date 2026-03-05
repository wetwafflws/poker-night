export const chip = v => (!v&&v!==0)?"Rp0":v>=1000000?`Rp${(v/1000000).toFixed(v%1000000?1:0)}M`:v>=1000?`Rp${(v/1000).toFixed(v%1000?1:0)}k`:`Rp${v}`;
