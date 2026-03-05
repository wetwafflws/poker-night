import { Card } from '../ui/Card';
import { Label } from '../ui/Label';

export function ActionLog({ actionLog, t }) {
  return (
    <Card t={t} style={{maxHeight:160,overflowY:"auto"}}>
      <Label t={t}>Action Log</Label>
      {actionLog.length===0
        ?<div style={{color:t.border,fontSize:13}}>No actions yet.</div>
        :actionLog.map((l,i)=>(
          <div key={i} style={{color:i===0?t.accent:t.textMuted,fontSize:13,marginBottom:5,fontFamily:"'SF Mono',Consolas,monospace"}}>{l}</div>
        ))}
    </Card>
  );
}
