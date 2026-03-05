export function Input({ value, onChange, onKeyDown, type="text", placeholder, style={}, t }) {
  return (
    <input type={type} value={value} onChange={onChange} onKeyDown={onKeyDown} placeholder={placeholder}
      style={{background:t.surface2,border:`1.5px solid ${t.border}`,borderRadius:9,
              padding:"10px 13px",color:t.text,fontSize:14,fontFamily:"system-ui,sans-serif",
              outline:"none",boxSizing:"border-box",...style}}/>
  );
}
