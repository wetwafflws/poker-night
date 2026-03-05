import { Modal } from '../ui/Modal';
import { FormRow } from '../ui/FormRow';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function AddPlayerModal({ newPlayerName, newPlayerBuyInAmt, buyIn, onNameChange, onAmountChange, onConfirm, onClose, t }) {
  return (
    <Modal title="Add New Player" onClose={onClose} t={t}>
      <FormRow label="Name" t={t}>
        <Input value={newPlayerName} onChange={e=>onNameChange(e.target.value)} 
          placeholder="Player name" style={{width:200}} t={t}/>
      </FormRow>
      <FormRow label="Buy-in amount" t={t}>
        <Input type="number" value={newPlayerBuyInAmt} onChange={e=>onAmountChange(e.target.value)} 
          placeholder={`${buyIn}`} style={{width:110}} t={t}/>
      </FormRow>
      <Button onClick={onConfirm} bg={t.accent} style={{width:"100%",padding:"12px",marginTop:8}} fz={15}>Add Player</Button>
    </Modal>
  );
}
