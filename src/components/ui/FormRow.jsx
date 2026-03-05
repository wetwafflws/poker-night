export function FormRow({ label, children, t }) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
      <span style={{color:t.textSub,fontSize:14}}>{label}</span>
      {children}
    </div>
  );
}
