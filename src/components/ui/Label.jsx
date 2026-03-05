export function Label({ children, t }) {
  return <div style={{fontSize:11,fontWeight:700,color:t.textMuted,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12}}>{children}</div>;
}
