import { Modal } from '../ui/Modal';
import { FormRow } from '../ui/FormRow';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function BlindsModal({ currentSB, currentBB, blindTimer, blindMultiplier, onUpdate, onClose, t }) {
  return (
    <Modal title="Adjust Blinds" onClose={onClose} t={t}>
      <FormRow label="Small Blind" t={t}>
        <Input type="number" value={currentSB} 
          onChange={e=>onUpdate({currentSB:+e.target.value})} 
          style={{width:110}} t={t}/>
      </FormRow>
      <FormRow label="Big Blind" t={t}>
        <Input type="number" value={currentBB} 
          onChange={e=>onUpdate({currentBB:+e.target.value})} 
          style={{width:110}} t={t}/>
      </FormRow>
      <FormRow label="Timer (min, 0=off)" t={t}>
        <Input type="number" value={blindTimer} 
          onChange={e=>onUpdate({blindTimer:+e.target.value})} 
          style={{width:90}} t={t}/>
      </FormRow>
      <FormRow label="Multiplier" t={t}>
        <Input type="number" step="0.5" value={blindMultiplier} 
          onChange={e=>onUpdate({blindMultiplier:+e.target.value})} 
          style={{width:90}} t={t}/>
      </FormRow>
      <Button onClick={onClose} bg={t.accent} style={{marginTop:10,width:"100%",padding:"11px"}} fz={15}>Save</Button>
    </Modal>
  );
}
