export function Card({ children, t, style={} }) {
  return <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:14,padding:18,...style}}>{children}</div>;
}
