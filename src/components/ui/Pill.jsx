export function Pill({ children, bg, color }) {
  return <span style={{background:bg,color,borderRadius:6,fontSize:11,padding:"2px 8px",fontWeight:700,lineHeight:1.5,whiteSpace:"nowrap"}}>{children}</span>;
}
